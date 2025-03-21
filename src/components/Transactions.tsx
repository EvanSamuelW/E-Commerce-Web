import React, { useState, useEffect } from 'react';
import TransactionItem from './TransactionItem';
import { Button, Typography, Container, Box, Grid, Snackbar, SnackbarOrigin } from '@mui/material';

interface State extends SnackbarOrigin {
  open: boolean;
}

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const [transactions, setTransactions] = useState<any[]>([]);  // Use any[] if the structure of the items can be dynamic, otherwise define a proper type
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal, open } = state;
  const [snackBarMesage, setSnakBarMessage] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch('http://localhost:8080/api/transactions/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to fetch carts');
        }

        const data = await response.json();
        console.log(data);
        setTransactions(data);  // Assuming the data structure contains individual cart items directly.
      } catch (err) {
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);


  const handleClick = (newState: SnackbarOrigin, message: string) => () => {
    setState({ ...newState, open: true });
    setSnakBarMessage(message);
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
      Transaction History
      </Typography>
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : error ? (
        <Typography variant="h6">{error}</Typography>
      ) : transactions.length === 0 ? (
        <Typography variant="h6">Your Transaction is empty.</Typography>
      ) : (
        <Box>
          <Box sx={{ marginBottom: 4 }}>
            {transactions.map((item) => (
              <TransactionItem
                key={item.cartItemId}
                item={item}
              />
            ))}
          </Box>

          {/* Snackbar to show success/error messages */}
          {/* <Box sx={{ width: 500 }}>
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={open}
              onClose={handleClose}
              message={snackBarMesage}
              autoHideDuration={3000}
              key={vertical + horizontal}
            />
          </Box> */}
        </Box>
      )}

    </Container>
  );
};

export default Transactions;
