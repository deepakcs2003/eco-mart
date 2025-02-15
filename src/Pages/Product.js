import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import summaryApi from "../Common";

export const Product = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Function to extract query from URL
  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "environmental friendly";
  };


  useEffect(() => {
    const fetchProducts = async () => {
      const query = getSearchQuery();
      console.log("hei deepka",query);
      if (!query) return;
      setLoading(true);

      try {
        const response = await fetch(`${summaryApi.scrape_product.url}?search=${query}`);
        const data = await response.json();
        setProductData(data.productList || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [location.search]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Eco-Friendly Product Search</h2>

      {/* Display Results */}
      {loading && <p>Loading...</p>}

      <div style={styles.productGrid}>
        {productData?.length > 0 ? (
          productData.map((product, index) => (
            <div key={index} style={styles.productCard}>
              <img src={product.mainImage?.url} alt={product.name} style={styles.productImage} />
              <h3>{product.name}</h3>
              <p style={styles.price}>
                <span style={styles.currency}>{product.currencyRaw}</span>
                {product.price} (Regular: {product.regularPrice})
              </p>
              <a href={product.url} target="_blank" rel="noopener noreferrer" style={styles.buyLink}>
                View on Amazon
              </a>
            </div>
          ))
        ) : (
          <p>No products found. Try another keyword.</p>
        )}
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  title: {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
  },
  productGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },
  productCard: {
    width: "250px",
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    backgroundColor: "white",
  },
  productImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  price: {
    fontSize: "18px",
    color: "#333",
    margin: "10px 0",
  },
  currency: {
    fontWeight: "bold",
    color: "#007bff",
  },
  buyLink: {
    display: "inline-block",
    textDecoration: "none",
    color: "white",
    backgroundColor: "#ff9900",
    padding: "10px 15px",
    borderRadius: "5px",
    fontWeight: "bold",
    marginTop: "10px",
  },
};