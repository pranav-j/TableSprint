import React, { useState, useEffect } from "react";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineArrowBack } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks";
import { resetOpenForm } from "../redux/tabAndFormSlice";
import { fetchCategories } from "../redux/categorySlice";

import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  SelectChangeEvent,
} from "@mui/material";

const SubcategoryForm = () => {
  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryName: "",
    sequence: 0,
    // status: "Active",
    image: "",
  });

  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categoryReducer.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === "sequence" ? Number(value) : value,
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      categoryId: event.target.value,
    });
  };


  const handleSave = async () => {
    console.log("Form Data:", formData);
    // Add your subcategory creation logic here
    dispatch(resetOpenForm());
  };

  const handleCancel = () => {
    dispatch(resetOpenForm());
  };

  return (
    <div className="m-3 flex flex-col h-full justify-between">
      <div>
        <div className="flex gap-4 items-center">
          <MdOutlineArrowBack />
          <h2 className="font-semibold text-xl">Add Sub Category</h2>
        </div>

        <div className="flex gap-5 mb-3">
          {/* Category Dropdown */}
          <FormControl
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
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

          {/* Subcategory Name */}
          <TextField
            required
            id="subcategoryName"
            label="Sub Category Name"
            value={formData.subcategoryName}
            onChange={handleInputChange}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
              },
            }}
          />

          {/* Sequence */}
          <TextField
            required
            id="sequence"
            label="Sub Category Sequence"
            type="number"
            value={formData.sequence}
            onChange={handleInputChange}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
              },
            }}
          />
        </div>

        {/* Image Upload and Preview */}
        <div className="flex gap-3">
          <Box
            component="img"
            src={formData.image || "/api/placeholder/100/100"}
            alt="Uploaded"
            sx={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
          <Box
            className="w-52 h-24 border-2 border-dashed border-gray-400 flex items-center justify-center rounded-[10px] cursor-pointer relative"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <span className="text-center text-sm flex flex-col justify-center items-center">
              <LuImagePlus className="size-10" />
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

      <div className="flex justify-end space-x-4 mt-4">
        <button
          className="px-4 py-2 border border-gray-500 text-gray-500 rounded hover:bg-gray-100"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SubcategoryForm;