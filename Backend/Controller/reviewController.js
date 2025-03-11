import axios from "axios";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import dotenv from "dotenv";
import natural from "natural";

dotenv.config();

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const AMAZON_COUNTRY = "IN";
const AMAZON_TLD = "in";

// NLP setup with stemming and negation handling
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const analyzer = new natural.SentimentAnalyzer("English", stemmer, "afinn"); // ✅ Corrected import

// Eco-friendly product aspects for feature-based sentiment analysis
const ECO_PRODUCT_ASPECTS = {
  sustainability: ["sustainable", "eco", "eco-friendly", "green", "environmental", "planet", "earth", "carbon", "footprint", "climate"],
  materials: ["material", "organic", "natural", "recycled", "biodegradable", "compostable", "plastic-free", "bamboo", "cotton", "jute"],
  packaging: ["packaging", "package", "wrap", "plastic", "minimal", "wasteful", "excess", "paper", "cardboard", "wrapper"],
  durability: ["durable", "quality", "last", "lasting", "sturdy", "strong", "robust", "lifespan", "long-lasting", "reusable"],
  effectiveness: ["work", "effective", "performance", "clean", "result", "efficient", "efficacy", "powerful", "results", "cleaning"],
  toxicity: ["chemical", "toxic", "natural", "safe", "harmful", "gentle", "harsh", "ingredient", "fragrance", "scent"],
  value: ["price", "value", "worth", "cost", "expensive", "cheap", "affordable", "investment", "pricey", "bargain"],
  ethics: ["ethical", "fair", "trade", "labor", "practice", "certified", "transparent", "company", "social", "responsible"]
};

// Eco-certification terminology
const ECO_CERTIFICATIONS = [
  "certified organic", "fair trade", "rainforest alliance", "carbon neutral", "cradle to cradle",
  "global organic textile", "fsc certified", "energy star", "b corp", "ecocert", "gots certified",
  "usda organic", "leaping bunny", "cruelty free", "vegan", "biodegradable", "compostable"
];

/**
 * Extract ASIN from Amazon URL
 */
function extractASIN(productUrl) {
  const asinMatch = productUrl.match(/(?:dp|product|asin)\/([A-Z0-9]{10})/);
  return asinMatch ? asinMatch[1] : null;
}

/**
 * Convert Flipkart URL to Reviews Page
 */
function convertToReviewUrl(productUrl) {
  try {
    const urlObj = new URL(productUrl);
    const pathSegments = urlObj.pathname.split("/");
    const productSlug = pathSegments[1];
    const productId = urlObj.searchParams.get("pid");

    return `https://www.flipkart.com/${productSlug}/product-reviews/${productId}?pid=${productId}`;
  } catch (error) {
    console.error("❌ URL Conversion Error:", error.message);
    return productUrl;
  }
}

/**
 * Sentiment Analysis with Negation Handling
 */
function analyzeSentiment(text) {
  if (!text) return { score: 0, comparative: 0, tokens: [], positive: [], negative: [] };

  // Tokenize and normalize text
  const rawTokens = tokenizer.tokenize(text.toLowerCase());
  
  // Handle negations by appending "NOT_" to words following negation terms
  let tokens = [];
  let negationActive = false;
  
  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];
    
    // Check for negation words
    if (['not', 'no', "don't", "doesn't", "isn't", "wasn't", "haven't", "hasn't", "didn't", "never", "cannot", "can't"].includes(token)) {
      negationActive = true;
      tokens.push(token);
    } 
    // End negation at punctuation
    else if (/[.!?,;:]/.test(token)) {
      negationActive = false;
      tokens.push(token);
    }
    // Apply negation prefix if active
    else {
      tokens.push(negationActive ? `NOT_${token}` : token);
    }
  }
  
  // Calculate sentiment using modified tokens
  const sentiment = analyzer.getSentiment(tokens);
  
  // Identify positive and negative terms
  const positive = [];
  const negative = [];
  
  tokens.forEach((token) => {
    if (token.startsWith('NOT_')) return; // Skip negated terms for simple list
    
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
}

/**
 * Extract eco-related claims and certifications
 */
function extractEcoClaims(reviews) {
  const claimMentions = {};
  
  // Initialize certification mentions
  ECO_CERTIFICATIONS.forEach(cert => {
    claimMentions[cert] = 0;
  });
  
  // Count certification mentions
  reviews.forEach(review => {
    const text = review.review.toLowerCase();
    
    ECO_CERTIFICATIONS.forEach(cert => {
      if (text.includes(cert.toLowerCase())) {
        claimMentions[cert]++;
      }
    });
  });
  
  // Get mentioned certifications sorted by frequency
  const mentionedCertifications = Object.entries(claimMentions)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([cert, count]) => ({ certification: cert, mentions: count }));
  
  // Check for greenwashing concerns (vague terms without specifics)
  const greenwashingTerms = ["green", "eco", "natural", "eco-friendly", "sustainable"];
  const greenwashingScore = reviews.reduce((score, review) => {
    const text = review.review.toLowerCase();
    
    // Check for vague terms without substantiation
    const hasVagueTerms = greenwashingTerms.some(term => text.includes(term));
    const hasSpecifics = ECO_CERTIFICATIONS.some(cert => text.includes(cert.toLowerCase())) || 
                         text.includes("ingredient") || 
                         text.includes("material");
    
    // Increment score for potentially vague claims
    if (hasVagueTerms && !hasSpecifics) {
      return score + 1;
    }
    return score;
  }, 0);
  
  return {
    certifications: mentionedCertifications,
    greenwashingConcern: greenwashingScore > reviews.length * 0.15 ? "High" : 
                         (greenwashingScore > reviews.length * 0.05 ? "Moderate" : "Low"),
    greenwashingScore: (greenwashingScore / reviews.length).toFixed(2)
  };
}

