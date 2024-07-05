// Import necessary dependencies and components
import { useAuth } from '../FirebaseConfig';
import { getStorage, ref, deleteObject } from 'firebase/storage';

import Swal from 'sweetalert2'

import Avatar from '@mui/material/Avatar';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PublishIcon from '@mui/icons-material/Publish';
import RepeatIcon from '@mui/icons-material/Repeat';
import VerifiedUserSharpIcon from '@mui/icons-material/VerifiedUserSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { enUS } from 'date-fns/locale';

// Define the Post component
function Post({ id, displayName, username, verified, text, image, avatar, timestamp, onDelete }) 
{

  // Use the useAuth hook to get the current user
  const currentUser = useAuth();

  // Format the timestamp for display
  const formattedTimestamp = formatDistanceToNow(new Date(timestamp.seconds * 1000), { addSuffix: true, locale: enUS });
  
  // Create a Date object from the timestamp
  const postDate = new Date(timestamp.seconds * 1000);

  // Function to check if the post is more than one day old
  const isMoreThanOneDayOld = () => 
  {
    const postDate = new Date(timestamp.seconds * 1000);
    const currentDate = new Date();
    const differenceInDays = Math.floor((currentDate - postDate) / (1000 * 60 * 60 * 24));
    return differenceInDays > 0;
  };


  const handleDeleteClick = async () => 
  {
    if (username === currentUser.displayName) 
    {
      Swal.fire
      ({
        allowOutsideClick: false,
        icon: 'warning',
        title: 'Delete this post?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonColor: '#860A35',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then(async (result) => 
      {
        if (result.value) 
        {
          try {
            // If there's an image associated with the post, delete it from Storage
            if (image) 
            {
              const storageRef = ref(getStorage(), image);
              await deleteObject(storageRef);
            }
  
            // Delete the post from Firestore
            await onDelete(id);
  
            Swal.fire
            ({
              icon: 'success',
              title: 'Deleted!',
              text: 'Post has been deleted.',
              showConfirmButton: false,
              timer: 1500,
            });
          } 
          
          catch (error) 
          {
            console.error('Error deleting post:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'An error occurred while deleting the post.',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      });
    } 
    
    else 
    {
      Swal.fire
      ({
        timer: 1500,
        allowOutsideClick: false,
        icon: 'error',
        title: 'Error!',
        text: `You can't delete someone else's post`,
        showConfirmButton: false,
      });
    }
  };
  
  // JSX structure for rendering a post
  return (
    <div className="container-fluid d-flex">
      <div className="p-3">
        {/* Display the user's avatar */}
        <Avatar src={avatar} />
      </div>
      <div className="container-fluid mt-3">
          <h6>
            {/* Display the display name and username */}
            {displayName}{' '}
            <span className="container p-0 m-0">
              {verified && 
              // Display a verified icon if the user is verified
              <VerifiedUserSharpIcon 
              style={{ color: '#50b7f5', fontSize: '15px' }}
              />} 
              {/* Display the post timestamp */}
              <small className="ms-1">@{username}</small>
              <span className="ms-1 text-secondary">· {isMoreThanOneDayOld() ? postDate.toLocaleDateString() : formattedTimestamp}</span>
            </span>
          </h6>
          {/* Display the post text */}
          <div className="container p-0 m-0">
            <p>{text}</p>
          </div>

        {/* Display the post text */}
        {image && (
          <img
            className="img-fluid rounded"
            src={image}
            alt="User Post Image"
            style={{ width: '400px', height: '250px' }}
          />
        )}

        {/* Display icons for actions (e.g., comment, retweet, like, publish, delete) */}
        <div className="container-fluid d-flex justify-content-evenly mt-4">
            <ChatBubbleOutlineIcon fontSize="small" />
            <RepeatIcon fontSize="small" />
            <FavoriteBorderIcon fontSize="small" />
            <PublishIcon fontSize="small"/>
            <Tooltip title="Delete post">
                <DeleteIcon onClick={handleDeleteClick} variant="contained" fontSize="small"></DeleteIcon>
            </Tooltip>
        </div>
      </div>
    </div>
  );
}




// Export the Post component as the default export
export default Post;