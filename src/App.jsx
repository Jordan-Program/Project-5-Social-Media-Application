// Import necessary dependencies and components
import { BrowserRouter, Routes, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import Layout from './pages/Layout';
import LoginAndCreateAccount from './LoginAndCreateAccount';
import NotFound from "./pages/NotFound";

// Define the App component as a functional component
function App() 
{
  // JSX structure for rendering the App component
  return (
      <BrowserRouter>
        <Routes>
          {/* Route for the "login" path, rendering the LoginAndCreateAccount component */}   
          <Route path="login" element={<LoginAndCreateAccount />} />
          {/* Default (index) route, rendering the Layout component */}
          <Route index element={<Layout />} />
          {/* Catch-all route for paths that do not match any defined routes, rendering the NotFound component */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
}

// Export the App component as the default export
export default App;