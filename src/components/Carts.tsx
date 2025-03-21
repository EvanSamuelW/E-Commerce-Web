import React, { useState, useEffect } from 'react';
import CartItem from './CartItem';
import { Button, Typography, Container, Box, Grid, Snackbar, SnackbarOrigin } from '@mui/material';
import Checkout from './Checkout';

interface State extends SnackbarOrigin {
  open: boolean;
}

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [cartId, setCartId] = useState(0);

  const [carts, setCarts] = useState<any[]>([]);  // Use any[] if the structure of the items can be dynamic, otherwise define a proper type
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal, open } = state;
  const [snackBarMesage, setSnakBarMessage] = useState('');

  useEffect(() => {
    const fetchCarts = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch('http://localhost:8080/api/carts/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to fetch carts');
        }

        const data = await response.json();
        console.log(data);
        setCarts(data);  // Assuming the data structure contains individual cart items directly.
        setCartId(data[0].cartId);
      } catch (err) {
        setError('Failed to load carts');
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const deleteCartItem = async (cartItemId: number): Promise<void> => {
    try {
      console.log("Adding to cart...");
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`http://localhost:8080/api/carts/delete?cartItemId=${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to delete item from cart');
      }

      const responseData = await response.json();
      handleClick({ vertical: 'bottom', horizontal: 'center' }, "Item deleted from cart")();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const updateCart = async (cartItemId: number, quantity: number): Promise<void> => {
    try {
      console.log("Updating cart...");
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch('http://localhost:8080/api/carts/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItemId,
          quantity
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to update cart');
      }

      handleClick({ vertical: 'bottom', horizontal: 'center' }, "Item quantity updated")();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleClick = (newState: SnackbarOrigin, message: string) => () => {
    setState({ ...newState, open: true });
    setSnakBarMessage(message);
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenDialog = () => setOpenDialog(true);

  const handleIncrease = (cartItemId: number) => {
    setCarts((prevState) =>
      prevState.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

    const updatedItem = carts.find((item) => item.cartItemId === cartItemId);
    if (updatedItem) {
      updateCart(cartItemId, updatedItem.quantity + 1);
    }
  };

  const handleDecrease = (cartItemId: number) => {
    setCarts((prevState) =>
      prevState.map((item) =>
        item.cartItemId === cartItemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    const updatedItem = carts.find((item) => item.cartItemId === cartItemId);
    if (updatedItem) {
      updateCart(cartItemId, updatedItem.quantity - 1);
    }
  };

  const handleRemove = (cartItemId: number) => {
    setCarts((prevState) =>
      prevState.filter((item) => item.cartItemId !== cartItemId)
    );

    deleteCartItem(cartItemId);
  };

  const calculateTotal = () => {
    const total = carts.reduce((total, item) => total + item.product.price * item.quantity, 0);
    return total.toFixed(2);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : error ? (
        <Typography variant="h6">{error}</Typography>
      ) : carts.length === 0 ? (
        <Typography variant="h6">Your cart is empty.</Typography>
      ) : (
        <Box>
          <Box sx={{ marginBottom: 4 }}>
            {carts.map((item) => (
              <CartItem
                key={item.cartItemId}
                item={item}
                onIncrease={() => handleIncrease(item.cartItemId)}
                onDecrease={() => handleDecrease(item.cartItemId)}
                onRemove={() => handleRemove(item.cartItemId)}
              />
            ))}
            <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
              <Typography variant="h5">Total: ${calculateTotal()}</Typography>
              <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Checkout
              </Button>
            </Grid>
          </Box>

          {/* Snackbar to show success/error messages */}
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


      <Checkout
      cartId={cartId}
      totalAmount={calculateTotal()}
        open={openDialog}
        handleCloseDialog={handleCloseDialog}
      /> 
    </Container>
  );
};

export default Cart;
