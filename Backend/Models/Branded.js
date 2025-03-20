const mongoose = require('mongoose');

const BrandedSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    brandUrl:{
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    pageNos:{
        type:Number
    },
    categories:{
        type: String, 
        required: true,
    }
});

module.exports = mongoose.model('Branded', BrandedSchema);