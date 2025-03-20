const mongoose = require('mongoose');

const BandedProductSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currencyRaw: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    mainImage: {
        url: {
            type: String,
            required: true
        }
    },
    brandName:{
        type: String,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branded',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('BandedProduct', BandedProductSchema);
