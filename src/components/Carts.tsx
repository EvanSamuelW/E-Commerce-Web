// Cart.tsx
import React, { useState } from 'react';
import { CartItemType, CartState } from '../utils/types';
import CartItem from './CartItem';
import { Button, Typography, Container, Box, Grid } from '@mui/material';

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartState>({
    items: [
      {
        id: 1,
        name: 'Product 1',
        price: 20,
        quantity: 1,
        size: 'S',
        color: 'Black',
        imageUrl: '/images/product1.jpg',
      },
      {
        id: 2,
        name: 'Product 2',
        price: 30,
        quantity: 2,
        size: 'S',
        color: 'Black',
        imageUrl: '/images/product2.jpg',
      },
    ],
  });

  const handleIncrease = (id: number) => {
    setCart((prevState) => ({
      items: prevState.items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  };

  const handleDecrease = (id: number) => {
    setCart((prevState) => ({
      items: prevState.items.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      ),
    }));
  };

  const handleRemove = (id: number) => {
    setCart((prevState) => ({
      items: prevState.items.filter((item) => item.id !== id),
    }));
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cart.items.length === 0 ? (
        <Typography variant="h6">Your cart is empty.</Typography>
      ) : (
        <Box>
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          ))}
          <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
            <Typography variant="h5">Total: ${calculateTotal()}</Typography>
            <Button variant="contained" color="primary">
              Checkout
            </Button>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Cart;
