import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, TextField, Slider, Chip } from '@mui/material';
import { Link } from 'react-router-dom'; // Import react-router
import { Product } from '../utils/product';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]); // Initial range is from $0 to $1000
  const [products, setProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Added state to track the selected category

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleCategoryClick = (category: string) => {
    // Toggle category selection
    if (selectedCategory === category) {
      setSelectedCategory(null); // If category is already selected, deselect it
    } else {
      setSelectedCategory(category); // Select the clicked category
    }
  };

  useEffect(() => {
    // Fetch data from the API when the component is mounted
    const fetchProducts = async () => {
      setLoading(true); // Set loading to true
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch('http://localhost:8080/api/products?page=0&size=10', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Include the token in Authorization header
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to fetch protected data');
        }

        const data = await response.json();

        setProducts(data.content); // Set the products data from the API response
      } catch (err) {
        setError('Failed to load products'); // Set error message if API call fails
      } finally {
        setLoading(false); // Set loading to false after the request is completed
      }
    };

    const fetchProductCategories = async () => {
      setLoading(true); // Set loading to true
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch('http://localhost:8080/api/products/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Include the token in Authorization header
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to fetch protected data');
        }

        const data = await response.json();

        setProductCategories(data);
      } catch (err) {
        setError('Failed to load product categories'); // Set error message if API call fails
      } finally {
        setLoading(false); // Set loading to false after the request is completed
      }
    };

    fetchProducts(); // Call the function to fetch products
    fetchProductCategories(); // Fetch categories as well
  }, []); // Empty dependency array means this useEffect will run once on mount

  // Filter products based on search query, price range, and selected category
  const filteredProducts = products.filter((product) => {
    const price = product.price;
    const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriceRange = price >= priceRange[0] && price <= priceRange[1];
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true; // Filter by selected category

    return matchesSearchQuery && matchesPriceRange && matchesCategory;
  });

  return (
    <div>
      <Container sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }} align="center">
          Products
        </Typography>

        {/* Search and Price Range Slider */}
        <Box sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Search Products"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ maxWidth: 400, mb: 2 }}
            />
            {/* Display Categories as Chips */}
            {productCategories.map((item) => (
              <Chip
                key={item.id}
                sx={{ ml: 1, cursor: 'pointer', backgroundColor: selectedCategory === item.name ? '#1a73e8' : '#e0e0e0' }}
                label={item.name}
                onClick={() => handleCategoryClick(item.name)} // Add click handler for categories
              />
            ))}
          </Grid>

          {/* Price Range Slider */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value}`}
              min={0}
              max={1000}
              step={10}
              sx={{ mb: 4 }}
            />
          </Grid>
        </Box>

        {/* Product Cards Grid */}
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:8080${product.image}`}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', height: 80, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {product.name}
                  </Typography>
                  {/* Updated price display with differentiated styling */}
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      mb: 2,
                      fontWeight: 'bold',
                      fontSize: '1.1rem', // Increased font size for price
                      color: '#1a73e8', // Highlight color for price (blue)
                    }}
                  >
                    ${product.price}
                  </Typography>

                  <Link to={`/ProductDetail/${product.id}`}>
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
    </div>
  );
};

export default Products;
