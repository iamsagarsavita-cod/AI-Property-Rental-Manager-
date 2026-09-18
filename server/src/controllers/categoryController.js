const CategoryModel = require("../models/categoryModel");

const {
  isValid,
  isValidCategoryName,
  isValidObjectId,
} = require("../utils/validator");

// Add Category (Admin)
const addCategory = async (req, res) => {
  try {
    let categoryData = req.body;

    if (!categoryData || Object.keys(categoryData).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided" });
    }
    let { categoryName, description, status } = categoryData;

    // Category Name Validation
    if (!isValid(categoryName)) {
      return res.status(400).json({ msg: "Category Name is Required" });
    }

    if (!isValidCategoryName(categoryName)) {
      return res.status(400).json({ msg: "Invalid Category Name" });
    }

    let duplicateCategory = await CategoryModel.findOne({ categoryName });
    if (duplicateCategory) {
      return res.status(400).json({ msg: "Category Name Already Exists" });
    }

    // Description Validation
    if (!isValid(description)) {
      return res.status(400).json({ msg: "Description is Required" });
    }

    if (description.length < 10 || description.length > 300) {
      return res.status(400).json({
        msg: "Description should be less than 400 Character and greater than 10 Character.",
      });
    }

    // Status Validation
    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        return res.status(400).json({ msg: "Invalid Status" });
      }
    }

    let category = await CategoryModel.create(categoryData);
    return res
      .status(201)
      .json({ msg: "Category Added Successfully", category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get All Category
const getAllCategory = async (req, res) => {
  try {
    let category = await CategoryModel.find();
    if (category.length === 0) {
      return res.status(404).json({ msg: "Categories Not Found" });
    }

    return res.status(200).json({
      msg: "Categories Fetched Successfully",
      totalCategories: category.length,
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get Category By Id
const getCategoryById = async (req, res) => {
  try {
    let categoryId = req.params.id;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ msg: "Invalid Category Id" });
    }

    let category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category Not Found" });
    }

    return res
      .status(200)
      .json({ msg: "Category Fetched Successfully", category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update Category (Admin)
const updateCategory = async (req, res) => {
  try {
    let categoryId = req.params.id;
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ msg: "Invalid Category Id" });
    }

    let categoryData = req.body;
    if (!categoryData || Object.keys(categoryData).length === 0) {
      return res
        .status(400)
        .json({ msg: "Bad Request ! Enter Data to Update" });
    }
    let { categoryName, description, status } = categoryData;

    if (categoryName !== undefined) {
      if (!isValid(categoryName)) {
        return res.status(400).json({ msg: "Category Name is Required" });
      }

      if (!isValidCategoryName(categoryName)) {
        return res.status(400).json({ msg: "Invalid Category Name" });
      }

      let duplicateCategory = await CategoryModel.findOne({
        categoryName,
        _id: { $ne: categoryId },
      });
      if (duplicateCategory) {
        return res.status(400).json({ msg: "Category Name Already Exists" });
      }
    }

    if (description !== undefined) {
      if (!isValid(description)) {
        return res.status(400).json({ msg: "Description is Required" });
      }

      if (description.length < 10 || description.length > 300) {
        return res.status(400).json({
          msg: "Description should be less than 400 Character and greater than 10 Character.",
        });
      }
    }

    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        return res.status(400).json({ msg: "Invalid Status" });
      }
    }

    let updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      categoryData,
      { new: true },
    );

    if (!updatedCategory) {
      return res.status(404).json({ msg: "Category Not Found" });
    }
    return res
      .status(200)
      .json({ msg: "Category Updated Successfully", updatedCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete Category (Admin)
const deleteCategory = async (req, res) => {
  try {
    let categoryId = req.params.id;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ msg: "Invalid Category Id" });
    }

    let category = await CategoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({ msg: "Category Not Found" });
    }

    await CategoryModel.findByIdAndDelete(categoryId);

    return res.status(200).json({ msg: "Category Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};