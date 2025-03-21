import * as React from 'react';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Login from './components/Login';
import AboutUs from './components/AboutUs';
import Products from './components/Products';
import Carts from './components/Carts';
import ProductDetail from './components/ProductDetail';
import Wishlists from './components/Wishlist';
import Transactions from './components/Transactions';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './utils/theme';

const pages = [
  { Display: 'About Us', url: 'aboutus' },
  { Display: 'Products', url: 'products' },
  { Display: 'Carts', url: 'carts' }
];

const settings = ['Profile', 'Wishlist', 'Transactions', 'Logout'];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainComponent />
      </Router>
    </ThemeProvider>
  );
}

function MainComponent() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/login');  // Otherwise, redirect to Login page
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
      setIsAuthenticated(true);
      setErrorMessage('');
      navigate('/aboutus');  // After successful login, redirect to About Us page
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password: password }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
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

  // Handle the settings menu item click
  const handleSettingsClick = (setting: string) => {
    if (setting === 'Wishlist') {
      navigate('/wishlists');  // Navigate to Wishlist page
    } else if (setting === 'Logout') {
      handleLogout();
    } else if (setting === 'Transactions')
    navigate('/transactions')
  };

  return (
    <div>
      {isAuthenticated ? (
        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <ShoppingBag sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography variant="h6" noWrap component="a" href="#" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none' }}>
                E-COMMERCE
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
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

              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button key={page.url} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block', '&:hover': { fontWeight: 700 } }}>
                    <Link to={`/${page.url.toLowerCase()}`} style={{ textDecoration: 'none', color: 'white' }}>
                      {page.Display}
                    </Link>
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => handleSettingsClick(setting)}>
                      <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      ) : (
        <div></div>
      )}

      <Routes>
        <Route path="/" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/carts" element={<Carts />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/ProductDetail/:productId" element={<ProductDetail />} />
        <Route path="/Wishlists" element={<Wishlists />} />
        <Route path="/Transactions" element={<Transactions />} />
      </Routes>
    </div>
  );
}

export default App;