/**
 * Analyze eco-friendly product aspects from reviews
 */
function extractEcoAspectSentiments(reviews) {
  const aspects = {};
  
  // Initialize aspect categories
  Object.keys(ECO_PRODUCT_ASPECTS).forEach(aspect => {
    aspects[aspect] = {
      mentions: 0,
      score: 0,
      positive: 0,
      negative: 0,
      neutral: 0
    };
  });
  
  // Analyze each review for aspects
  reviews.forEach(review => {
    const text = review.review.toLowerCase();
    const analyzedSentiment = analyzeSentiment(text);
    
    // Check for each aspect's keywords
    Object.entries(ECO_PRODUCT_ASPECTS).forEach(([aspect, keywords]) => {
      // Check if any keyword from this aspect appears in the review
      const found = keywords.some(keyword => text.includes(keyword));
      
      if (found) {
        aspects[aspect].mentions++;
        
        // Calculate sentiment for this aspect mention
        // Find sentences containing the aspect keywords
        const sentences = text.split(/[.!?]+/).filter(sentence => 
          keywords.some(keyword => sentence.includes(keyword))
        );
        
        if (sentences.length > 0) {
          // Calculate aspect-specific sentiment
          const sentimentSum = sentences.reduce((sum, sentence) => {
            const sentimentResult = analyzeSentiment(sentence);
            return sum + sentimentResult.score;
          }, 0);
          
          const avgSentiment = sentimentSum / sentences.length;
          aspects[aspect].score += avgSentiment;
          
          // Categorize sentiment
          if (avgSentiment > 0.05) aspects[aspect].positive++;
          else if (avgSentiment < -0.05) aspects[aspect].negative++;
          else aspects[aspect].neutral++;
        }
      }
    });
  });
  
  // Calculate average scores for each aspect
  Object.keys(aspects).forEach(aspect => {
    if (aspects[aspect].mentions > 0) {
      aspects[aspect].averageScore = aspects[aspect].score / aspects[aspect].mentions;
    } else {
      aspects[aspect].averageScore = 0;
    }
  });
  
  return aspects;
}

/**
 * Analyze sustainability concerns
 */
function analyzeSustainabilityConcerns(reviews) {
  const concerns = {
    greenwashing: 0,
    packaging: 0,
    durability: 0,
    effectiveness: 0,
    price: 0
  };
  
  const concernKeywords = {
    greenwashing: ["fake", "mislead", "not actually", "false", "claim", "greenwash", "pretend", "lie"],
    packaging: ["too much packaging", "excessive", "plastic", "wasteful", "unnecessary", "wrap", "wrapped"],
    durability: ["broke", "break", "fell apart", "flimsy", "cheap", "not last", "not durable", "short life"],
    effectiveness: ["doesn't work", "not effective", "ineffective", "waste of money", "doesn't clean", "weak"],
    price: ["expensive", "overpriced", "too costly", "not worth", "price", "cost", "pricey"]
  };
  
  reviews.forEach(review => {
    const text = review.review.toLowerCase();
    
    // Check for each concern
    Object.entries(concernKeywords).forEach(([concern, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        // Get the sentences with the concern
        const sentences = text.split(/[.!?]+/).filter(sentence => 
          keywords.some(keyword => sentence.includes(keyword))
        );
        
        // Only count negative sentiments as concerns
        sentences.forEach(sentence => {
          const sentiment = analyzeSentiment(sentence);
          if (sentiment.score < -0.1) {
            concerns[concern]++;
          }
        });
      }
    });
  });
  
  // Calculate percentage of reviews mentioning each concern
  const totalReviews = reviews.length;
  const concernPercentages = {};
  
  Object.entries(concerns).forEach(([concern, count]) => {
    concernPercentages[concern] = totalReviews > 0 ? 
      (count / totalReviews * 100).toFixed(1) + "%" : 
      "0%";
  });
  
  return concernPercentages;
}

