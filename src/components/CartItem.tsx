// CartItem.tsx
import React from 'react';
import  {CartItems}  from '../utils/types';
import { Card, CardContent, IconButton, Typography, Grid, Button } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface CartItemProps {
  item: CartItems;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    
    <Card sx={{mb: 2}}>
            <CardContent sx={{ height: '100%' }}>
            <Grid container spacing={2} alignItems="center" sx={{  padding: 2 }}>
      <Grid item>
        <img src={`http://localhost:8080${item.product.image}`} alt={item.product.name} style={{ width: 100, height: 100, objectFit: 'cover' }} />
      </Grid>
      <Grid item xs>
        <Typography variant="h6">{item.product.name}</Typography>
        {item.chosenSize && item.chosenSize !== "" && (
          <Typography variant="body2">{`Size: ${item.chosenSize}`}</Typography>
        )}
              {item.chosenColor && item.chosenColor !== "" && (
        <Typography variant="body2">{`Color: ${item.chosenColor}`}</Typography>
      )} 
          
        <Typography variant="body1">Price: ${item.product.price}</Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={() => onDecrease(item.cartItemId)} color="primary" disabled={item.quantity <= 1}>
          <RemoveIcon />
        </IconButton>
        <Typography variant="body1" display="inline" sx={{ margin: '0 8px' }}>
          {item.quantity}
        </Typography>
        <IconButton onClick={() => onIncrease(item.cartItemId)} color="primary">
          <AddIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={() => onRemove(item.cartItemId)} color="error">
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
    {/* <Grid textAlign={'end'}>
    <Button variant="contained" color="primary">Add To Cart</Button>
    </Grid> */}
   
            </CardContent>
    
        </Card>

    
  );
};

export default CartItem;
