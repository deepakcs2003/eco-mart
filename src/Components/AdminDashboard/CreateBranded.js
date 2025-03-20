import React, { useState, useEffect } from 'react';
import axios from 'axios';
import summaryApi from '../../Common/index';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusCircle, Edit, Trash2, X, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';
// toast.configure();

const CreateBranded = () => {
    const [brandeds, setBrandeds] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        pageNos: '',
        categories: '',
        imageUrl: '',
        brandUrl: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchBrandeds();
    }, []);

    const fetchBrandeds = async () => {
        setLoading(true);
        try {
            const response = await axios({
                method: summaryApi.getAllBrandeds.method,
                url: summaryApi.getAllBrandeds.url
            });
            setBrandeds(response.data.data);
        } catch (error) {
            setError('Failed to fetch branded items');
            console.error('Error fetching brandeds:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isEditing) {
                await axios({
                    method: summaryApi.updateBranded(currentId).method,
                    url: summaryApi.updateBranded(currentId).url,
                    data: formData
                });
                setSuccess('Branded item updated successfully');
            } else {
                await axios({
                    method: summaryApi.createBranded.method,
                    url: summaryApi.createBranded.url,
                    data: formData
                });
                setSuccess('Branded item created successfully');
            }
            setFormData({
                name: '',
                description: '',
                pageNos: '',
                categories: '',
                imageUrl: '',
                brandUrl: ''
            });
            setIsEditing(false);
            setCurrentId(null);
            setShowForm(false);
            fetchBrandeds();
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (branded) => {
        setFormData({
            name: branded.name,
            description: branded.description,
            pageNos: branded.pageNos,
            categories: branded.categories,
            imageUrl: branded.imageUrl || '',
            brandUrl: branded.brandUrl || ''
        });
        setIsEditing(true);
        setCurrentId(branded._id);
        setShowForm(true);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this branded item?')) {
            setLoading(true);
            try {
                await axios({
                    method: summaryApi.deleteBranded(id).method,
                    url: summaryApi.deleteBranded(id).url
                });
                setSuccess('Branded item deleted successfully');
                fetchBrandeds();
            } catch (error) {
                setError('Failed to delete branded item');
                console.error('Error deleting branded:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            name: '',
            description: '',
            pageNos: '',
            categories: '',
            imageUrl: '',
            brandUrl: ''
        });
        setIsEditing(false);
        setCurrentId(null);
        setShowForm(false);
    };

    const renderCategories = (categoriesString) => {
        if (!categoriesString) return null;

        const categoriesArray = categoriesString.split(',').map(cat => cat.trim());

        return (
            <div className="flex flex-wrap gap-2 mt-1">
                {categoriesArray.map((category, index) => (
                    <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                    >
                        {category}
                    </span>
                ))}
            </div>
        );
    };

    // Helper function to show notification that auto-dismisses
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const [loadingScapping, setLoadingScapping] = useState(false);

    const scrapeData = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Authentication failed! No token found.", { position: toast.POSITION.TOP_RIGHT });
                return;
            }

            setLoadingScapping(true); // Show loading message

            const response = await fetch(summaryApi.scrapeBrandedProduct.url, {
                method: summaryApi.scrapeBrandedProduct.method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message, { position: toast.POSITION.TOP_RIGHT });
            } else {
                toast.error(`Error: ${data.message}`, { position: toast.POSITION.TOP_RIGHT });
            }
        } catch (error) {
            toast.error("Failed to connect to server!", { position: toast.POSITION.TOP_RIGHT });
            console.error("Error scraping data:", error);
        } finally {
            setLoadingScapping(false); // Hide loading message
        }
    };


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Branded Management</h1>
                    <div className="flex flex-col items-center">
                        <button
                            onClick={scrapeData}
                            className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Scraping in Progress..." : "Start Scraping"}
                        </button>
                        {loadingScapping && <p className="mt-2 text-gray-600">Scraping is ongoing... Please wait a minute.</p>}
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Add New Branded
                        </button>
                    )}

                </div>

                {/* Notifications */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex justify-between items-center">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                        <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 flex justify-between items-center">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {success}
                        </div>
                        <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {isEditing ? 'Edit Branded Item' : 'Add New Branded Item'}
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter brand name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter description"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Numbers</label>
                                        <input
                                            type="number"
                                            name="pageNos"
                                            value={formData.pageNos}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter page numbers"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                                        <input
                                            type="text"
                                            name="categories"
                                            value={formData.categories}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. Fashion, Apparel, Clothing"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Separate categories with commas</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter image URL"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand URL</label>
                                        <input
                                            type="text"
                                            name="brandUrl"
                                            value={formData.brandUrl}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter brand URL"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5 mr-2" />
                                            {isEditing ? 'Update' : 'Create'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Branded Items List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Branded Items</h2>
                        <span className="text-sm text-gray-500">{brandeds.length} items</span>
                    </div>

                    {loading && !brandeds.length ? (
                        <div className="flex justify-center items-center py-12">
                            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="ml-3 text-sm text-gray-500">Loading items...</span>
                        </div>
                    ) : brandeds.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No branded items found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new branded item.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Add New Branded
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {brandeds.map((branded) => (
                                <div key={branded._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {branded.imageUrl ? (
                                        <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                            <img
                                                src={branded.imageUrl}
                                                alt={branded.name}
                                                className="object-cover w-full h-48"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/300x150?text=No+Image';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-48 bg-gray-100">
                                            <ImageIcon className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{branded.name}</h3>
                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={() => handleEdit(branded)}
                                                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(branded._id)}
                                                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{branded.description}</p>

                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                                {branded.pageNos} pages
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Categories</h4>
                                            {renderCategories(branded.categories)}
                                        </div>

                                        {branded.brandUrl && (
                                            <div className="mt-4 pt-3 border-t border-gray-100">
                                                <a
                                                    href={branded.brandUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Visit Brand <ExternalLink className="w-4 h-4 ml-1" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateBranded;