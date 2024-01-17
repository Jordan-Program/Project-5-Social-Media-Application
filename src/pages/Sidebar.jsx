// Import necessary dependencies and components
import { useState, useEffect, useRef } from "react";

import { useNavigate } from 'react-router-dom';

import 
{  
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,

} from 'firebase/firestore';

import 
{ 
  onAuthStateChanged, 
  signOut,

} from "firebase/auth";

import db from '../FirebaseConfig';
import {auth, useAuth, upload} from '../FirebaseConfig';

import Swal from 'sweetalert2'

import SidebarOption from "../pages/SidebarOption"
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import {Avatar}  from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

// Define the Sidebar component
function Sidebar() 
{
  // State variables
  const currentUser = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [photoURL, setphotoURL] = useState("https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg");
  const [profilePic, setprofilePic] = useState(null);
  const [loading, setloading] = useState(false);
  const [userId, setuserId] = useState("");
  const [username, setusername] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  
  // Fetch user ID on component mount
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
  
  // Fetch user data based on user ID
  useEffect(() => 
  {
    const fetchData = async () => 
    {
      try 
      {
        const q = query(collection(db, "db-socmedapp-username"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach((doc) => 
        {
          const data = doc.data();
          setusername(data.displayName || "");
          setfirstname(data.firstName || "");
          setlastname(data.lastName || "");
        });
      } 
      
      catch (error) 
      {
        console.error("Error getting documents: ", error);
      }
    };
  
    fetchData();
  }, [userId]);

  // Update photoURL state if currentUser's photoURL changes
  useEffect(() => 
  {
    if (currentUser?.photoURL) 
    {
      setphotoURL(currentUser.photoURL);
    }
  }, [currentUser?.photoURL]);

  // Event handler for changing profile picture
  function handleChangeProfilePic(e) 
  {
    const selectedFile = e.target.files[0];

    if (selectedFile) 
    {
      setprofilePic(selectedFile);
      setSelectedFileName(selectedFile.name);
      
    }
    
    else 
    {
      setprofilePic(null);
      setSelectedFileName('');
    }

    fileInputRef.current.value = null;
  }

  // Event handler for clicking profile picture upload
  function handleClickProfilePic ()
  {
    // Call the upload function from FirebaseConfig to upload the profile picture
    upload(profilePic, currentUser, setloading);

    // Update the avatar field in the posts collection
    const profilePics = doc(db, "posts", username);
    const profilePicsSnapshot =  getDoc(profilePics);

    if (profilePicsSnapshot.exists) 
    {
       updateDoc(profilePics, 
      {
        avatar: currentUser.photoURL,
      });
    }
  };
  
  // Event handler for logout
  function handleLogout ()
  {

    Swal.fire
    ({
      icon: 'question',
      title: 'Logging Out',
      text: 'Are you sure you want to log out?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#50b7f5',
    }).then(result => 
      {

      if (result.value) 
      {
        
        Swal.fire
        ({
          timer: 1500,
          showConfirmButton: false,
          willOpen: () => 
          {
            Swal.showLoading();
          },
          willClose: () => 
          {
            
            navigate('login');

            
            signOut(auth).then(() => 
            {
              
            }).catch((error) => 
            {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorCode)
              alert(errorMessage)
            });
          
          },
        });
      }
    });
  };

  // Event handler for coming soon options
  function handleComingSoon()
  {
    Swal.fire
    ({
      icon: 'info',
      title: 'Underdevelopment!',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  // JSX structure for rendering the Sidebar component
  return (
    <div className="sidebar">
      
      {/* Render SidebarOption components for various options */}
      <SidebarOption Icon={HomeIcon} text="Home" active={true} />
      <SidebarOption Icon={SearchIcon} text="Explore" onClick={handleComingSoon} />
      <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" onClick={handleComingSoon} />
      <SidebarOption Icon={MailOutlineIcon} text="Messages" onClick={handleComingSoon} />
      <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" onClick={handleComingSoon} />
      <SidebarOption Icon={ListAltIcon} text="Lists" onClick={handleComingSoon} />
      <SidebarOption Icon={PermIdentityIcon} text="Profile" onClick={handleComingSoon} />
      <SidebarOption Icon={MoreHorizIcon} text="More" onClick={handleComingSoon} />
      {/* Button for logging out */}
      <Button
        onClick={handleLogout}
        sx={{
          color: '#50b7f5',
          fontSize: '15px',
          padding: '5px',
          marginLeft:'30px',
          width:'100px'
        }}
        >
        <LogoutIcon sx={{ marginRight: '4px', fontSize: '18px', }} />
          Logout
      </Button>
      
      {/* Render the user information section */}
      <div className="container d-flex align-content-center justify-content-center pt-5">
        <div className="row">
          <div className="col col-lg-2 pt-1">
            {/* Display the user's avatar */}
            <Avatar src={photoURL} alt="Avatar"/>
          </div>

          <div className="col mb-4">
            {/* Display user information (name, username) */}
            <small className="ms-1">{firstname} {lastname}</small>
            <br />
            <small className="text-secondary">@{username}</small>
          </div>
          
          <div className="col col-10 p-0">
            {/* Buttons for uploading and browsing profile picture */}
            <button disabled={loading || !profilePic} 
              className="btn btn-secondary btn-sm mt-1 mb-2" 
              onClick={handleClickProfilePic}
            >
              Upload
            </button>

            {/* Styled MUI Button for browsing profile picture */}
            <Button 
            sx=
            {{
                backgroundColor:'#50b7f5',
                
              }}
              component="label" 
              variant="contained" 
              startIcon={<CloudUploadIcon />} 
              onChange={handleChangeProfilePic} 
              ref={fileInputRef}>
                Change Profile Pic
              <VisuallyHiddenInput type="file" />
            </Button>
            {/* Display the selected file name */}
            <div className="container col-form-label-sm d-flex overflow-x-auto">
              {selectedFileName && <span className="">Selected File: {selectedFileName}</span>}
            </div>
          </div>
          <div className="container mt-3">
            <div className="row">
             <div className="col">
                <div className="container">
                </div>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the Sidebar component as the default export
export default Sidebar;