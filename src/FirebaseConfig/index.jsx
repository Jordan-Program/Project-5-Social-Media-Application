// Import necessary hooks and components from React
import { useState, useEffect } from 'react';

// Import the SweetAlert2 library for displaying alerts
import Swal from 'sweetalert2'

// Import functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged,updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

// Firebase configuration containing API keys and other settings
const firebaseConfig = 
{
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize the Firebase app with the provided configuration
export const app = initializeApp(firebaseConfig);

// Create instances for Firestore, Authentication, and Storage
const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export default db 

// Custom hook for managing user authentication state
export function useAuth()
{
  const [currentUser, setCurrentUser] = useState();

  useEffect(() =>
  {
    // Subscribe to authentication state changes
    const unsub = onAuthStateChanged(auth,user => setCurrentUser(user));

    // Cleanup function to unsubscribe when the component unmounts
    return unsub;
  },[]);

  return currentUser;
};

// Function to upload a file to Firebase Storage
export async function upload(file, currentUser, setLoading)
{
  // Create a reference to the storage location for the user's profile picture  
  const fileRef = ref(storage, currentUser.uid + '.png' );

  // Set loading state to true
  setLoading(true);
  
  // Upload the file to Firebase Storage
  const snapshot = await uploadBytes(fileRef, file);

  // Get the download URL of the uploaded file
  const photoURL = await getDownloadURL(fileRef);

  // Update the user's profile with the new photoURL
  updateProfile(currentUser,{photoURL})

  // Set loading state back to false
  setLoading(false);

  // Display a success message using SweetAlert
  Swal.fire
  ({
    timer: 2000,
    showConfirmButton: false,
    willOpen: () => 
    {
      Swal.showLoading();
    },
    willClose: () => 
    {
      Swal.fire
      ({
        icon: 'success',
        title: 'Profile Pic Uploaded!',
        showConfirmButton: false,
        timer: 2000,
      });
      
      // Reload the page to reflect changes
      window.location.reload(true);
    },
  });
};