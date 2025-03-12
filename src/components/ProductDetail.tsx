import { Container, Box, Grid, Typography, Button, Rating, Card, CardMedia, CardContent, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Snackbar, SnackbarOrigin } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import React, { useState } from 'react';

interface State extends SnackbarOrigin {
  open: boolean;
}

// Sample Product Data
const product = {
  id: 1,
  name: 'Wireless Headphones',
  description: `
    <ul>
      <li><strong>LONG BATTERY LIFE:</strong> With up to 50-hour battery life and quick charging, you’ll have enough power for multi-day road trips and long festival weekends. (USB Type-C Cable included)</li>
      <li><strong>HIGH QUALITY SOUND:</strong> Great sound quality customizable to your music preference with EQ Custom on the Sony | Headphones Connect App.</li>
      <li><strong>LIGHT & COMFORTABLE:</strong> The lightweight build and swivel earcups gently slip on and off, while the adjustable headband, cushion and soft ear pads give you all-day comfort.</li>
      <li><strong>CRYSTAL CLEAR CALLS:</strong> A built-in microphone provides you with hands-free calling. No need to even take your phone from your pocket.</li>
      <li><strong>MULTIPOINT CONNECTION:</strong> Quickly switch between two devices at once.</li>
      <li><strong>AVAILABLE IN FOUR COLORS:</strong> With Black, Blue, White, and Cappuccino to choose from, find the color that suits you best.</li>
      <li><strong>GIVE YOUR MUSIC A BOOST:</strong> Boost the quality of compressed music files and enjoy streaming music with high quality sound through DSEE.</li>
      <li><strong>FIND YOUR HEADPHONES WITH FAST PAIR:</strong> Easily find your missing headphones by sound or check their last known location in Google’s Find My Device app on your smartphone.</li>
      <li><strong>EASY CONNECTION TO YOUR PC:</strong> Swift Pair makes it quick and easy to pair your headphones with your Windows 10 computer via Bluetooth.</li>
    </ul>
  `,
  price: '$199.99',
  image: '/images/product1.jpg', // Replace with the actual image path
  rating: 4.5,
  availableSizes: ['10 Inch', '12 Inch', '16 Inch'],  // Available Sizes
  availableColors: ['Red', 'Blue', 'Black'],  // Available Colors
};

const relatedProducts = [
  {
    id: 2,
    name: 'Smartwatch',
    price: '$129.99',
    image: '/images/product2.jpg', // Replace with actual image
  },
  {
    id: 3,
    name: 'Gaming Mouse',
    price: '$49.99',
    image: '/images/product3.jpg', // Replace with actual image
  },
  {
    id: 4,
    name: 'Portable Speaker',
    price: '$79.99',
    image: '/images/product4.jpg', // Replace with actual image
  },
];

const ProductDetail = () => {
  // State to manage quantity, selected size, and selected color
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0]); // Default size
  const [selectedColor, setSelectedColor] = useState(product.availableColors[0]); // Default color
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  // Function to increase the quantity
  const increaseQuantity = () => setQuantity((prevQuantity) => prevQuantity + 1);

  // Function to decrease the quantity (ensure it doesn't go below 1)
  const decreaseQuantity = () => setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));

  return (
    <Container sx={{ pt: 8, pb: 6 }}>
      {/* Product Detail Section */}
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ maxWidth: '100%', height: '500px', objectFit: 'contain' }} // Adjusted height
            />
          </Box>
        </Grid>

        {/* Product Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
            {product.name}
          </Typography>
          <Rating value={product.rating} precision={0.5} readOnly sx={{ mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
            {product.price}
          </Typography>

          {/* Product Description (HTML Content) */}
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }} dangerouslySetInnerHTML={{ __html: product.description }} />

          {/* Size Selector */}
          <FormControl sx={{ mb: 2, mr: 2 }}>
            <InputLabel>Size</InputLabel>
            <Select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.availableSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Color Selector */}
          <FormControl sx={{ mb: 2 }}>
            <InputLabel>Color</InputLabel>
            <Select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {product.availableColors.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Quantity Adjuster */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ mr: 2 }}>Quantity:</Typography>
            <IconButton onClick={decreaseQuantity} color="primary" aria-label="decrease quantity">
              <RemoveIcon />
            </IconButton>
            <TextField
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              inputProps={{
                min: 1,
                style: { textAlign: 'center' }, // Center align the quantity
              }}
              type="number"
              size="small"
              sx={{ width: 70 }}
            />
            <IconButton onClick={increaseQuantity} color="primary" aria-label="increase quantity">
              <AddIcon />
            </IconButton>
          </Box>

          {/* Add to Cart Button */}
          <Button variant="contained" color="primary" sx={{ padding: '12px 24px', mb: 2, mr: 2 }}>
            Add to Cart
          </Button>

          {/* Add to Wishlist Button */}
          <Button variant="outlined" color="secondary" sx={{ padding: '12px 24px', mb: 2 }} onClick={handleClick({ vertical: 'bottom', horizontal: 'center' })}>
            Add to Wishlist
          </Button>
        </Grid>
      </Grid>

      {/* Related Products Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }} align="center">
          Related Products
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {relatedProducts.map((relatedProduct) => (
            <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={relatedProduct.image}
                  alt={relatedProduct.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {relatedProduct.name}
                  </Typography>
                  <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                    {relatedProduct.price}
                  </Typography>

                  <Button variant="contained" color="primary" fullWidth>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Snackbar */}
      <Box sx={{ width: 500 }}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          message="Added to Wishlist"
          autoHideDuration={3000}
          key={vertical + horizontal}

      />
    </Box>
    </Container>
  );
};

export default ProductDetail;
