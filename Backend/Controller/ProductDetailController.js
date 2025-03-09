const axios = require("axios");

const productDetail = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Product URL is required" });
    }

    if (!process.env.ZYTE_API_KEY) {
      return res.status(500).json({ error: "ZYTE API key is missing" });
    }

    console.log("Fetching details for:", url);

    const zyteResponse = await axios.post(
      "https://api.zyte.com/v1/extract",
      {
        url,
        product: true,
        productOptions: { extractFrom: "httpResponseBody", ai: true },
      },
      {
        auth: { username: process.env.ZYTE_API_KEY },
      }
    );

    console.log("Zyte API Response:", JSON.stringify(zyteResponse.data, null, 2));

    // Ensure the response contains valid product data
    if (!zyteResponse.data || !zyteResponse.data.product) {
      return res.status(500).json({ error: "Invalid response from Zyte API" });
    }

    // Decode httpResponseBody only if it's available
    let httpResponseBody = "";
    if (zyteResponse.data.httpResponseBody) {
      httpResponseBody = Buffer.from(zyteResponse.data.httpResponseBody, "base64").toString("utf-8");
    } else {
      console.warn("Warning: httpResponseBody is missing in the API response.");
    }

    res.status(200).json({
      product: zyteResponse.data.product,
      httpResponseBody,
    });
  } catch (error) {
    console.error(
      "Error fetching product details:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch product details" });
  }
};

module.exports = { productDetail };
