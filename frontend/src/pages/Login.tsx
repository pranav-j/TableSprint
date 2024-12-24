import React, { useState, ChangeEvent } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import background from "../assets/background.svg";
import TSlogo from "../assets/TSlogo.png";
import axios from 'axios';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error on form submission
    try {
      const response = await axios.post(`http://localhost:3000/api/auth/login`, formData, {withCredentials: true});

      if (response.status === 200) {
        const { token, username } = response.data;
        setUsername(username); // Set the username
        // console.log('Token:', token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || "Invalid credentials");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* Optional overlay to ensure form readability */}
      <div className="min-h-screen bg-[#5C218B]/30 flex items-center p-20">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <img className="mb-4" src={TSlogo} alt="TSlogo" />
            <h1 className="text-xl text-gray-600">Welcome to TableSprint admin</h1>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          {/* Success Message */}
          {username && (
            <div className="text-green-500 text-center mb-4">
              Welcome back, {username}!
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
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

export default Login;
