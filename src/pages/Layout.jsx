// Import necessary hooks and components from React
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../FirebaseConfig';

// Import other components
import Feed from '../pages/Feed';
import Sidebar from '../pages/Sidebar';
import Widgets from '../pages/Widgets';

// Main component
function Layout() 
{
  // Use the `useNavigate` hook to get access to the navigation object
  let navigate = useNavigate();

  // useEffect hook to handle side effects
  useEffect(() => 
  {
    // Set the document title
    document.title = `Home`;

    // Subscribe to changes in the authentication state
    onAuthStateChanged(auth, (user) => 
    {
      // If the user is not logged in, navigate to the login page
      if (!user) 
      {
        navigate("login");
      }
    });
  
  // The empty dependency array ensures that the effect runs only once when the component mounts
  }, []);

  // JSX structure
  return (
    <>
      <div className="layout">
        {/* Include Sidebar, Feed, and Widgets components */}
        <Sidebar />
        <Feed />
        <Widgets />
      </div>
    </>
  );
}

// Export the Layout component as the default export
export default Layout;