/**
 * Extract key sustainability phrases from reviews
 */
function extractSustainabilityPhrases(reviews, maxPhrases = 5) {
  // Focus on eco-related terms and phrases
  const ecoTerms = [
    ...ECO_PRODUCT_ASPECTS.sustainability,
    ...ECO_PRODUCT_ASPECTS.materials,
    ...ECO_PRODUCT_ASPECTS.packaging,
    ...ECO_PRODUCT_ASPECTS.toxicity,
    ...ECO_PRODUCT_ASPECTS.ethics
  ];
  
  // Extract sentences containing eco terms
  const ecoSentences = [];
  
  reviews.forEach(review => {
    const sentences = review.review.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      if (ecoTerms.some(term => lowerSentence.includes(term))) {
        ecoSentences.push(sentence.trim());
      }
    });
  });
  
  // Extract phrases from these sentences
  const phrases = {};
  
  ecoSentences.forEach(sentence => {
    const tokens = tokenizer.tokenize(sentence.toLowerCase());
    
    // Extract 2-4 word phrases
    for (let n = 2; n <= 4; n++) {
      for (let i = 0; i <= tokens.length - n; i++) {
        const phrase = tokens.slice(i, i + n).join(' ');
        
        // Only count phrases with eco terms
        if (ecoTerms.some(term => phrase.includes(term))) {
          phrases[phrase] = (phrases[phrase] || 0) + 1;
        }
      }
    }
  });
  
  // Filter common stopword phrases
  const stopwords = ['the', 'and', 'a', 'is', 'it', 'to', 'i', 'this', 'that', 'of', 'for'];
  const filteredPhrases = Object.entries(phrases).filter(([phrase, count]) => {
    // Remove phrases that start or end with stopwords
    const phraseWords = phrase.split(' ');
    if (stopwords.includes(phraseWords[0]) || stopwords.includes(phraseWords[phraseWords.length - 1])) {
      return false;
    }
    
    // Keep phrases mentioned multiple times
    return count > 1;
  });
  
  // Sort by frequency and return top phrases
  return filteredPhrases
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxPhrases)
    .map(([phrase, count]) => ({ phrase, count }));
}

/**
 * Analyze whether product lives up to eco-friendly claims
 */
function analyzeClaimSatisfaction(reviews) {
  let satisfactionScore = 0;
  let totalRelevantReviews = 0;
  
  // Look for phrases indicating satisfaction with eco-claims
  const satisfactionPhrases = [
    "as advertised", "as described", "eco-friendly", "sustainable", "good for environment",
    "planet friendly", "actually works", "actually green", "truly", "really is", "genuinely"
  ];
  
  const disappointmentPhrases = [
    "not as green", "not eco", "greenwashing", "misleading", "fake", "false claim", 
    "not sustainable", "not environmentally", "bad for environment", "just marketing"
  ];
  
  reviews.forEach(review => {
    const text = review.review.toLowerCase();
    
    // Check if review discusses eco aspects
    const isEcoRelevant = [
      ...Object.values(ECO_PRODUCT_ASPECTS)
    ].flat().some(term => text.includes(term));
    
    if (isEcoRelevant) {
      totalRelevantReviews++;
      
      // Check satisfaction phrases
      const hasSatisfaction = satisfactionPhrases.some(phrase => text.includes(phrase));
      const hasDisappointment = disappointmentPhrases.some(phrase => text.includes(phrase));
      
      if (hasSatisfaction && !hasDisappointment) {
        satisfactionScore += 1;
      } else if (hasDisappointment && !hasSatisfaction) {
        satisfactionScore -= 1;
      } else if (hasSatisfaction && hasDisappointment) {
        // Mixed review, analyze sentiment
        const sentiment = analyzeSentiment(text);
        satisfactionScore += sentiment.score > 0 ? 0.5 : -0.5;
      }
    }
  });
  
  // Calculate satisfaction level
  const satisfactionLevel = totalRelevantReviews > 0 ?
    (satisfactionScore / totalRelevantReviews) : 0;
  
  let satisfactionCategory;
  if (satisfactionLevel > 0.5) satisfactionCategory = "High";
  else if (satisfactionLevel > 0) satisfactionCategory = "Moderate";
  else if (satisfactionLevel > -0.5) satisfactionCategory = "Low";
  else satisfactionCategory = "Very Low";
  
  return {
    satisfactionCategory,
    satisfactionScore: satisfactionLevel.toFixed(2),
    relevantReviewCount: totalRelevantReviews
  };
}

