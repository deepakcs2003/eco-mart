import React from "react";
import { Star, ThumbsUp, ThumbsDown, Leaf, Award, AlertTriangle } from "lucide-react";

const ProductReviewDisplay = ({ reviews }) => {
  // Extract the data safely from your backend response
  const { source, data } = reviews || {};
  
  // Safely access nested properties
  const productData = data?.product || {};
  const summaryData = data?.summary || {};
  const analysisData = data?.analysis || {};
  const highlightsData = data?.highlights || {};
  const sustainabilityData = data?.sustainabilityAnalysis || {};

  // Format date helper function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return "N/A";
    }
  };

  // Format numbers with 2 decimal places
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0.00";
    return parseFloat(num).toFixed(2);
  };

  // Safe array access function
  const safeArray = (arr) => Array.isArray(arr) ? arr : [];

  // Calculate star rating
  const rating = parseFloat(productData?.rating || 0);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Color scheme
  const colors = {
    primary: "#228B22",     // Forest Green
    secondary: "#6B8E23",   // Olive Green
    background: "#F0FFF0",  // Light Green Background
    accent1: "#317873",     // Deep Teal
    alert: "#A52A2A",       // Rustic Red
    text: "#333333",        // Dark Gray text
    textSecondary: "#666666", // Lighter Gray text
    neutral2: "#FAF0E6",    // Light Beige
    border: "#DDDDDD",      // Light Gray border
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Product Header */}
    
      {/* Analysis Summary */}
      <div className="p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6" style={{ backgroundColor: colors.neutral2, border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: colors.primary }}>Analysis Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
          {/* Sentiment Score */}
          <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
            <div
              className="text-xl sm:text-2xl font-bold rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mr-3 sm:mr-4"
              style={{
                backgroundColor: analysisData?.sentiment === "Positive" ? colors.primary : 
                                analysisData?.sentiment === "Negative" ? colors.alert : colors.textSecondary,
                color: "#FFFFFF"
              }}
            >
              {Math.round(parseFloat(analysisData?.score || 0) * 100)}%
            </div>
            <div>
              <div className="text-base sm:text-lg font-semibold" style={{ color: colors.text }}>
                Overall: {analysisData?.sentiment || 'N/A'}
              </div>
              <div className="text-xs sm:text-sm" style={{ color: colors.textSecondary }}>
                Sentiment Score: {formatNumber(analysisData?.score)}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
            <div className="text-2xl sm:text-3xl font-bold mr-3 sm:mr-4" style={{ color: colors.text }}>{formatNumber(rating)}</div>
            <div>
              <div className="flex mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    style={{ 
                      fill: i < fullStars || (i === fullStars && hasHalfStar) ? colors.secondary : "none", 
                      color: colors.secondary 
                    }} 
                  />
                ))}
              </div>
              <div className="text-xs sm:text-sm" style={{ color: colors.textSecondary }}>Total Reviews: {productData?.totalReviews || 0}</div>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        {analysisData?.summary && (
          <div className="p-3 sm:p-4 rounded-lg mb-3 sm:mb-4" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
            <h3 className="font-semibold mb-2" style={{ color: colors.secondary }}>Summary</h3>
            <p className="text-sm sm:text-base" style={{ color: colors.text }}>{analysisData.summary}</p>
          </div>
        )}

        {/* Verdict */}
        {analysisData?.verdict && (
          <div className="p-3 sm:p-4 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
            <h3 className="font-semibold mb-2" style={{ color: colors.secondary }}>Verdict</h3>
            <p className="text-sm sm:text-base" style={{ color: colors.text }}>{analysisData.verdict}</p>
          </div>
        )}
      </div>

      {/* Pros and Cons */}
      {(safeArray(analysisData?.pros).length > 0 || safeArray(analysisData?.cons).length > 0) && (
        <div className="p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6" style={{ backgroundColor: colors.neutral2, border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: colors.primary }}>Pros and Cons</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Pros */}
            {safeArray(analysisData?.pros).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp size={20} style={{ color: colors.primary }} />
                  <span className="font-semibold" style={{ color: colors.text }}>Pros</span>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                    {safeArray(analysisData.pros).map((pro, index) => (
                      <li key={index} style={{ color: colors.text }}>{pro}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Cons */}
            {safeArray(analysisData?.cons).length > 0 && (
              <div className="mt-3 md:mt-0">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsDown size={20} style={{ color: colors.alert }} />
                  <span className="font-semibold" style={{ color: colors.text }}>Cons</span>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                    {safeArray(analysisData.cons).map((con, index) => (
                      <li key={index} style={{ color: colors.text }}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Features */}
      {safeArray(analysisData?.keyFeatures).length > 0 && (
        <div className="p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6" style={{ backgroundColor: colors.neutral2, border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: colors.primary }}>
            <div className="flex items-center gap-2">
              <Award size={20} style={{ color: colors.primary }} />
              <span>Key Features</span>
            </div>
          </h2>

          <div className="p-3 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
            <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
              {safeArray(analysisData.keyFeatures).map((feature, index) => (
                <li key={index} style={{ color: colors.text }}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Highlights */}
      {(safeArray(highlightsData?.positive).length > 0 || safeArray(highlightsData?.negative).length > 0) && (
        <div className="p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6" style={{ backgroundColor: colors.neutral2, border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: colors.primary }}>Highlights</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Positive Highlights */}
            {safeArray(highlightsData?.positive).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp size={20} style={{ color: colors.primary }} />
                  <span className="font-semibold" style={{ color: colors.text }}>Positive Highlights</span>
                </div>
                <div className="p-3 rounded-lg space-y-3" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  {safeArray(highlightsData.positive).map((highlight, index) => (
                    <div key={index} className="border-b border-gray-300 pb-2 last:border-0 last:pb-0">
                      <p className="text-xs sm:text-sm mb-1" style={{ color: colors.text }}>{highlight.text}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span style={{ color: colors.accent1 }}>{formatDate(highlight.date)}</span>
                        {highlight.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={12} style={{ fill: colors.secondary, color: colors.secondary }} />
                            {formatNumber(highlight.rating)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Negative Highlights */}
            {safeArray(highlightsData?.negative).length > 0 && (
              <div className="mt-3 md:mt-0">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsDown size={20} style={{ color: colors.alert }} />
                  <span className="font-semibold" style={{ color: colors.text }}>Negative Highlights</span>
                </div>
                <div className="p-3 rounded-lg space-y-3" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  {safeArray(highlightsData.negative).map((highlight, index) => (
                    <div key={index} className="border-b border-gray-300 pb-2 last:border-0 last:pb-0">
                      <p className="text-xs sm:text-sm mb-1" style={{ color: colors.text }}>{highlight.text}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span style={{ color: colors.accent1 }}>{formatDate(highlight.date)}</span>
                        {highlight.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={12} style={{ fill: colors.secondary, color: colors.secondary }} />
                            {formatNumber(highlight.rating)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Eco-Friendly Analysis */}
      {sustainabilityData && (
        safeArray(sustainabilityData.topEcoAspects).length > 0 || 
        safeArray(sustainabilityData.topPositiveAspects).length > 0 || 
        safeArray(sustainabilityData.topNegativeAspects).length > 0
      ) && (
        <div className="p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6" style={{ backgroundColor: colors.neutral2, border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: colors.primary }}>
            <div className="flex items-center gap-2">
              <Leaf size={20} style={{ color: colors.primary }} />
              <span>Eco-Friendly Analysis</span>
            </div>
          </h2>

          <div className="p-3 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {safeArray(sustainabilityData?.topEcoAspects).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: colors.secondary }}>Top Eco Aspects</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    {sustainabilityData.topEcoAspects.map((eco, index) => (
                      <li key={index} style={{ color: colors.text }}>
                        {eco.aspect} (Score: {formatNumber(eco.score)}, Mentions: {eco.mentions})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {safeArray(sustainabilityData?.ecoClaims?.certifications).length > 0 && (
                <div className="mt-3 md:mt-0">
                  <h3 className="font-semibold mb-2" style={{ color: colors.secondary }}>Eco-Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {sustainabilityData.ecoClaims.certifications.map((cert, index) => (
                      <span key={index} className="px-2 py-1 rounded-full text-xs" 
                        style={{ backgroundColor: colors.primary, color: "#FFFFFF" }}>{cert}</span>
                    ))}
                  </div>
                </div>
              )}

              {safeArray(sustainabilityData?.topPositiveAspects).length > 0 && (
                <div className="mt-3">
                  <h3 className="font-semibold mb-2" style={{ color: colors.secondary }}>Top Positive Aspects</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    {sustainabilityData.topPositiveAspects.map((aspect, index) => (
                      <li key={index} style={{ color: colors.text }}>
                        {aspect.aspect} (Score: {formatNumber(aspect.score)}, Mentions: {aspect.mentions})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {safeArray(sustainabilityData?.topNegativeAspects).length > 0 && (
                <div className="mt-3">
                  <h3 className="font-semibold mb-2" style={{ color: colors.secondary }}>Top Negative Aspects</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    {sustainabilityData.topNegativeAspects.map((aspect, index) => (
                      <li key={index} style={{ color: colors.text }}>
                        {aspect.aspect} (Score: {formatNumber(aspect.score)}, Mentions: {aspect.mentions})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {safeArray(data?.recommendations).length > 0 && (
        <div className="p-3 sm:p-4 rounded-lg shadow-sm" style={{ backgroundColor: colors.neutral2, border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: colors.primary }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} style={{ color: colors.accent1 }} />
              <span>Recommendations</span>
            </div>
          </h2>
          <div className="rounded p-3 space-y-2" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
            <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
              {data.recommendations.map((recommendation, index) => (
                <li key={index} style={{ color: colors.text }}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewDisplay;