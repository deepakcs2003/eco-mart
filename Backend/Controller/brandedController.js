const Branded = require('../Models/Branded'); 

// Create brand
exports.createBranded = async (req, res) => {
    try {
        const { name, description,pageNos,categories,imageUrl,brandUrl} = req.body;

        if (!name || !description || !pageNos || !categories) {
            return res.status(400).json({ message: 'Please provide name and description' });
        }

        const branded = await Branded.create({
            name,
            description,
            pageNos,
            brandUrl,
            imageUrl,
            categories
        });

        // Send response
        res.status(201).json({
            success: true,
            message: "Branded created successfully",
            branded
        });

    } catch (error) {
        console.error("Error:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Brand with this name already exists' });
        }
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getAllBrandeds = async(req,res) =>{
  try{
  const brands = await Branded.find();
  if(!brands){
      return res.status(400).json({
          success:false,
          message:"No brands found"
      })
  }

  res.status(200).json({
      success:true,
      data:brands,
      message:"all brands retrived"
  })
}catch (error) {
  console.error("brands not fetched by admin:", error);
  res.status(500).json({ 
    message: "Brands not fetched by admin:", 
    error: error.message 
  });
}
}


exports.updateBranded = async (req, res) => {
  try {
    const { name, description,pageNos,categories,imageUrl,brandUrl } = req.body;

    const branded = await Branded.findById(req.params.brandedId);
    if (!branded) {
      return res.status(404).json({ 
        message: "Branded not found" 
      });
    }

    branded.name = name || branded.name;
    branded.description = description || branded.description;
    branded.imageUrl = imageUrl || branded.imageUrl;
    branded.pageNos = pageNos || branded.pageNos;
    branded.categories = categories || branded.categories;
    branded.brandUrl = brandUrl || branded.brandUrl;

    await branded.save();
    res.json({ 
      message: "Branded updated successfully", 
      branded 
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error 
    });
  }
};


exports.deleteBranded = async (req, res) => {
  try {
    const branded = await Branded.findByIdAndDelete(req.params.brandedId);

    if (!branded) {
      return res.status(404).json({ 
        message: "Branded not found" 
      });
    }

    res.json({ 
      message: "Branded deleted successfully", 
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error 
    });
  }
};