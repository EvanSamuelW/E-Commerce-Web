import { Container, Box, Grid, Button, Rating, Card, CardMedia, CardContent, FormControl, InputLabel, Select, MenuItem, Snackbar, SnackbarOrigin, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

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

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  productSizes: string[];
  productColors: string[];
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();  // Extract productId from the URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);  // Initially loading
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>(''); // Initialize with default value
  const [selectedColor, setSelectedColor] = useState<string>(''); // Initialize with default value

  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal, open } = state;

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem('authToken');
      
      try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Handle conditional rendering based on loading or error state
  if (loading) {
    return <Typography variant="h6" color="primary">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }



  const addToCart = async (productId: any, choosenColor: string, choosenSize: string): Promise<void> => {
    try {
      console.log("Adding to cart...");
      const token = localStorage.getItem('authToken'); // Get token from localStorage
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      const response = await fetch('http://localhost:8080/api/carts/add-item', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          choosenSize,
          choosenColor,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to add item to cart');
      }

      const responseData = await response.json();
      console.log('Added to cart successfully:', responseData);
      handleClick({ vertical: 'bottom', horizontal: 'center' }, "Added to cart Successfully");
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToWishlist = async (productId: any): Promise<void> => {
    try {
      console.log("Adding to wishlist...");
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`http://localhost:8080/api/wishlists/add-item?productId=${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to add item to wishlist');
      }

      const responseData = await response.json();
      console.log('Added to wishlist successfully:', responseData);
      handleClick({ vertical: 'bottom', horizontal: 'center' }, "Added to wishlist");
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleClick = (newState: SnackbarOrigin, message: string) => () => {
    setState({ ...newState, open: true });
    setSnackbarMessage(message);
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <Container sx={{ pt: 8, pb: 6 }}>
      <Grid container spacing={4}>
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
              src={`http://localhost:8080${product?.image}`}
              alt={product?.name}
              style={{ maxWidth: '100%', height: '500px', objectFit: 'contain' }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
            {product?.name}
          </Typography>
          <Rating value={3.0} precision={0.5} readOnly sx={{ mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
            {product?.price}
          </Typography>

          <Typography 
      variant="body1" 
      paragraph 
      sx={{ color: 'text.secondary' }} 
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(product?.description || '')
      }} 
/>        
          {product?.productSizes && product.productSizes.length > 1 &&  <FormControl sx={{ mb: 2, mr: 2, width: 100 }}>
            <InputLabel>Size</InputLabel>
            <Select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as string)}
            >
              {product?.productSizes.map((size: string) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>}
         
              {product?.productColors && product.productColors.length > 1 && <FormControl sx={{ mb: 2, mr:2, width: 100 }}>
            <InputLabel>Color</InputLabel>
            <Select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value as string)}
            >
              {product?.productColors.map((color: string) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>}
          

          <Button
            variant="contained"
            color="primary"
            sx={{ padding: '12px 24px', mb: 2, mr: 2 }}
            onClick={() => addToCart(product?.id, selectedColor, selectedSize)}
          >
            Add to Cart
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            sx={{ padding: '12px 24px', mb: 2 }}
            onClick={() => addToWishlist(product?.id)}
          >
            Add to Wishlist
          </Button>
        </Grid>
      </Grid>

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

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/product-detail/${relatedProduct.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ width: 500 }}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          message={snackbarMessage}
          autoHideDuration={3000}
          key={vertical + horizontal}
        />
      </Box>
    </Container>
  );
};

export default ProductDetail;
