import React, { useState, useEffect } from 'react';
import WishlistItem from './WishlistItem';
import { Typography, Container, Box, Snackbar, SnackbarOrigin } from '@mui/material';


interface State extends SnackbarOrigin {
  open: boolean;
}

const Wishlists = () => {
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const [wishlists, setWishlists] = useState<any[]>([]);  // Use any[] if the structure of the items can be dynamic, otherwise define a proper type
    const [state, setState] = React.useState<State>({
      open: false,
      vertical: 'top',
      horizontal: 'center',
    });
  
    const { vertical, horizontal, open } = state;
    const [snackBarMesage, setSnakBarMessage] = useState('');

  useEffect(() => {
    const fetchWishlists = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch('http://localhost:8080/api/wishlists/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to fetch wishlists');
        }

        const data = await response.json();
        console.log(data);
        setWishlists(data);  // Assuming the data structure contains individual cart items directly.
      } catch (err) {
        setError('Failed to load carts');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);


  const deleteCartItem = async (cartItemId: number): Promise<void> => {
    try {
      console.log("Adding to cart...");
      const token = localStorage.getItem('authToken'); // Get token from localStorage
      if (!token) {
        throw new Error('No authentication token found.');
      }
  
      const response = await fetch(`http://localhost:8080/api/wishlists/delete?wishlistItemId=${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      // Check if response is not OK (i.e., 401 Unauthorized)
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to delete item from cart');
      }
  
      // Optionally handle the response (e.g., showing a success message)
      const responseData = await response.json();
      
      // Optionally show a success snackbar or message
      handleClick({ vertical: 'bottom', horizontal: 'center' },"item deleted from wishlist")(); // You can trigger a Snackbar here
  
    } catch (error) {
      console.error('Error updating cart:', error);
      // Show an error message in the UI (e.g., Snackbar or Alert)
    }
    };


      const handleClick = (newState: SnackbarOrigin, message: string) => () => {
        setState({ ...newState, open: true });
        setSnakBarMessage(message);
      };


  const handleClose = () => {
    setState({ ...state, open: false });
  };


  const handleRemove = (wishlistItemId: number) => {
    setWishlists((prevState) =>
      prevState.filter((item) => item.wishlistItemId !== wishlistItemId)  // Remove the item with the matching cartItemId
    );

    deleteCartItem(wishlistItemId);
  };



  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Wishlist
      </Typography>
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : error ? (
        <Typography variant="h6">{error}</Typography>
      ) : wishlists.length === 0 ? (
        <Typography variant="h6">Your wishlist is empty.</Typography>
      ) : (
        <Box>
          <Box sx={{ marginBottom: 4 }}>
            {wishlists.map((item) => (
              <Box key={item.wishlistItemId} sx={{ marginBottom: 2 }}>
                {/* Wrap each WishlistItem in a Link */}
                
                  <WishlistItem
                    item={item}
                    onRemove={() => handleRemove(item.wishlistItemId)}
                  />
        
              </Box>
            ))}
          </Box>

          <Box sx={{ width: 500 }}>
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={open}
              onClose={handleClose}
              message={snackBarMesage}
              autoHideDuration={3000}
              key={vertical + horizontal}
            />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Wishlists;
