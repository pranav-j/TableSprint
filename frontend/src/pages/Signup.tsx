import React, { useState, ChangeEvent } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import background from "../assets/background.svg";
import TSlogo from "../assets/TSlogo.png";

interface FormData {
    userName: string;
    email: string;
    password: string;
}

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    email: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    // Background container
    <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: `url(${background})`,  // Note the url() wrapper and template literal
        }}
    >
      {/* Optional overlay to ensure form readability */}
      <div className="min-h-screen bg-[#5C218B]/30 flex items-center p-20">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <img className='mb-4' src={TSlogo} alt="TSlogo" />
            <h1 className="text-xl text-gray-600">Welcome to TableSprint admin</h1>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              id="userName"
              name="userName"
              label="User name"
              variant="outlined"
              value={formData.userName}
              onChange={handleChange}
              className="bg-white"
              type="text"
            />

            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email-id"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              className="bg-white"
              type="email"
            />

            <TextField
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="bg-white"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      className="focus:outline-none"
                      type="button"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-purple-600 text-sm hover:text-purple-500"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;