const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
});

const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  subcategories: [SubcategorySchema],
});

module.exports = mongoose.model("Category", CategorySchema);
