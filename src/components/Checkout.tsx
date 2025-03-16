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
import { Slide } from '@mui/material'; // Import the Slide transition

interface PokemonDetailProps {
  open: boolean;
  handleCloseDialog: () => void;
}

const Checkout: React.FC<PokemonDetailProps> = ({ open, handleCloseDialog }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentmethods, setPaymentmethods] = useState<any[]>([]);

  const transitionDuration = { enter: 500, exit: 500 }; // Set the duration for animation

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
              control={<Checkbox />}
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
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
