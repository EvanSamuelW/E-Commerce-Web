import { Container, Box, Grid, Typography, Button, Rating, Card, CardMedia, CardContent, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Snackbar, SnackbarOrigin } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface State extends SnackbarOrigin {
  open: boolean;
}

const relatedProducts = [
  {
    id: 2,
    name: 'Smartwatch',
    price: '$129.99',
    image: '/images/product2.jpg',
  },
  {
    id: 3,
    name: 'Gaming Mouse',
    price: '$49.99',
    image: '/images/product3.jpg',
  },
  {
    id: 4,
    name: 'Portable Speaker',
    price: '$79.99',
    image: '/images/product4.jpg',
  },
];

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle the case where `product` is not found in location state
  const { product } = location.state || {}; // Check for undefined or null state

  // Early return to handle product not found but after declaring useState hooks
  if (!product) {
    navigate('/'); // Redirect to home page or product listing if product not found
    return <Typography variant="h6" color="error">Product not found!</Typography>;
  }
  console.log(product);
  // Declare your hooks after checking the product existence
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(product.productSizes[0]); // Default size (with explicit type)
  const [selectedColor, setSelectedColor] = useState<string>(product.productColors[0]); // Default color (with explicit type)

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
          <Rating value={3.0} precision={0.5} readOnly sx={{ mb: 2 }} />
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
              onChange={(e) => setSelectedSize(e.target.value as string)} // Type cast as string
            >
              {product.productSizes.map((size: string) => ( // Explicitly type size as string
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
              onChange={(e) => setSelectedColor(e.target.value as string)} // Type cast as string
            >
              {product.productColors.map((color: string) => ( // Explicitly type color as string
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

                  {/* View Details Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/product-detail`, { state: { product: relatedProduct } })}
                  >
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