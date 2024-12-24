import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';


const router = createBrowserRouter([
  { path: "/", element: <Login />},
  { path: "/login", element: <Login />},
  { path: "/signup", element: <Signup />},
  { path: "/dashboard", element: <Dashboard />},
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
