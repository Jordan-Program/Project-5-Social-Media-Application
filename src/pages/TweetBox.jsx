// Import necessary dependencies and components
import { useState, useEffect } from "react";
import { collection, addDoc, Timestamp, query, where, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import db from '../FirebaseConfig';
import { storage } from "../FirebaseConfig";
import { auth, useAuth } from '../FirebaseConfig';

import { Button, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';

// Styled component for visually hidden input
const VisuallyHiddenInput = styled('input')
({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Define the TweetBox component as a functional component
function TweetBox() 
{
  // Access the current user using the useAuth hook
  const currentUser = useAuth();

  // State variables to manage the tweet message, tweet image, user details, etc.
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const [userId, setuserId] = useState("");
  const [username, setusername] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [isImageSelected, setIsImageSelected] = useState(false);

  // Fetch the user ID when the component mounts
  useEffect(() => 
  {
    const fetchUserId = async () => 
    {
      await onAuthStateChanged(auth, (user) => 
      {
        if (user) 
        {
          setuserId(user.uid);
        }
      });
    };

    fetchUserId();
  }, []);

  // Fetch user data based on the user ID
  useEffect(() => 
  {
    const fetchData = () => 
    {
      try 
      {
        const q = query(collection(db, 'db-socmedapp-username'), where('userId', '==', userId));
  
        const unsubscribe = onSnapshot(q, (querySnapshot) => 
        {
          querySnapshot.forEach((doc) => 
          {
  
            const data = doc.data();
            setusername(data.displayName || '');
            setfirstname(data.firstName || '');
            setlastname(data.lastName || '');
          });
        });
  
        return () => unsubscribe();
      } 
      
      catch (error) 
      {
        console.error('Error getting documents: ', error);
      }
    };
  
    fetchData();
  }, [userId]);

// Function to handle file selection and update the state accordingly
const handleFileSelection = (e) => 
{
  const selectedFile = e.target.files[0];
  setTweetImage(selectedFile);

  // Check if an image is selected and update the state
  setIsImageSelected(!!selectedFile);
};

// Function to send a tweet with image upload
const sendTweet = async (e) => 
{
  e.preventDefault();

  try {
    // Add a new document to the 'posts' collection with the tweet details
    const docRef = await addDoc(collection(db, 'posts'), 
    {
      username: username,
      displayName: `${firstname} ${lastname}`,
      avatar: currentUser.photoURL,
      verified: true,
      text: tweetMessage,
      timestamp: Timestamp.now(),
    });

    // Variable to store the image URL
    let imageUrl = ""; 

    // Check if a tweet image is provided
    if (tweetImage) 
    {
      // Create a reference to the storage location for the tweet image
      const imageRef = ref(storage, `posts-images/${docRef.id}/${Date.now()}_${tweetImage.name}`);

      // Upload the tweet image to Firebase Storage
      await uploadBytes(imageRef, tweetImage);

      // Get the download URL of the uploaded image
      imageUrl = await getDownloadURL(imageRef);
    }

    // Update the document with additional details including the image URL and postID
    await updateDoc(doc(db, 'posts', docRef.id), 
    {
      // Set the image URL in the document
      image: imageUrl, 
      postID: encodeURIComponent(docRef.id),
    });

    // Clear the tweetMessage and setTweetImage after successful posting
    setTweetMessage("");
    setTweetImage("");
    setIsImageSelected(false);
  } 
  
  catch (error) 
  {
    console.error('Error adding document: ', error);
  }
};


  // JSX structure for rendering the TweetBox component
  return (
    <div className="tweetBox">
      <form>
        {/* Input container for the tweet message */}
        <div className="container d-flex mt-3 tweetBox_input">
          <Avatar src={currentUser?.photoURL} />
          <input
            value={tweetMessage}
            onChange={(e) => setTweetMessage(e.target.value)}
            placeholder="What's happening?"
            type="text"
            className=" border-0 ms-2"
          />
        </div>
        {/* Input container for the tweet image URL */}
        <div className="mx-5 my-3 text-center">
          <Button
            sx=
            {{
              backgroundColor: '#50b7f5',
            }}
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Photo
            <VisuallyHiddenInput type="file" onChange={handleFileSelection} />
          </Button>
          {/* Check icon to indicate that an image is selected */}
          {isImageSelected && <CheckIcon style={{ color: 'green', marginLeft: '8px' }} />}
        </div>

        {/* Button to post the tweet */}
        <Button
          onClick={sendTweet}
          type="submit"
          className="tweetBox__button"
          disabled={!tweetMessage.trim() && !isImageSelected}
        >
          Post
        </Button>
      </form>
    </div>
  );
}

// Export the TweetBox component as the default export
export default TweetBox;
