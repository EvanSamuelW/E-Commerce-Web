import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'; // For loading state
import { Slide, SnackbarOrigin, Box, Snackbar } from '@mui/material'; // Import the Slide transition
import TextField from '@mui/material/TextField'; // Import TextField for address input

interface CheckoutProps {
  open: boolean;
  cartId: number;
  totalAmount: number;
  handleCloseDialog: () => void;
}

interface State extends SnackbarOrigin {
  openDialog: boolean;
}

const Checkout: React.FC<CheckoutProps> = ({ cartId, totalAmount ,open, handleCloseDialog }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentmethods, setPaymentmethods] = useState<any[]>([]);
  
  // State for shipping and billing addresses
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [billingAddress, setBillingAddress] = useState<string>('');

  const transitionDuration = { enter: 500, exit: 500 }; // Set the duration for animation

    const [state, setState] = React.useState<State>({
      openDialog: false,
      vertical: 'top',
      horizontal: 'center',
    });
  
    const { vertical, horizontal, openDialog } = state;
    const [snackBarMesage, setSnakBarMessage] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    

  useEffect(() => {
    const fetchPaymentMehtods = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch('http://localhost:8080/api/payment-method/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to fetch payment methods');
        }

        const data = await response.json();
        setPaymentmethods(data); // Assuming the data structure contains payment method details
      } catch (err) {
        setError('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMehtods();
  }, []);

  if (loading) return <div><CircularProgress /></div>; // Using MUI CircularProgress for loading state
  if (error) return <div>{error}</div>;

  // Handle address change
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, addressType: 'shipping' | 'billing') => {
    const { value } = event.target;
    if (addressType === 'shipping') {
      setShippingAddress(value);
    } else if (addressType === 'billing') {
      setBillingAddress(value);
    }
  };

  const submitTransaction = async ( paymentMethod: string, shippingAddress: string, billingAddress: string): Promise<void> => {
    try {
      console.log("Submitting transaction...");

    
      const token = localStorage.getItem('authToken'); // Get token from localStorage
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      const response = await fetch('http://localhost:8080/api/transactions/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        cartId,
         totalAmount,
         paymentMethod,
         shippingAddress,
         billingAddress
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to submit transaction');
      }

      const responseData = await response.json();
      console.log('Added to cart successfully:', responseData);
      handleClick({ vertical: 'bottom', horizontal: 'center' }, "Added to cart Successfully");
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

   const handleClick = (newState: SnackbarOrigin, message: string) => () => {
      setState({ ...newState, openDialog: true });
      setSnakBarMessage(message);
    };
  
    const handleClose = () => {
      setState({ ...state, openDialog: false });
    };


    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedPaymentMethod(event.target.value);
    };

    
  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      TransitionComponent={Slide} // Use Slide transition
      transitionDuration={transitionDuration} // Set duration for the animation
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Typography variant="h3" fontWeight="bold" fontFamily="'Arial', sans-serif">
          Checkout
        </Typography>
      </DialogTitle>
      <Button
        aria-label="close"
        onClick={handleCloseDialog}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        X  {/* Add a close icon or text */}
      </Button>
      <DialogContent dividers>

        <Typography variant="h5" fontWeight="bold" fontFamily="'Arial', sans-serif">
          Payment Method
        </Typography>

        <FormGroup>
          {/* Display payment methods with images */}
          {paymentmethods.map((item) => (
            <FormControlLabel
              key={item.id} // Make sure to use a unique key, assuming 'id' is unique
              control={<Checkbox  value={item.name} // Use the payment method's name as value
              checked={selectedPaymentMethod === item.name} // Check if it matches the selected payment method
              onChange={handlePaymentMethodChange}  />}
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={`http://localhost:8080${item.image}`} // Assuming each payment method has an 'imageUrl' field
                    alt={item.name}
                    style={{
                      width: 30, // Set the desired width for the image
                      height: 30, // Set the desired height for the image
                      marginRight: 10, // Add space between the image and the label
                    }}
                  />
                  {item.name}
                </div>
              }
            />
          ))}
        </FormGroup>

        {/* Shipping Address Field */}
        <TextField
          label="Shipping Address"
          variant="outlined"
          fullWidth
          value={shippingAddress}
          onChange={(e) => handleAddressChange(e, 'shipping')}
          margin="normal"
          required
        />

        {/* Billing Address Field */}
        <TextField
          label="Billing Address"
          variant="outlined"
          fullWidth
          value={billingAddress}
          onChange={(e) => handleAddressChange(e, 'billing')}
          margin="normal"
          required
        />

         <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: '12px 24px', mb: 2, mr: 2 }}
                    onClick={() => submitTransaction(selectedPaymentMethod,shippingAddress, billingAddress )}
                  >
                    Add to Cart
                  </Button>

                        {/* Snackbar to show success/error messages */}
          <Box sx={{ width: 500 }}>
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={openDialog}
              onClose={handleClose}
              message={snackBarMesage}
              autoHideDuration={3000}
              key={vertical + horizontal}
            />
          </Box>

      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
