// CartItem.tsx
import React, {useState} from 'react';
import  { TransactionItems}  from '../utils/types';
import { Card, CardContent, IconButton, Typography, Grid, Button, Box, Snackbar, TextField, SnackbarOrigin, Rating, Alert  } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

interface TransactionItemProps {
  item: TransactionItems;
}
interface State extends SnackbarOrigin {
    open: boolean;
  }

const CartItem: React.FC<TransactionItemProps> = ({ item }) => {

      
  const [openDialog, setOpenDialog] = useState(false);
        const [snackBarMesage, setSnakBarMessage] = useState('');
        const [review, setReview] = useState('');
        const [value, setValue] = React.useState<number | null>(2);
        const [hover, setHover] = React.useState(-1);
        const [cartItemId, setCartItemId] = React.useState(0);

          const [state, setState] = React.useState<State>({
            open: false,
            vertical: 'top',
            horizontal: 'center',
          });
        
          const { vertical, horizontal, open } = state;
            const navigate = useNavigate();
            
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
      
        // Check if the date is valid
        if (isNaN(date.getTime())) {
          return 'Invalid Date';
        }
      
        // Format the date in a readable format
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',  // Day of the week (e.g., Monday)
          year: 'numeric',
          month: 'long',    // Full month name (e.g., March)
          day: 'numeric',
          hour: '2-digit',  // 2 digits for hour (e.g., 03)
          minute: '2-digit', // 2 digits for minute (e.g., 21)
          second: '2-digit', // 2 digits for second (e.g., 59)
          hour12: true,     // Use 12-hour clock
        };
      
        return date.toLocaleString('en-US', options); // Customize the locale if needed
      }

      
        
         const handleReviewChanges = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
           const { value } = event.target;
             setReview(value);
         };
         
         const handleClose = () => {
           setValue(0);
           setReview('');
           setOpenDialog(false);
          };
     

      const rateProduct = async (review: string): Promise<void> => {
        try {
    
        
          const token = localStorage.getItem('authToken'); // Get token from localStorage
          if (!token) {
            throw new Error('No authentication token found.');
          }
          
          const response = await fetch('http://localhost:8080/api/ratings/create', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transactionId: item.id,
                cartItemId,
                review,
                rating: value
            }),
          });
    
          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || 'Failed to submit transaction');
          }
    
          const responseData = await response.json();
          console.log('Added to review successfully:', responseData);
          handleClick({ vertical: 'bottom', horizontal: 'center' }, "Item quantity updated")();
          setOpenDialog(false);
          setValue(0);
          setReview('');

          navigate('/transactions')

        //   handleClick({ vertical: 'bottom', horizontal: 'center' }, "Added to cart Successfully");
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      };

       const handleClick = (newState: SnackbarOrigin, message: string) => () => {
          setState({ ...newState, open: true });
          setSnakBarMessage(message);
        };

        const handleCloseSnackbar = (newState: SnackbarOrigin) => () => {
            setState({ ...newState, open: false });
          };
        
          const handleOpenDialog = (itemId: number) => () => {
            console.log("dialog opened");
            setOpenDialog(true);
            setCartItemId(itemId);
          }


  return (
    
    <Card sx={{ mb: 2 }}>
    <CardContent sx={{ height: '100%' }}>
      {item.cart.cartItems.map((item) => (
        <div key={item.cartItemId}>
          <Grid container spacing={2} alignItems="center" sx={{ padding: 2 }}>
            {/* Image */}
            <Grid item xs={4} sm={3} md={2}>
              <img
                src={`http://localhost:8080${item.product.image}`}
                alt={item.product.name}
                style={{width: 100, height: 100, objectFit: 'cover' }}
              />
            </Grid>
  
            {/* Product details */}
            <Grid item xs={8} sm={6} md={7}>
              <Typography variant="h6" sx={{ fontWeight: 700}}>{item.product.name}</Typography>
              {item.chosenSize && item.chosenSize !== "" && (
                <Typography variant="body2">{`Size: ${item.chosenSize}`}</Typography>
              )}
              {item.chosenColor && item.chosenColor !== "" && (
                <Typography variant="body2">{`Color: ${item.chosenColor}`}</Typography>
              )}
              <Typography variant="body1">Price: ${item.product.price}</Typography>
            </Grid>
  
            {/* Rate Product button */}

             {!item.reviewed &&  (
                           <Grid item xs={12} sm={3} md={3}>
                           <Button variant="contained" color="primary" onClick={handleOpenDialog(item.cartItemId)} fullWidth>
                             Rate Product
                           </Button>
                         </Grid>
                    )}
       
          </Grid>
  
          {/* Dialog for rating */}
          <Dialog aria-labelledby="customized-dialog-title" open={openDialog}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <Typography variant="h5" fontWeight="bold" fontFamily="'Arial', sans-serif">
                Rate This Product
              </Typography>
            </DialogTitle>
            <Button
              aria-label="close"
              onClick={() =>handleClose()}
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              X {/* Add a close icon or text */}
            </Button>
            <DialogContent dividers>
              <Rating
                  name="product-rating"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                }}
                  size="large"
                  sx={{ marginTop: 2 }} // Add some spacing
                />

                {/* Review TextField */}
                <TextField
                  label="Place your review"
                  variant="outlined"
                  fullWidth
                  value={review}
                  onChange={handleReviewChanges}
                  margin="normal"
                  required
                />

                 <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ padding: '12px 24px', mb: 2, mr: 2 }}
                                    onClick={() => rateProduct(review )}
                                  >
                                    Submit Review
                                  </Button>

                                  <div>
                                    {cartItemId}
                                  </div>

            </DialogContent>
          </Dialog>

                 <Box sx={{ width: 500 }}>
                      <Snackbar
                        anchorOrigin={{ vertical, horizontal }}
                        open={open}

autoHideDuration={6000}
                        key={vertical + horizontal}
                      >
                          <Alert
          onClose={()=> handleCloseSnackbar({ vertical: 'bottom', horizontal: 'center' })}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
                                Review Submitted! Thanks for your review!!

        </Alert>
        </Snackbar>
                    </Box>
        </div>
      ))}
  
      {/* Total and Date */}
      <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
        <Typography variant="h5">Total: ${item.totalAmount}</Typography>
        <Typography variant="h5">Transaction Date: {formatDate(item.transactionDate)}</Typography>
      </Grid>
    </CardContent>
  </Card>

    
  );
};

export default CartItem;
