// Import necessary hooks and components from React
import { useEffect, useState } from "react";
import Post from "./Post";
import TweetBox from "./TweetBox";

// Import functions from Firebase SDK
import 
{ 
  onSnapshot, 
  collection, 
  orderBy, 
  query, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

// Import Firebase configuration
import db from '../FirebaseConfig';

// Main component
function Feed() 
{
  // State to store posts
  const [posts, setPosts] = useState([]);

  // useEffect hook to fetch and update posts
  useEffect(() => 
  {
    // Define Firestore collection and query for posts
    const postsCollection = collection(db, 'posts');
    const postsQuery = query(postsCollection, orderBy('timestamp', 'desc'));

    // Subscribe to real-time updates on the posts collection
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => 
    {
      // Update state with the latest data from the Firestore collection
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Cleanup: Unsubscribe from real-time updates when the component is unmounted
    return () => unsubscribe();

    // The dependency array ensures that useEffect runs when db or setPosts change
  }, [db, setPosts]);

// Function to handle post deletion
const onDelete = async (postId) =>
{
  await deleteDoc(doc(db, 'posts', postId));
};

  // JSX structure
  return (
      <div className="feed">
          <div className="container-fluid border-bottom sticky-top bg-white p-2">
            <h2>Home</h2>
          </div>

          <TweetBox />

          {/* Display a message if there are no posts */}
          {posts.length === 0 ? 
          (
            <h1 className="display-5 text-secondary m-3">NO POST AVAILABLE</h1>
          ) : (
          posts.map((post) => 
          (
            <Post
              key={post.id}
              id={post.id}
              displayName={post.displayName}
              username={post.username}
              verified={post.verified}
              text={post.text}
              avatar={post.avatar}
              image={post.image}
              timestamp={post.timestamp}
              // Pass onDelete function as a prop to Post component
              onDelete={() => onDelete(post.id)}
            />
          ))
        )}
      </div> 
  );
}

// Export the Feed component as the default export
export default Feed;