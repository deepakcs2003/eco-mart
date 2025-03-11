import React from "react";
import { Star, ThumbsUp, ThumbsDown, Leaf, Package, Clock, DollarSign, Info, Award, AlertTriangle } from "lucide-react";

const ProductReviews = ({ reviews = {} }) => {
  // Destructure with default empty objects to prevent errors
  const { source = "", summary = {}, sustainabilityAnalysis = {}, recommendations = [] } = reviews;
  
  // Color scheme
  const colors = {
    primary: "#228B22",    // Forest Green
    secondary: "#6B8E23",  // Olive Green
    background: "#A8B5A2", // Sage Green
    accent1: "#317873",    // Deep Teal
    accent2: "#87CEEB",    // Sky Blue
    neutral1: "#8B5A2B",   // Earthy Brown
    neutral2: "#F5DEB3",   // Warm Beige
    alert: "#A52A2A",      // Rustic Red
    text: "#000000"        // Black text
  };
  
  // Format numbers
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0.00";
    return parseFloat(num).toFixed(2);
  };

  // Calculate star rating
  const rating = parseFloat(summary.averageRating || 0);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Safe array access function
  const safeArray = (arr) => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr;
  };

  // Safe object access function
  const safeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return {};
    return obj;
  };

  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }} className="max-w-6xl mx-auto p-6 rounded-lg shadow">
      {/* Header */}
      <div style={{ backgroundColor: colors.neutral2 }} className="flex items-center justify-between mb-6 p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>Product Reviews Summary</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: colors.text }}>Source:</span>
          <span className="text-sm font-bold capitalize" style={{ color: colors.accent1 }}>{source}</span>
        </div>
      </div>

      {/* Overall Summary */}
      <div style={{ backgroundColor: colors.neutral2 }} className="p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Overall Rating</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rating Stars */}
          <div style={{ backgroundColor: colors.background }} className="flex flex-col items-center justify-center p-4 rounded-lg">
            <div className="text-3xl font-bold mb-2" style={{ color: colors.text }}>{summary.averageRating || 0}</div>
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < fullStars ? (
                    <Star style={{ fill: colors.secondary, color: colors.secondary }} />
                  ) : i === fullStars && hasHalfStar ? (
                    <Star style={{ fill: colors.secondary, color: colors.secondary }} />
                  ) : (
                    <Star style={{ color: colors.secondary }} />
                  )}
                </span>
              ))}
            </div>
            <div className="text-sm" style={{ color: colors.text }}>Total Reviews: {summary.totalReviews || 0}</div>
          </div>
          
          {/* Sentiment Score */}
          <div style={{ backgroundColor: colors.background }} className="flex flex-col items-center justify-center p-4 rounded-lg">
            <div className="text-lg font-semibold mb-2" style={{ color: colors.text }}>Sentiment</div>
            <div 
              style={{ 
                backgroundColor: summary.overallSentiment === "Positive" ? colors.primary : colors.alert,
                color: "#FFFFFF"
              }} 
              className="text-2xl font-bold rounded-full w-16 h-16 flex items-center justify-center"
            >
              {Math.round(parseFloat(summary.sentimentScore || 0) * 100)}%
            </div>
            <div className="mt-2 text-lg font-medium" style={{ color: colors.text }}>
              Overall: {summary.overallSentiment || 'N/A'}
            </div>
            <div className="mt-1 text-sm" style={{ color: colors.text }}>
              Sentiment Score: {summary.sentimentScore || 0}
            </div>
          </div>
          
          {/* Pros and Cons */}
          <div style={{ backgroundColor: colors.background }} className="flex flex-col p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp style={{ color: colors.primary }} size={20} />
              <span className="font-semibold" style={{ color: colors.text }}>Pros</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {safeArray(summary.pros).map((pro, index) => (
                <span key={index} 
                  style={{ backgroundColor: colors.primary, color: "#FFFFFF" }} 
                  className="px-2 py-1 rounded-full text-xs">
                  {pro.word} ({pro.count})
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <ThumbsDown style={{ color: colors.alert }} size={20} />
              <span className="font-semibold" style={{ color: colors.text }}>Cons</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {safeArray(summary.cons).map((con, index) => (
                <span key={index} 
                  style={{ backgroundColor: colors.alert, color: "#FFFFFF" }} 
                  className="px-2 py-1 rounded-full text-xs">
                  {con.word} ({con.count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sustainability Analysis */}
      <div style={{ backgroundColor: colors.neutral2 }} className="p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
          <div className="flex items-center gap-2">
            <Leaf style={{ color: colors.primary }} />
            <span>Sustainability Analysis</span>
          </div>
        </h2>
        
        {/* Top Eco Aspects */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{ color: colors.secondary }}>Top Eco Aspects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {safeArray(sustainabilityAnalysis.topEcoAspects).map((aspect, index) => (
              <div key={index} style={{ backgroundColor: colors.background }} className="p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="capitalize font-medium" style={{ color: colors.text }}>{aspect.aspect}</span>
                  <div 
                    style={{ 
                      backgroundColor: aspect.score > 0 ? colors.primary : aspect.score < 0 ? colors.alert : colors.neutral1,
                      color: "#FFFFFF"
                    }}
                    className="px-2 py-1 rounded text-xs"
                  >
                    Score: {formatNumber(aspect.score)}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div className="flex flex-col items-center" style={{ color: colors.text }}>
                    <span>Mentions</span>
                    <span className="font-bold">{aspect.mentions}</span>
                  </div>
                  <div className="flex flex-col items-center" style={{ color: colors.primary }}>
                    <span>Positive</span>
                    <span className="font-bold">{aspect.positive}</span>
                  </div>
                  <div className="flex flex-col items-center" style={{ color: colors.alert }}>
                    <span>Negative</span>
                    <span className="font-bold">{aspect.negative}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Positive & Negative Aspects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-3" style={{ color: colors.secondary }}>Top Positive Aspects</h3>
            <div style={{ backgroundColor: colors.background }} className="p-3 rounded">
              {safeArray(sustainabilityAnalysis.topPositiveAspects).map((aspect, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <div className="flex justify-between items-center">
                    <span className="capitalize font-medium" style={{ color: colors.text }}>{aspect.aspect}</span>
                    <span className="text-sm font-bold" style={{ color: colors.primary }}>Score: {aspect.score}</span>
                  </div>
                  <div className="text-sm" style={{ color: colors.text }}>Mentions: {aspect.mentions}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3" style={{ color: colors.secondary }}>Top Negative Aspects</h3>
            <div style={{ backgroundColor: colors.background }} className="p-3 rounded">
              {safeArray(sustainabilityAnalysis.topNegativeAspects).length > 0 ? (
                safeArray(sustainabilityAnalysis.topNegativeAspects).map((aspect, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium" style={{ color: colors.text }}>{aspect.aspect}</span>
                      <span className="text-sm font-bold" style={{ color: colors.alert }}>Score: {aspect.score}</span>
                    </div>
                    <div className="text-sm" style={{ color: colors.text }}>Mentions: {aspect.mentions}</div>
                  </div>
                ))
              ) : (
                <p style={{ color: colors.text }}>No negative aspects found.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Sustainability Concerns */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{ color: colors.secondary }}>Sustainability Concerns</h3>
          <div style={{ backgroundColor: colors.background }} className="p-3 rounded">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(safeObject(sustainabilityAnalysis.sustainabilityConcerns)).map(([concern, percentage], index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center gap-1 mb-1">
                    {concern === "greenwashing" && <Leaf size={16} style={{ color: colors.primary }} />}
                    {concern === "packaging" && <Package size={16} style={{ color: colors.accent1 }} />}
                    {concern === "durability" && <Clock size={16} style={{ color: colors.secondary }} />}
                    {concern === "effectiveness" && <Award size={16} style={{ color: colors.accent2 }} />}
                    {concern === "price" && <DollarSign size={16} style={{ color: colors.neutral1 }} />}
                    <span className="text-sm font-medium capitalize" style={{ color: colors.text }}>{concern}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      style={{ 
                        backgroundColor: parseFloat(percentage) > 10 ? colors.alert : 
                                       parseFloat(percentage) > 5 ? colors.secondary : 
                                       colors.primary,
                        width: `${percentage}%`
                      }}
                      className="rounded-full h-2"
                    ></div>
                  </div>
                  <div className="text-xs mt-1" style={{ color: colors.text }}>{percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Eco Claims */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{ color: colors.secondary }}>Eco Claims</h3>
          <div style={{ backgroundColor: colors.background }} className="p-3 rounded grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: colors.text }}>Greenwashing Concern:</div>
              <div 
                style={{ 
                  backgroundColor: safeObject(sustainabilityAnalysis.ecoClaims).greenwashingConcern === "Low" ? colors.primary : 
                                 safeObject(sustainabilityAnalysis.ecoClaims).greenwashingConcern === "Moderate" ? colors.secondary : 
                                 colors.alert,
                  color: "#FFFFFF"
                }}
                className="px-2 py-1 rounded text-center font-medium"
              >
                {safeObject(sustainabilityAnalysis.ecoClaims).greenwashingConcern || 'N/A'}
              </div>
              <div className="text-sm mt-1" style={{ color: colors.text }}>
                Score: {safeObject(sustainabilityAnalysis.ecoClaims).greenwashingScore || 0}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: colors.text }}>Certifications:</div>
              {safeArray(safeObject(sustainabilityAnalysis.ecoClaims).certifications).length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {safeArray(safeObject(sustainabilityAnalysis.ecoClaims).certifications).map((cert, index) => (
                    <span key={index} 
                      style={{ backgroundColor: colors.accent1, color: "#FFFFFF" }} 
                      className="px-2 py-1 rounded-full text-xs">
                      {typeof cert === 'object' ? cert.certification : cert}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm italic" style={{ color: colors.text }}>No certifications found</div>
              )}
            </div>
            
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: colors.text }}>Sustainability Phrases:</div>
              {safeArray(sustainabilityAnalysis.sustainabilityPhrases).length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {safeArray(sustainabilityAnalysis.sustainabilityPhrases).map((phrase, index) => (
                    <span key={index} 
                      style={{ backgroundColor: colors.primary, color: "#FFFFFF" }} 
                      className="px-2 py-1 rounded-full text-xs">
                      {typeof phrase === 'object' ? phrase.phrase : phrase}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm italic" style={{ color: colors.text }}>No sustainability phrases found</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Claim Satisfaction */}
        <div>
          <h3 className="font-semibold mb-3" style={{ color: colors.secondary }}>Claim Satisfaction</h3>
          <div style={{ backgroundColor: colors.background }} className="p-3 rounded grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: colors.text }}>Satisfaction Category:</div>
              <div 
                style={{ 
                  backgroundColor: safeObject(sustainabilityAnalysis.claimSatisfaction).satisfactionCategory === "High" ? colors.primary : 
                                 safeObject(sustainabilityAnalysis.claimSatisfaction).satisfactionCategory === "Medium" ? colors.secondary : 
                                 colors.alert,
                  color: "#FFFFFF"
                }}
                className="px-2 py-1 rounded text-center font-medium"
              >
                {safeObject(sustainabilityAnalysis.claimSatisfaction).satisfactionCategory || 'N/A'}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: colors.text }}>Satisfaction Score:</div>
              <div className="text-lg font-bold" style={{ color: colors.text }}>
                {safeObject(sustainabilityAnalysis.claimSatisfaction).satisfactionScore || 0}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: colors.text }}>Relevant Reviews:</div>
              <div className="text-lg font-bold" style={{ color: colors.text }}>
                {safeObject(sustainabilityAnalysis.claimSatisfaction).relevantReviewCount || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      {safeArray(recommendations).length > 0 && (
        <div style={{ backgroundColor: colors.neutral2 }} className="p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.primary }}>
            <div className="flex items-center gap-2">
              <AlertTriangle style={{ color: colors.accent1 }} />
              <span>Recommendations</span>
            </div>
          </h2>
          <ul style={{ backgroundColor: colors.background }} className="rounded p-3 space-y-2">
            {safeArray(recommendations).map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <div style={{ backgroundColor: colors.accent1, color: "#FFFFFF" }} className="rounded-full p-1 mt-0.5 h-5 w-5 flex items-center justify-center">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <span style={{ color: colors.text }}>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Original Reviews section (if needed) */}
      <div style={{ backgroundColor: colors.neutral2 }} className="p-4 rounded-lg shadow-sm mt-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Product Reviews</h2>
        {/* This section would display the reviews array if it's passed to the component */}
        <div style={{ backgroundColor: colors.background, color: colors.text }} className="p-3 rounded">
          <p>Review data can be displayed here when available.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;