/**
 * Comprehensive Review Analysis for Eco-Friendly Products
 */
function summarizeEcoReviews(reviews, overallRating, totalReviews) {
  if (!reviews.length) {
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

  // Basic sentiment analysis
  const sentimentResults = reviews.map(review => ({
    text: review.review,
    sentiment: analyzeSentiment(review.review)
  }));

  const totalSentiment = sentimentResults.reduce((sum, item) => sum + item.sentiment.score, 0);
  const averageSentiment = totalSentiment / sentimentResults.length;

  // Determine overall sentiment category
  let sentimentCategory = "Neutral";
  if (averageSentiment > 0.2) sentimentCategory = "Positive";
  else if (averageSentiment < -0.2) sentimentCategory = "Negative";

  // Extract common positive and negative words
  const positiveWords = sentimentResults.flatMap(res => res.sentiment.positive);
  const negativeWords = sentimentResults.flatMap(res => res.sentiment.negative);
  
  // Count word frequencies
  const countFrequency = words => {
    const freq = {};
    words.forEach(word => {
      freq[word] = (freq[word] || 0) + 1;
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));
  };
  
  const commonPros = countFrequency(positiveWords);
  const commonCons = countFrequency(negativeWords);

  // Eco-specific analysis
  const aspectSentiments = extractEcoAspectSentiments(reviews);
  const ecoClaims = extractEcoClaims(reviews);
  const sustainabilityConcerns = analyzeSustainabilityConcerns(reviews);
  const sustainabilityPhrases = extractSustainabilityPhrases(reviews);
  const claimSatisfaction = analyzeClaimSatisfaction(reviews);
  
  // Identify top positive and negative aspects
  const sortedAspects = Object.entries(aspectSentiments)
    .filter(([_, data]) => data.mentions > 0)
    .map(([aspect, data]) => ({
      aspect,
      ...data
    }))
    .sort((a, b) => b.mentions - a.mentions);
  
  const topPositiveAspects = sortedAspects
    .filter(aspect => aspect.averageScore > 0)
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3)
    .map(aspect => ({
      aspect: aspect.aspect,
      score: aspect.averageScore.toFixed(2),
      mentions: aspect.mentions
    }));
  
  const topNegativeAspects = sortedAspects
    .filter(aspect => aspect.averageScore < 0)
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 3)
    .map(aspect => ({
      aspect: aspect.aspect,
      score: aspect.averageScore.toFixed(2),
      mentions: aspect.mentions
    }));

  // Generate eco-focused recommendations
  const recommendations = [];
  
  // Sustainability performance
  if (claimSatisfaction.satisfactionCategory === "High") {
    recommendations.push("Genuinely eco-friendly product that lives up to its claims");
  } else if (claimSatisfaction.satisfactionCategory === "Low" || claimSatisfaction.satisfactionCategory === "Very Low") {
    recommendations.push("Sustainability claims may not be fully supported by customer experiences");
  }
  
  // Find strong positive aspects
  const strongPositives = sortedAspects
    .filter(aspect => aspect.averageScore > 0.3 && aspect.mentions >= 3)
    .map(aspect => aspect.aspect);
  
  if (strongPositives.length > 0) {
    recommendations.push(`Strong eco-friendly features: ${strongPositives.join(', ')}`);
  }
  
  // Find weak aspects
  const weakAspects = sortedAspects
    .filter(aspect => aspect.averageScore < -0.3 && aspect.mentions >= 3)
    .map(aspect => aspect.aspect);
  
  if (weakAspects.length > 0) {
    recommendations.push(`Areas for sustainability improvement: ${weakAspects.join(', ')}`);
  }
  
  // Greenwashing concerns
  if (ecoClaims.greenwashingConcern === "High") {
    recommendations.push("Potential greenwashing concerns - claims may be vague or unsubstantiated");
  }

  return {
    summary: {
      overallSentiment: sentimentCategory,
      averageRating: overallRating,
      totalReviews,
      sentimentScore: averageSentiment.toFixed(2),
      pros: commonPros.length ? commonPros : [{ word: "Not enough data", count: 0 }],
      cons: commonCons.length ? commonCons : [{ word: "Not enough data", count: 0 }]
    },
    sustainabilityAnalysis: {
      topEcoAspects: sortedAspects.slice(0, 5),
      topPositiveAspects,
      topNegativeAspects,
      sustainabilityConcerns,
      ecoClaims,
      claimSatisfaction,
      sustainabilityPhrases
    },
    recommendations: recommendations.length ? recommendations : ["Not enough eco-specific data for recommendations"]
  };
}

