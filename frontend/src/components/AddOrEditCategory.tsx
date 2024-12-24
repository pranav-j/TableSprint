import React, { useState } from "react";
import { LuImagePlus } from "react-icons/lu";

import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  SelectChangeEvent,
} from "@mui/material";

const CategoryForm = () => {
  const [formData, setFormData] = useState({
    categoryName: " ",
    categorySequence: " ",
    status: "Active",
    image: " ",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      status: event.target.value,
    });
  };

  const handleSave = () => {
    console.log("Form Data:", formData);
  };

  return (
    <Box
      component="form"
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 2,
        padding: 3,
      }}
    >
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
            }
        }}
      />


      {/* Category Sequence */}
      <TextField
        required
        id="categorySequence"
        label="Category Sequence"
        type="number"
        value={formData.categorySequence}
        onChange={handleInputChange}
        fullWidth
        sx={{
            "& .MuiOutlinedInput-root": {
            borderRadius: 4,
            }
        }}
      />

      {/* Status Dropdown */}
        <FormControl
            fullWidth
            sx={{
                "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                }
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


      {/* Upload Image */}
      <Box
  sx={{
    gridColumn: "1 / span 3",
    display: "flex",
    alignItems: "center",
    gap: 2,
  }}
>
  <Box
    component="img"
    src={formData.image || "https://via.placeholder.com/100"}
    alt="Uploaded"
    sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 1 }}
  />
  <Box
    className="w-52 h-24 border-2 border-dashed border-gray-400 flex items-center justify-center rounded-[10px] cursor-pointer relative"
    onClick={() => document.getElementById("image-upload")?.click()}
    >
        
    <span className="text-center text-sm flex flex-col justify-center items-center"><LuImagePlus className="size-10" />Upload Maximum allowed file size is 10MB</span>
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

</Box>


      <Box
        sx={{
          gridColumn: "1 / span 3",
          display: "flex",
          justifyContent: "space-between",
          marginTop: 2,
        }}
      >
        <Button variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryForm;



// import React, { useState, ChangeEvent } from 'react';
// import { 
//   Box,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   Paper,
//   Typography,
//   SelectChangeEvent
// } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// interface FormData {
//   categoryName: string;
//   sequence: string;
//   status: string;
//   image: File | null;
// }

// const CategoryForm = () => {
//   const [formData, setFormData] = useState<FormData>({
//     categoryName: 'Tea',
//     sequence: '3',
//     status: 'active',
//     image: null
//   });
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = event.target;
//     setFormData(prev => ({
//       ...prev,
//       [id.replace('category-', '')]: value
//     }));
//   };

//   const handleStatusChange = (event: SelectChangeEvent) => {
//     setFormData(prev => ({
//       ...prev,
//       status: event.target.value
//     }));
//   };

//   const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         image: file
//       }));
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSave = () => {
//     console.log('Form Data:', {
//       ...formData,
//       image: formData.image ? {
//         name: formData.image.name,
//         type: formData.image.type,
//         size: formData.image.size
//       } : 'No image'
//     });
//   };

//   const inputStyles = {
//     '& .MuiInputLabel-root': {
//       fontSize: '1.1rem',
//       fontWeight: 500
//     },
//     '& .MuiOutlinedInput-root': {
//       borderRadius: '12px'
//     }
//   };

//   return (
//     <Box component="form" sx={{ maxWidth: '800px', p: 3 }}>
//       <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//         <TextField
//           required
//           id="category-name"
//           label="Category Name"
//           value={formData.categoryName}
//           onChange={handleInputChange}
//           sx={{ flex: 1, ...inputStyles }}
//         />
        
//         <TextField
//           required
//           id="category-sequence"
//           label="Category Sequence"
//           type="number"
//           value={formData.sequence}
//           onChange={handleInputChange}
//           sx={{ width: '200px', ...inputStyles }}
//         />
        
//         <FormControl sx={{ width: '200px', ...inputStyles }}>
//           <InputLabel id="status-label">Status</InputLabel>
//           <Select
//             labelId="status-label"
//             id="status"
//             value={formData.status}
//             label="Status"
//             onChange={handleStatusChange}
//           >
//             <MenuItem value="active">Active</MenuItem>
//             <MenuItem value="inactive">Inactive</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//         <Paper 
//           sx={{ 
//             width: 150, 
//             height: 150, 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center',
//             overflow: 'hidden',
//             borderRadius: '12px'
//           }}
//         >
//           {imagePreview ? (
//             <img 
//               src={imagePreview} 
//               alt="Category" 
//               style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
//             />
//           ) : (
//             <Box sx={{ p: 2, textAlign: 'center' }}>
//               <Typography variant="caption">No image selected</Typography>
//             </Box>
//           )}
//         </Paper>

//         <Button
//           component="label"
//           variant="outlined"
//           startIcon={<CloudUploadIcon />}
//           sx={{ 
//             height: 150, 
//             width: 150, 
//             borderRadius: '12px',
//             '& .MuiButton-startIcon': {
//               marginRight: 0
//             }
//           }}
//         >
//           Upload Image
//           <input
//             type="file"
//             hidden
//             onChange={handleImageChange}
//             accept="image/*"
//           />
//         </Button>
//       </Box>

//       <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//         <Button 
//           variant="outlined" 
//           color="primary"
//           sx={{ borderRadius: '8px' }}
//         >
//           Cancel
//         </Button>
//         <Button 
//           variant="contained" 
//           color="primary"
//           onClick={handleSave}
//           sx={{ borderRadius: '8px' }}
//         >
//           Save
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CategoryForm;