import summaryApi from "../Common";


export const fetchProducts = async () => {
    try {
        console.log(summaryApi.getAllBrandedProduct.url);
        const response = await fetch(summaryApi.getAllBrandedProduct.url);
        const data = await response.json();
        console.log("data of api call",data.data);
        if (data.success) {
            return data.data;
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }

    return [];
};
