// Import necessary dependencies and components
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Tweet } from 'react-tweet';

// Define the Widgets component as a functional component
function Widgets() 
{
  // State to manage the tweet ID
  const [tweetId, setTweetId] = useState("1743353392087646591");

  // Function to handle input change
  const handleInputChange = (e) => 
  {
    // Update the tweet ID when the input changes
    setTweetId(e.target.value);
  };

  // JSX structure for rendering the Widgets component
  return (
    <div className="widgets">
      {/* Input container for searching Twitter */}
      <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon" />
        <input
          placeholder="Search TwiTalk"
          type="text"
          value={tweetId}
          onChange={handleInputChange}
        />
      </div>

      {/* Widget container for displaying Twitter content */}
      <div className="widgets__widgetContainer">
        <h2>What's happening</h2>
        {/* Embed a Twitter tweet with the specified tweet ID */}
        <Tweet id={tweetId} />
      </div>
    </div>
  );
}

// Export the Widgets component as the default export
export default Widgets;