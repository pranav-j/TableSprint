import React, { useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineArrowBack } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks";
import { resetEditCategoryId, resetOpenForm } from "../redux/tabAndFormSlice";
import { createCategory, editCategory } from "../redux/categorySlice";
import imagePlaceholder from "../assets/image.png";

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
  const editCategoryId = useAppSelector(
    (state) => state.tabAndFormReducer.editCategoryId
  );
  const categories = useAppSelector(
    (state) => state.categoryReducer.categories
  );

  let categoryToEdit;
  if (editCategoryId) {
    categoryToEdit = categories.find(
      (category) => category.id === editCategoryId
    );
    console.log({ categoryToEdit });
  }

  const [formData, setFormData] = useState({
    categoryName: categoryToEdit ? categoryToEdit.categoryName : "",
    sequence: categoryToEdit ? categoryToEdit.sequence : 0,
    status: categoryToEdit ? categoryToEdit.status : "Active",
    image: "",
  });

  const dispatch = useAppDispatch();

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

    try {
      if (!editCategoryId) {
        await dispatch(createCategory(formData));
      }
      dispatch(editCategory({ formData, categoryId: editCategoryId }));
      console.log("Category added successfully!");
      dispatch(resetOpenForm());
      dispatch(resetEditCategoryId());
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleCancel = () => {
    dispatch(resetOpenForm());
    dispatch(resetEditCategoryId());
  };

  return (
    <div className="p-3 h-full">
      <div className="flex flex-col h-full shadow-xl rounded-lg p-6 justify-between">
        <div>
          <div className="flex gap-4 items-center">
            <MdOutlineArrowBack />
            <h2 className="font-semibold text-xl">
              {editCategoryId ? "Edit" : "Add"} Category
            </h2>
          </div>

          <div className="flex gap-5 mb-3">
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

          <div className="flex gap-3">
            <Box
              component="img"
              src={formData.image || categoryToEdit?.image || imagePlaceholder}
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
    </div>
  );
};

export default CategoryForm;