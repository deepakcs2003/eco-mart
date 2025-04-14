import axios from "axios";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import dotenv from "dotenv";
import natural from "natural";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// API Keys and Configuration
const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AMAZON_COUNTRY = "IN";
const AMAZON_TLD = "in";

// Initialize Gemini client and NLP tools
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const analyzer = new natural.SentimentAnalyzer("English", stemmer, "afinn");

// Request rate limiter for API calls
class RateLimiter {
  constructor(maxRequests = 10, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requestQueue = [];
    this.processing = false;
  }

  async throttleRequest(fn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ fn, resolve, reject });
      if (!this.processing) this.processQueue();
    });
  }

  async processQueue() {
    if (this.requestQueue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    
    // Clean up old timestamps
    const now = Date.now();
    this.requestQueue = this.requestQueue.filter(
      request => !request.timestamp || now - request.timestamp < this.timeWindow
    );

    const activeRequests = this.requestQueue.filter(req => req.timestamp).length;
    
    if (activeRequests < this.maxRequests) {
      const nextRequest = this.requestQueue.find(req => !req.timestamp);
      if (nextRequest) {
        nextRequest.timestamp = now;
        try {
          const result = await nextRequest.fn();
          nextRequest.resolve(result);
        } catch (error) {
          nextRequest.reject(error);
        } finally {
          this.requestQueue = this.requestQueue.filter(req => req !== nextRequest);
          await new Promise(resolve => setTimeout(resolve, 1000));
          this.processQueue();
        }
      } else {
        setTimeout(() => this.processQueue(), 1000);
      }
    } else {
      setTimeout(() => this.processQueue(), 5000);
    }
  }
}

// Create rate limiter
const geminiRateLimiter = new RateLimiter(5, 60000);

/**
 * Helper functions for URL and data processing
 */
const helpers = {
  extractASIN(productUrl) {
    const asinMatch = productUrl.match(/(?:dp|product|asin)\/([A-Z0-9]{10})/);
    return asinMatch ? asinMatch[1] : null;
  },
  
  convertToReviewUrl(productUrl) {
    try {
      const urlObj = new URL(productUrl);
      const productSlug = urlObj.pathname.split("/")[1];
      const productId = urlObj.searchParams.get("pid");
      return `https://www.flipkart.com/${productSlug}/product-reviews/${productId}?pid=${productId}`;
    } catch (error) {
      console.error("❌ URL Conversion Error:", error.message);
      return productUrl;
    }
  },
  
  formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  }
};

/**
 * Sentiment Analysis functions
 */
