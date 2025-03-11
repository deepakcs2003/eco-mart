const local="http://localhost:5000"
const backendDomain=local;
const summaryApi={
    logIn:{
        url:`${backendDomain}/api/v1/auth/google_auth`,
        method:"post"
    },
    scrape_product: {
        url: `${backendDomain}/api/v1/scrape/scrape-product`,
        method: "post"
    },
    getAllUser:{
       url:`${backendDomain}/api/v1/categories/allUsers`,
       method:"get"
    },
    createCategory: {
        url: `${backendDomain}/api/v1/categories/new`,
        method: "post"
    },
    getCategories: {
        url: `${backendDomain}/api/v1/categories/category`,
        method: "get"
    },
    updateCategory:(categoryId) => ({
        url:`${backendDomain}/api/v1/categories/${categoryId}`,
        method:"put"
    }),
    deleteCategory:(categoryId) => ({
        url:`${backendDomain}/api/v1/categories/${categoryId}`,
        method:"delete"
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
        method: "POST",
    },
    
    getReviews: {
        url: `${backendDomain}/api/v1/scrape/getReviews`,
        method: "post"
    },
}
export default summaryApi