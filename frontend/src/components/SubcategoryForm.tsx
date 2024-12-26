import React, { useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineArrowBack } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks";
import {
  resetEditSubCategoryId,
  resetOpenForm,
} from "../redux/tabAndFormSlice";
import { createSubcategory, editSubcategory } from "../redux/subcategorySlice";
import { Subcategory } from "../redux/subcategorySlice";
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

const SubcategoryForm = () => {
  const dispatch = useAppDispatch();
  const editSubCategoryId = useAppSelector(
    (state) => state.tabAndFormReducer.editSubCategoryId
  );
  const subcategories = useAppSelector(
    (state) => state.subcategoryReducer.subcategories
  );
  const categories = useAppSelector(
    (state) => state.categoryReducer.categories
  );

  let subCategoryToEdit: Subcategory | undefined;
  let categoryIdToEdit;

  if (editSubCategoryId) {
    subCategoryToEdit = subcategories.find(
      (subcategory) => subcategory.id === editSubCategoryId
    );
    console.log({ subCategoryToEdit });
    categoryIdToEdit = categories.find(
      (category) => category.categoryName === subCategoryToEdit?.categoryName
    )?.id;
  }

  const [formData, setFormData] = useState({
    categoryId: categoryIdToEdit ? String(categoryIdToEdit) : "",
    subcategoryName: subCategoryToEdit ? subCategoryToEdit.subcategoryName : "",
    sequence: subCategoryToEdit ? subCategoryToEdit.sequence : 0,
    image: "",
  });

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
    if (!editSubCategoryId) {
      dispatch(createSubcategory(formData));
    }
    dispatch(editSubcategory({ formData, subcategoryId: editSubCategoryId }));
    dispatch(resetOpenForm());
    dispatch(resetEditSubCategoryId());
  };

  const handleCancel = () => {
    dispatch(resetOpenForm());
    dispatch(resetEditSubCategoryId());
  };

  return (
    <div className="p-3 h-full">
      <div className="flex flex-col h-full shadow-xl rounded-lg p-6 justify-between">
        <div>
          <div className="flex gap-4 items-center mb-6">
            <MdOutlineArrowBack
              className="cursor-pointer text-gray-400"
              onClick={handleCancel}
            />            <h2 className="font-semibold text-xl">
              {editSubCategoryId ? "Edit" : "Add"} Sub Category
            </h2>
          </div>

          <div className="flex gap-5 mb-6">
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

          <div className="flex gap-3">
            <Box
              component="img"
              src={
                formData.image || subCategoryToEdit?.image || imagePlaceholder
              }
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
            className="px-12 py-2 border border-gray-500 text-gray-500 rounded-full hover:bg-gray-100"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-14 py-2 bg-primary text-white rounded-full hover:bg-purple-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryForm;
