const axios = require("axios");

const MAX_RETRIES = 4; // Maximum retry attempts

const productDetail = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Product URL is required" });
    }

    if (!process.env.ZYTE_API_KEY) {
      return res.status(500).json({ error: "ZYTE API key is missing" });
    }

    // console.log("Fetching details for:", url);

    let attempt = 0;
    let zyteResponse;

    while (attempt < MAX_RETRIES) {
      try {
        attempt++;

        zyteResponse = await axios.post(
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


        // Ensure the response contains valid product data
        if (zyteResponse.data && zyteResponse.data.product) {
          break; // Exit the loop if a valid response is received
        }

        console.warn(`Attempt ${attempt} failed: Invalid response from Zyte API.`);
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.response?.data || error.message);
      }

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying... (${attempt}/${MAX_RETRIES})`);
      }
    }

    if (!zyteResponse || !zyteResponse.data || !zyteResponse.data.product) {
      return res.status(500).json({ error: "Failed to fetch product details after multiple attempts" });
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