const sentimentAnalysis = {
  withNLP(text) {
    if (!text) return { score: 0, comparative: 0, tokens: [], positive: [], negative: [] };

    const rawTokens = tokenizer.tokenize(text.toLowerCase());
    let tokens = [];
    let negationActive = false;

    for (let i = 0; i < rawTokens.length; i++) {
      const token = rawTokens[i];
      if (['not', 'no', "don't", "doesn't", "isn't", "wasn't", "haven't", "hasn't", "didn't", "never", "cannot", "can't"].includes(token)) {
        negationActive = true;
        tokens.push(token);
      } else if (/[.!?,;:]/.test(token)) {
        negationActive = false;
        tokens.push(token);
      } else {
        tokens.push(negationActive ? `NOT_${token}` : token);
      }
    }

    const sentiment = analyzer.getSentiment(tokens);
    const positive = [];
    const negative = [];

    tokens.forEach((token) => {
      if (token.startsWith('NOT_')) return;
      const tokenSentiment = analyzer.getSentiment([token]);
      if (tokenSentiment > 0) positive.push(token);
      if (tokenSentiment < 0) negative.push(token);
    });

    return {
      score: sentiment,
      comparative: tokens.length > 0 ? sentiment / tokens.length : 0,
      positive,
      negative,
      tokens
    };
  },

  async withGemini(text) {
    if (!text || text.trim().length < 10) {
      return {
        score: 0,
        sentiment: "Neutral",
        positive: [],
        negative: [],
        confidence: 0
      };
    }

    return geminiRateLimiter.throttleRequest(async () => {
      try {
        const prompt = `
            You are a sentiment analysis expert. Analyze the following review and respond with ONLY a JSON object containing:
            {"sentiment": "Positive", "score": 0.7, "confidence": 0.9, "key_positives": ["aspect1", "aspect2"], "key_negatives": ["aspect3"]}.
            Review: "${text}"
            Return ONLY a JSON object with no explanation or additional text.
        `;

        const response = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          generationConfig: { temperature: 0.3, topP: 0.8, topK: 40 }
        });

        const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) throw new Error("No text content in response");

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in response");

        const parsedResponse = JSON.parse(jsonMatch[0]);
        
        // Convert string sentiment to numeric score if needed
        if (typeof parsedResponse.score !== 'number') {
          switch (parsedResponse.sentiment?.toLowerCase()) {
            case 'positive': parsedResponse.score = 0.7; break;
            case 'negative': parsedResponse.score = -0.7; break;
            default: parsedResponse.score = 0; break;
          }
        }

        return {
          score: parsedResponse.score,
          sentiment: parsedResponse.sentiment,
          positive: parsedResponse.key_positives || [],
          negative: parsedResponse.key_negatives || [],
          confidence: parsedResponse.confidence || 0.8,
        };
      } catch (error) {
        console.error("❌ Gemini Sentiment Analysis Error:", error.message);
        // Fallback to NLP
        const nlpSentiment = sentimentAnalysis.withNLP(text);
        let sentimentCategory = "Neutral";
        if (nlpSentiment.score > 0.2) sentimentCategory = "Positive";
        else if (nlpSentiment.score < -0.2) sentimentCategory = "Negative";

        return {
          score: nlpSentiment.score,
          sentiment: sentimentCategory,
          positive: nlpSentiment.positive,
          negative: nlpSentiment.negative,
          confidence: 0.5,
        };
      }
    });
  }
};

/**
 * Summary generation with Gemini
 */
async function generateReviewSummary(reviews, productName, overallRating, totalReviews) {
  if (!reviews?.length) {
    return {
      summary: "No reviews available to summarize.",
      pros: [],
      cons: [],
      key_features: [],
      verdict: "Insufficient data to make a recommendation."
    };
  }

  const reviewSample = reviews.slice(0, 5).map(r => r.review).join("\n\n");

  return geminiRateLimiter.throttleRequest(async () => {
    try {
      const prompt = `
        You are a product review analyst. Create a concise summary of the following reviews.
        Respond with ONLY a JSON object containing:
        {"summary": "...", "pros": ["...", "..."], "cons": ["...", "..."], "key_features": ["...", "..."], "verdict": "..."}.
        Product: ${productName || "Unknown Product"}
        Overall Rating: ${overallRating}
        Total Reviews: ${totalReviews}
        Reviews: ${reviewSample}
        Return ONLY a JSON object with no explanation or additional text.
      `;

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        generationConfig: {
          temperature: 0.5,
          topP: 0.9,
          maxOutputTokens: 1024,
        }
      });

      const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) throw new Error("No text content in response");

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("❌ Gemini Summary Error:", error.message);
      // Create fallback summary
      return {
        summary: `This product has an average rating of ${overallRating} based on ${totalReviews} reviews.`,
        pros: reviews.slice(0, 3).map(r => r.review.split('.')[0]).filter(text => text.length > 10),
        cons: [],
        key_features: [],
        verdict: "Please read individual reviews for more details."
      };
    }
  });
}

/**
 * Process reviews and generate summary
 */
