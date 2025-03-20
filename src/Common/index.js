const local = "http://localhost:5000";
const backendDomain = local;

const summaryApi = {
    logIn: {
        url: `${backendDomain}/api/v1/auth/google_auth`,
        method: "post"
    },
    scrape_product: {
        url: `${backendDomain}/api/v1/scrape/scrape-product`,
        method: "post"
    },
    getAllUser: {
        url: `${backendDomain}/api/v1/categories/allUsers`,
        method: "get"
    },
    createCategory: {
        url: `${backendDomain}/api/v1/categories/new`,
        method: "post"
    },
    getCategories: {
        url: `${backendDomain}/api/v1/categories/category`,
        method: "get"
    },
    updateCategory: (categoryId) => ({
        url: `${backendDomain}/api/v1/categories/${categoryId}`,
        method: "put"
    }),
    deleteCategory: (categoryId) => ({
        url: `${backendDomain}/api/v1/categories/${categoryId}`,
        method: "delete"
    }),
    getSubcategories: (category) => ({
        url: `${backendDomain}/api/v1/categories/${category}/subcategories`,
        method: "get"
    }),
    getProductsBySubcategory: (category, subcategory) => ({
        url: `${backendDomain}/api/v1/categories/${category}/${subcategory}/products`,
        method: "get"
    }),
    productDetail: {
        url: `${backendDomain}/api/v1/scrape/product-detail`,
        method: "post"
    },
    getReviews: {
        url: `${backendDomain}/api/v1/scrape/getReviews`,
        method: "post"
    },

    // ✅ Wishlist-related routes added:
    getAllWishlistProducts: {
        url: `${backendDomain}/api/v1/wishlist/GetAllWishList`,
        method: "get"
    },
    addToWishlist: {
        url: `${backendDomain}/api/v1/wishlist/AddToWishList`,
        method: "post"
    },
    deleteFromWishlist: {
        url: `${backendDomain}/api/v1/wishlist/DeleteToWishList`,
        method: "delete"
    },
    createBranded: {
        url: `${backendDomain}/api/v1/newBranded`,
        method: "post"
    },
    getAllBrandeds:{
        url:`${backendDomain}/api/v1/allbrandeds`,
        method:"get"
    },
    updateBranded:(brandedId) => ({
        url:`${backendDomain}/api/v1/updateBrand/${brandedId}`,
        method:"put"
    }),
    deleteBranded:(brandedId) => ({
        url:`${backendDomain}/api/v1/deleteBrand/${brandedId}`,
        method:"delete"
    }),
    getAllBrandedProduct:{
        url:`${backendDomain}/api/v1/scrape/getAllBrandedProduct`,
        method:"get"
    },
    scrapeBrandedProduct:{
           url:`${backendDomain}/api/v1/scrape/scrape_branded`,
        method:"get"
    }
};

export default summaryApi;
