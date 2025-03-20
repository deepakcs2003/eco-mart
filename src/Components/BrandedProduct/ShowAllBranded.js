import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import summaryApi from '../../Common';

const ShowAllBranded = ({ onBrandSelect, selectedBrand }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(summaryApi.getAllBrandeds.url, {
          method: summaryApi.getAllBrandeds.method,
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch branded products");

        const data = await response.json();
        setBrands(data.data || data); // Handle both data formats
        setLoading(false);
      } catch (error) {
        console.error("Error fetching branded products:", error);
        setLoading(false);
      }
    };
    
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4 text-white">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-2"></div>
        Loading brands...
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-3 text-[#000000]">Featured Brands</h2>
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-4">
          {brands.map((brand) => (
            <div 
              key={brand._id} 
              className={`flex flex-col items-center cursor-pointer min-w-[120px] transition-transform duration-300 hover:scale-105 ${
                selectedBrand && selectedBrand._id === brand._id ? 'scale-110' : ''
              }`}
              onClick={() => onBrandSelect(brand)}
            >
              <div className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                selectedBrand && selectedBrand._id === brand._id 
                  ? 'border-[#87CEEB] shadow-lg shadow-[#317873]/50' 
                  : 'border-[#228B22]'
              }`}>
                <div className="w-full h-full bg-[#F5DEB3] flex items-center justify-center p-1">
                  <img
                    src={brand.imageUrl || '/default-brand.png'}
                    alt={brand.name}
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-brand.png';
                    }}
                  />
                </div>
              </div>
              <span className={`text-sm mt-2 text-center font-medium ${
                selectedBrand && selectedBrand._id === brand._id 
                  ? 'text-[#87CEEB]' 
                  : 'text-[#000000]'
              }`}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowAllBranded;