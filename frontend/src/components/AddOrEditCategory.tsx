import React, { useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineArrowBack } from "react-icons/md";
import { useAppDispatch } from "../redux/reduxHooks";
import { resetOpenForm } from "../redux/tabAndFormSlice";
import { createCategory } from "../redux/categorySlice";

import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  SelectChangeEvent,
} from "@mui/material";

const CategoryForm = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    sequence: 0,
    status: "Active",
    image: "",
  });

  const dispatch = useAppDispatch();

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.id]: e.target.value,
  //   });
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === "sequence" ? Number(value) : value, // Convert 'sequence' to a number
    });
  };
  

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      status: event.target.value,
    });
  };

  const handleSave = async () => {
    console.log("Form Data:", formData);
  
    // Dispatch createCategory thunk
    try {
      await dispatch(createCategory(formData));
      console.log("Category added successfully!");
      dispatch(resetOpenForm());
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleCancel = () => {
    dispatch(resetOpenForm());
  }

  return (
    <div className="m-3 flex flex-col h-full justify-between">
      {/* Form Fields */}
      <div>
        <div className="flex gap-4 items-center">
            <MdOutlineArrowBack />
            <h2 className="font-semibold text-xl">Add Category</h2>
        </div>
        
      <div className="flex gap-5 mb-3">
        {/* Category Name */}
        <TextField
          required
          id="categoryName"
          label="Category Name"
          value={formData.categoryName}
          onChange={handleInputChange}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
            },
          }}
        />

        {/* Category Sequence */}
        <TextField
          required
          id="sequence"
          label="Category Sequence"
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

        {/* Status Dropdown */}
        <FormControl
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
            },
          }}
        >
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={formData.status}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Image Upload and Preview */}
      <div className="flex gap-3">
        <Box
          component="img"
          src={formData.image || "https://via.placeholder.com/100"}
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
                    image: reader.result as string, // Convert file to base64 string
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
          onClick={(e) => {
            e.preventDefault();
            handleCancel();
          }}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;