async function processReviews(reviews, overallRating, totalReviews, productName = "Unknown Product") {
  if (!reviews?.length) {
    return {
      summary: {
        overallSentiment: "No data",
        averageRating: overallRating,
        totalReviews,
        pros: ["Not enough data"],
        cons: ["Not enough data"]
      }
    };
  }

  const positiveReviews = [];
  const negativeReviews = [];
  const neutralReviews = [];

  // Analyze a sample of reviews with Gemini
  const sampleSize = Math.min(reviews.length, 5);
  const sampleReviews = reviews.slice(0, sampleSize);
  const remainingReviews = reviews.slice(sampleSize);
  
  // Process sample with Gemini
  for (const review of sampleReviews) {
    try {
      const sentiment = await sentimentAnalysis.withGemini(review.review);
      const target = sentiment.score > 0.2 ? positiveReviews : 
                     sentiment.score < -0.2 ? negativeReviews : neutralReviews;
      target.push({ ...review, sentiment });
    } catch (error) {
      console.error(`❌ Sentiment analysis error:`, error.message);
      // Fallback to NLP
      const nlpSentiment = sentimentAnalysis.withNLP(review.review);
      const formattedSentiment = {
        score: nlpSentiment.score,
        sentiment: nlpSentiment.score > 0.2 ? "Positive" : 
                  nlpSentiment.score < -0.2 ? "Negative" : "Neutral",
        positive: nlpSentiment.positive,
        negative: nlpSentiment.negative,
        confidence: 0.5
      };
      
      const target = nlpSentiment.score > 0.2 ? positiveReviews : 
                     nlpSentiment.score < -0.2 ? negativeReviews : neutralReviews;
      target.push({ ...review, sentiment: formattedSentiment });
    }
  }
  
  // Process remaining reviews with NLP only
  for (const review of remainingReviews) {
    const nlpSentiment = sentimentAnalysis.withNLP(review.review);
    const formattedSentiment = {
      score: nlpSentiment.score,
      sentiment: nlpSentiment.score > 0.2 ? "Positive" : 
                nlpSentiment.score < -0.2 ? "Negative" : "Neutral",
      positive: nlpSentiment.positive,
      negative: nlpSentiment.negative,
      confidence: 0.5
    };
    
    const target = nlpSentiment.score > 0.2 ? positiveReviews : 
                   nlpSentiment.score < -0.2 ? negativeReviews : neutralReviews;
    target.push({ ...review, sentiment: formattedSentiment });
  }

  // Calculate average sentiment
  const allReviewsWithSentiment = [...positiveReviews, ...negativeReviews, ...neutralReviews];
  const totalSentiment = allReviewsWithSentiment.reduce((sum, item) => sum + (item?.sentiment?.score || 0), 0);
  const averageSentiment = allReviewsWithSentiment.length > 0 ? totalSentiment / allReviewsWithSentiment.length : 0;

  // Determine overall sentiment category
  let sentimentCategory = "Neutral";
  if (averageSentiment > 0.2) sentimentCategory = "Positive";
  else if (averageSentiment < -0.2) sentimentCategory = "Negative";

  // Generate AI summary
  const aiSummary = await generateReviewSummary(
    sampleReviews,
    productName,
    overallRating,
    totalReviews
  );

  return {
    summary: {
      overallSentiment: sentimentCategory,
      averageRating: overallRating,
      totalReviews,
      sentimentScore: averageSentiment.toFixed(2),
      positiveCount: positiveReviews.length,
      negativeCount: negativeReviews.length,
      neutralCount: neutralReviews.length,
      pros: aiSummary?.pros || [],
      cons: aiSummary?.cons || [],
      verdict: aiSummary?.verdict || "No clear verdict",
      keyFeatures: aiSummary?.key_features || [],
      summary: aiSummary?.summary || "No summary available"
    },
    positiveReviews: positiveReviews.slice(0, 3),
    negativeReviews: negativeReviews.slice(0, 3)
  };
}

/**
 * Data fetchers for different platforms
 */
