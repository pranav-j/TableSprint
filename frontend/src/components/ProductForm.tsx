import React, { useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineArrowBack } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks";
import { resetEditProductId, resetOpenForm } from "../redux/tabAndFormSlice";
import { createProduct, editProduct } from "../redux/productSlice";
import imagePlaceholder from "../assets/image.png";
import { Product } from "../redux/productSlice";

import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  SelectChangeEvent,
} from "@mui/material";

const ProductForm = () => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(
      (state) => state.categoryReducer.categories
    );
    const subcategories = useAppSelector(
      (state) => state.subcategoryReducer.subcategories
    );
    const editProductId = useAppSelector((state) => state.tabAndFormReducer.editProductId);
    const products = useAppSelector((state) => state.productReducer.products);

    let productToEdit: Product | undefined;
    let categoryIdToEdit;
    let subcategoryIdToEdit;

    if(editProductId) {
        productToEdit = products.find((product) => product.id === editProductId);
        console.log({ productToEdit });
        categoryIdToEdit = categories.find((category) => category.categoryName === productToEdit?.categoryName)?.id;
        subcategoryIdToEdit = subcategories.find((subcategory) => subcategory.subcategoryName === productToEdit?.subcategoryName)?.id;
        console.log("subcategoryIdToEdit...................", productToEdit?.productName);
        
    }
  const [formData, setFormData] = useState({
    categoryId: editProductId ? String(categoryIdToEdit) : "",
    subcategoryId: editProductId ? String(subcategoryIdToEdit) : "",
    productName: productToEdit?.productName || "",
    image: "",
  });

  const filteredSubcategories = subcategories.filter((subcat) => {
    if (formData.categoryId) {
      const selectedCategory = categories.find(
        (cat) => cat.id === Number(formData.categoryId)
      );
      return subcat.categoryName === selectedCategory?.categoryName;
    }
    return false;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;

    setFormData({
      ...formData,
      categoryId: selectedId,
      subcategoryId: "",
    });
  };

  const handleSubcategoryChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      subcategoryId: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if(!editProductId) {
        dispatch(createProduct(formData));
      }
      dispatch(editProduct({formData, productId: editProductId}));
      console.log(formData);

      dispatch(resetOpenForm());
      dispatch(resetEditProductId());
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleCancel = () => {
    dispatch(resetOpenForm());
    dispatch(resetEditProductId());
  };

  return (
    <div className="p-3 h-full">
      <div className="flex flex-col h-full shadow-xl rounded-lg p-6 justify-between">
        <div>
          <div className="flex gap-4 items-center mb-6">
            <MdOutlineArrowBack
              className="cursor-pointer text-gray-400"
              onClick={handleCancel}
            />
            <h2 className="font-semibold text-xl">Add Product</h2>
          </div>

          <div className="flex gap-4 mb-6">
            {/* Category Dropdown */}
            <FormControl
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="categoryId"
                value={formData.categoryId}
                onChange={handleCategoryChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Subcategory Dropdown */}
            <FormControl
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <InputLabel id="subcategory-label">Subcategory</InputLabel>
              <Select
                labelId="subcategory-label"
                id="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleSubcategoryChange}
                label="Subcategory"
                disabled={!formData.categoryId}
              >
                {filteredSubcategories.map((subcategory) => (
                  <MenuItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.subcategoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Product Name */}
            <TextField
              required
              id="productName"
              label="Product Name"
              value={formData.productName}
              onChange={handleInputChange}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </div>

          {/* Image Upload and Preview */}
          <div className="flex gap-4">
            <Box
              component="img"
              src={formData.image || productToEdit?.image || imagePlaceholder}
              alt="Product Preview"
              sx={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
            <Box
              className="w-52 h-24 border-2 border-dashed border-gray-400 flex items-center justify-center rounded-lg cursor-pointer"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <span className="text-center text-sm flex flex-col items-center gap-2">
                <LuImagePlus className="w-8 h-8" />
                Upload Maximum allowed file size is 10MB
              </span>
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setFormData({
                        ...formData,
                        image: reader.result as string,
                      });
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </Box>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-12 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-14 py-2 bg-primary text-white rounded-full hover:bg-purple-700"
            onClick={handleSave}
            disabled={
              !formData.categoryId ||
              !formData.subcategoryId ||
              !formData.productName
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
