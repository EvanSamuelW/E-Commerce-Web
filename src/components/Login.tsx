import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';


interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError('email and password are required');
      return;
    }

    try {
      await onLogin(email, password); // Call the onLogin prop passed to Login component
    } catch (error) {
      setError('Login failed, please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 2,
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Login
        </Typography>

        {/* Error message */}
        {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Email field */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          {/* Password field */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          {/* Submit button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: '10px 0' }}
          >
            Login
          </Button>

          <a href="">Not registered? Sign Up!</a>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
