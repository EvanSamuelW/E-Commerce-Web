import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import react-router
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { ShoppingBag } from '@mui/icons-material';
import Products from './components/Products';
import Carts from './components/Carts';
import Login from './components/Login';
import AboutUs from './components/AboutUs';
import ProductDetail from './components/ProductDetail';
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import {theme} from './utils/theme';

const pages = [
  {
    Display: 'About Us',
    url: 'aboutus',
  },
  {
    Display: 'Products',
    url: 'products',
  },
  {
    Display: 'Carts',
    url: 'carts',
  },
];

const settings = ['Profile', 'Wishlist', 'Dashboard', 'Logout'];

function App() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  React.useEffect(() => {
    const token = localStorage.getItem('authToken'); // You could also use sessionStorage
    if (token) {
      setIsAuthenticated(true); // If token exists, user is authenticated
    }
  }, []);


  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
      setIsAuthenticated(true); // Update the authentication state
    } catch (error) {
      console.error('Login error:', error);
    }
  };


  const login = async (username: string, password: string): Promise<void> => {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: username,  // Ensure that you're sending the right keys (e.g., 'email' instead of 'username')
        password: password,
      }),
    });
  
    // Check if response is not OK (i.e., 401 Unauthorized)
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Login failed');
    }
  
    const data = await response.json();
  
    // Save the token in localStorage or sessionStorage
    localStorage.setItem('authToken', data.token); // Save the token for future requests
  
    console.log('Login successful:', data.token);
  };
  

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    setIsAuthenticated(false); // Update authentication state
  };


  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
      {isAuthenticated ? (
          <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                <ShoppingBag sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  E-COMMERCE
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                  >
                    {pages.map((page) => (
                      <Link to={`/${page.url.toLowerCase()}`} key={page.url}>
                        <MenuItem onClick={handleCloseNavMenu}>
                          <Typography sx={{ textAlign: 'center' }}>{page.Display}</Typography>
                        </MenuItem>
                      </Link>
                    ))}
                  </Menu>
                </Box>

                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  E-Commerce
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {pages.map((page) => (
                    <Button
                      key={page.url}
                      onClick={handleCloseNavMenu}
                      sx={{
                        my: 2,
                        color: 'white',
                        display: 'block',
                        '&:hover': {
                          fontWeight: 700,
                        },
                      }}
                    >
                      <Link
                        to={`/${page.url.toLowerCase()}`}
                        style={{ textDecoration: 'none', color: 'white' }}
                      >
                        {page.Display}
                      </Link>
                    </Button>
                  ))}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="Budi Sharp" src="/static/images/avatar/2.jpg" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Link to={'/login'} style={{ textDecoration: 'none' }}>
                          <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                        </Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        ) : (
          <Login onLogin={handleLogin} />
        )}

        <Routes>
        <Route path="/" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/carts" element={<Carts />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/ProductDetail" element={<ProductDetail />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
