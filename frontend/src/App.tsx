import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const router = createBrowserRouter([
  { path: "/", element: <Login />},
  { path: "/dashboard", element: <Dashboard />},
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