const reviewFetchers = {
  async amazon(url) {
    const ASIN = helpers.extractASIN(url);
    if (!ASIN) throw new Error("Invalid Amazon product URL!");

    const apiUrl = `https://api.scraperapi.com/structured/amazon/product?api_key=${SCRAPER_API_KEY}&asin=${ASIN}&country=${AMAZON_COUNTRY}&tld=${AMAZON_TLD}`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

    const data = await response.json();
    const reviews = data?.reviews?.map((r) => ({
      review: r.review,
      date: r.date || null,
      rating: r.rating || null
    })) || [];

    const results = await processReviews(
      reviews,
      data?.average_rating || "No rating",
      data?.total_reviews || "No reviews",
      data?.name
    );

    return {
      source: "amazon",
      productName: data?.name || "Unknown Product",
      productImage: data?.main_image || null,
      productPrice: data?.price?.current_price || "Price not available",
      ...results
    };
  },

  async flipkart(url, maxPages = 2) {
    const reviewUrl = helpers.convertToReviewUrl(url);
    let allReviews = [];
    let overallRating = "N/A";
    let productName = "Unknown Product";
    let productImage = null;

    const pageUrls = Array.from({ length: maxPages }, (_, i) => `${reviewUrl}&page=${i + 1}`);

    for (const pagedUrl of pageUrls) {
      try {
        if (pagedUrl !== pageUrls[0]) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        const apiUrl = `https://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(pagedUrl)}`;

        const { data } = await axios.get(apiUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
          timeout: 15000,
        });

        const $ = cheerio.load(data);

        if (pagedUrl.includes("page=1")) {
          overallRating = $("div.ipqd2A").first().text().trim() || "N/A";
          productName = $("span._2d6jau").first().text().trim() || "Unknown Product";
          productImage = $("div._3nMexc img").first().attr("src") || null;
        }

        const reviews = $("div.ZmyHeo")
          .map((_, el) => $(el).text().trim())
          .get();

        allReviews.push(...reviews);
      } catch (error) {
        console.warn(`❌ Failed to fetch ${pagedUrl}: ${error.message}`);
      }
    }

    const reviews = allReviews.map((review) => ({ review }));
    const results = await processReviews(reviews, overallRating, allReviews.length, productName);

    return {
      source: "flipkart",
      productName,
      productImage,
      ...results
    };
  }
};

/**
 * Format results for the frontend
 */
function formatResponse(data) {
  return {
    product: {
      name: data.productName,
      image: data.productImage,
      price: data.productPrice,
      rating: data.summary.averageRating,
      totalReviews: data.summary.totalReviews
    },
    analysis: {
      sentiment: data.summary.overallSentiment,
      score: data.summary.sentimentScore,
      summary: data.summary.summary,
      verdict: data.summary.verdict,
      pros: data.summary.pros,
      cons: data.summary.cons,
      keyFeatures: data.summary.keyFeatures || []
    },
    highlights: {
      positive: (data.positiveReviews || []).map(r => ({
        text: r.review,
        date: helpers.formatDate(r.date),
        rating: r.rating
      })),
      negative: (data.negativeReviews || []).map(r => ({
        text: r.review,
        date: helpers.formatDate(r.date),
        rating: r.rating
      }))
    }
  };
}

/**
 * Main API handler
 */
export async function getReviews(req, res) {
  const { url, source, maxPages = 2 } = req.body;

  if (!url) return res.status(400).json({ error: "Product URL is required!" });
  if (!source) return res.status(400).json({ error: "Source (amazon or flipkart) is required!" });
  if (!SCRAPER_API_KEY) return res.status(500).json({ error: "Scraper API key is missing!" });
  if (!GEMINI_API_KEY) return res.status(500).json({ error: "Gemini API key is missing!" });

  try {
    let response;
    const sourceLower = source.toLowerCase();
    
    if (sourceLower === "amazon") {
      response = await reviewFetchers.amazon(url);
    } else if (sourceLower === "flipkart") {
      response = await reviewFetchers.flipkart(url, maxPages);
    } else {
      return res.status(400).json({ error: "Invalid source. Use 'amazon' or 'flipkart'." });
    }

    return res.json({
      success: true,
      source: sourceLower,
      data: formatResponse(response)
    });
  } catch (error) {
    console.error(`❌ Error fetching ${source} reviews:`, error.message);
    return res.status(500).json({
      success: false,
      error: `Failed to fetch ${source} reviews`,
      details: error.message
    });
  }
}