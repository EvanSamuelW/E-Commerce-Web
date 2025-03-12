import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Import react-router

const recommendedProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    image: '/images/product1.jpg', // Replace with your product image
    price: '$199.99',
  },
  {
    id: 2,
    name: 'Smartwatch',
    description: 'Feature-packed smartwatch with fitness tracking.',
    image: '/images/product2.jpg', // Replace with your product image
    price: '$129.99',
  },
  {
    id: 3,
    name: 'Gaming Mouse',
    description: 'Ergonomic gaming mouse with customizable buttons.',
    image: '/images/product3.jpg', // Replace with your product image
    price: '$49.99',
  },
  {
    id: 4,
    name: 'Portable Speaker',
    description: 'Compact and powerful Bluetooth speaker for outdoor use.',
    image: '/images/product4.jpg', // Replace with your product image
    price: '$79.99',
  },
];

const AboutUs = () => {
  return (
    <Container sx={{ pt: 8, pb: 6 }}>
      {/* Hero Section with Image and Description */}
      <Grid container spacing={4} alignItems="center">
        {/* Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundImage: 'url(/images/image.jpg)', // Replace with your image path
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: 400, // Adjust height based on your design
              borderRadius: 2,
            }}
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
            About Us
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
            We are a team of passionate individuals, dedicated to providing you with the best online shopping experience.
          </Typography>
          <Typography variant="body1" paragraph>
            Our mission is to bring you the highest quality products at the most affordable prices, while delivering exceptional service and a seamless online shopping experience. We aim to create a platform where you can find everything you need with just a few clicks.
          </Typography>
        </Grid>
      </Grid>
            
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 4 , mt: 8}}>
          Recommended Products
        </Typography>

        <Container sx={{ pt: 8, pb: 6 }}>
      <Grid container spacing={4} justifyContent="center">
        {recommendedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontSize: '0.875rem', // Slightly larger font size for readability
                    lineHeight: 1.6, // Increased line height for better readability
                    color: '#666', // Softer color for description text
                  }}
                >
                  {product.description}
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {product.price}
                </Typography>
                <Link to={`/ProductDetail`} style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" fullWidth>
                  Product Detail
                </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
        Ready for More? Dive Into Our Full Selection of Top-Quality Products!
        </Typography>
        <Link to={`/Products`} style={{ textDecoration: 'none' }}>
        <Button variant="contained" color="primary" href="/products" sx={{ padding: '10px 20px' }}>
          More Product
        </Button>
        </Link>
     
      </Box>
    </Container>
  );
};

export default AboutUs;
