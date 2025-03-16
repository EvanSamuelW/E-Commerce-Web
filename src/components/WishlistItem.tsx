// CartItem.tsx
import React from 'react';
import  {wishlistItems}  from '../utils/types';
import { Card, CardContent, IconButton, Typography, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

interface WishlistItemProps {
  item: wishlistItems;
  onRemove: (id: number) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ item, onRemove }) => {
  return (
    
    <Card sx={{mb: 2}}>
            <CardContent sx={{ height: '100%' }}>
            <Grid container spacing={2} alignItems="center" sx={{  padding: 2 }}>
              <Link to={`/productDetail/${item.product.id}`} style={{ textDecoration: 'none' }}>
              <Grid item>
        <img src={`http://localhost:8080${item.product.image}`} alt={item.product.name} style={{ width: 100, height: 100, objectFit: 'cover' }} />
      </Grid>
              </Link>
   
      <Grid item xs>
        <Typography variant="h6">{item.product.name}</Typography>
      
        <Typography variant="body1">Price: ${item.product.price}</Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={() => onRemove(item.wishlistItemId)} color="error">
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

export default WishlistItem;
