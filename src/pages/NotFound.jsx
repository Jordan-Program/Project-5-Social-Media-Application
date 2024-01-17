// Import necessary components and styles from Material-UI
import { useEffect } from 'react';

import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

// Define the NotFound component
function NotFound() 
{
    // useEffect hook to handle side effects
    useEffect(() => 
    {
        // Set the document title and body background color when the component mounts
        document.title = 'Page Not Found';
        document.body.style.backgroundColor = 'white';

        // Clean up function to reset the body background color when the component unmounts
        return () => 
        {
            document.body.style.backgroundColor = '';
        };
    }, []);

    // JSX structure for the NotFound component
    return (

        <Container>
            {/* Display a sad face icon */}
            <SentimentVeryDissatisfiedIcon sx={{color:"black",
                width: '100%',
                fontSize: 500,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'}}
            />

            {/* Display a large heading for the 404 message */}
            <Typography variant="h1" sx={{color:"black",width: '100%',
                marginTop: 5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                fontWeight: 'bold',
                alignItems: 'center'}} >
                {
                    `
                        PAGE 404
                    `
                }
            </Typography>
            
            {/* Display a subheading for additional information */}
            <Typography 
                variant="h2"  
                component="div" 
                sx={{color:"black",width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                fontWeight: 'bold',
                alignItems: 'center'}} >
                {
                    `
                        You have found a secret place.
                    `
                }
            </Typography>

            {/* Display a message providing details about the 404 error */}
            <Typography 
                variant="h6"   
                sx={{color:"black",width: '100%',
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'}} >
                {
                    `
                        Unfortunately, this is only a 404 page. 
                        You may have mistyped the address, or the page has been moved to another URL.
                    `
                }
            </Typography>

            {/* Display a button to go back to the home page */}
            <Button  
                href='/' 
                sx={{color:"black",
                backgroundColor: "white",
                textAlign: 'center',
                width: 100,
                display: 'block', 
                margin: '0 auto',
                fontWeight: 'bold',
                marginTop: 2,
                transition: 'background-color 0.3s',
                '&:hover': {
                color:"white",
                backgroundColor: 'black',
                },}}>
                Go Back
            </Button>
        </Container>
    );
}

// Export the NotFound component as the default export
export default NotFound