/**
 * Scrape Amazon Reviews
 */
async function getAmazonReviews(url) {
  try {
    const ASIN = extractASIN(url);
    if (!ASIN) throw new Error("Invalid Amazon product URL!");

    const apiUrl = `https://api.scraperapi.com/structured/amazon/product?api_key=${SCRAPER_API_KEY}&asin=${ASIN}&country=${AMAZON_COUNTRY}&tld=${AMAZON_TLD}`;

    console.log("Fetching Amazon reviews for:", ASIN);
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

    const data = await response.json();
    const reviews = data?.reviews?.map((r) => ({ 
      review: r.review, 
      date: r.date || null,
      rating: r.rating || null
    })) || [];
    
    const summary = summarizeEcoReviews(reviews, data?.average_rating || "No rating found", data?.total_reviews || "No reviews found");

    return {
      source: "amazon",
      productName: data?.name || "Unknown Product",
      ...summary
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Scrape Flipkart Reviews
 */
async function getFlipkartReviews(url, maxPages = 5) {
    console.log("🚀 Fetching Flipkart reviews from:", url);

    try {
        const reviewUrl = convertToReviewUrl(url);
        let allReviews = [];
        let overallRating = "N/A";

        const pageUrls = Array.from({ length: maxPages }, (_, i) => `${reviewUrl}&page=${i + 1}`);

        const fetchPage = async (pagedUrl) => {
            try {
                const apiUrl = `https://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(pagedUrl)}`;
                
                // Fetch with timeout to prevent hanging requests
                const { data } = await axios.get(apiUrl, {
                    headers: { "User-Agent": "Mozilla/5.0" },
                    timeout: 5000, // 5s timeout
                });

                const $ = cheerio.load(data);

                if (pagedUrl.includes("page=1")) {
                    overallRating = $("div.ipqd2A").first().text().trim() || "N/A";
                }

                const reviews = $("div.ZmyHeo")
                    .map((_, el) => $(el).text().trim())
                    .get();

                return { success: true, data: reviews };
            } catch (error) {
                console.warn(`❌ Failed to fetch ${pagedUrl}: ${error.message}`);
                return { success: false, data: [] };
            }
        };

        // Fetch all pages in parallel (ignoring failures)
        const responses = await Promise.allSettled(pageUrls.map(fetchPage));

        // Collect successful results
        responses.forEach(({ status, value }) => {
            if (status === "fulfilled" && value.success) {
                allReviews.push(...value.data);
            }
        });

        const reviews = allReviews.map((review) => ({ review }));
        console.log("✅ Total reviews fetched:", reviews.length);

        const summary = summarizeEcoReviews(reviews, overallRating, allReviews.length);

        return { source: "flipkart", ...summary };
    } catch (error) {
        console.error("❌ Error fetching Flipkart reviews:", error);
        throw error;
    }
}

/**
 * Unified API to Get Reviews and Sentiment Analysis
 */
async function getReviews(req, res) {
  const { url, source, maxPages = 5 } = req.body;
  if (!url) return res.status(400).json({ error: "Product URL is required!" });
  if (!source) return res.status(400).json({ error: "Source (amazon or flipkart) is required!" });
  if (!SCRAPER_API_KEY) return res.status(500).json({ error: "API key is missing!" });

  try {
    let response;
    if (source.toLowerCase() === "amazon") {
      response = await getAmazonReviews(url);
    } else if (source.toLowerCase() === "flipkart") {
      response = await getFlipkartReviews(url, maxPages);
    } else {
      return res.status(400).json({ error: "Invalid source. Use 'amazon' or 'flipkart'." });
    }

    return res.json(response);
  } catch (error) {
    console.error(`❌ Error fetching ${source} reviews:`, error.message);
    return res.status(500).json({ error: `Failed to fetch ${source} reviews`, details: error.message });
  }
}

export { getReviews };