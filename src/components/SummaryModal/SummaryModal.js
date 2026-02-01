import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const DELIVERY_FEE = 5.00;
const BASE_FEE = 1.50;

const SummaryModal = ({ open, handleClose, totalAmount }) => {
  const grandTotal = totalAmount + DELIVERY_FEE + BASE_FEE;

  const handleConfirmPayment = () => {
    // TODO: Implement actual payment processing logic
    console.log('Payment Confirmed!');
    handleClose(); // Close the summary modal
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="summary-modal-title"
      aria-describedby="summary-modal-description"
    >
      <Box sx={style}>
        <Typography id="summary-modal-title" variant="h6" component="h2">
          Payment Summary
        </Typography>
        <List sx={{ mt: 2 }}>
          <ListItem disableGutters>
            <ListItemText primary="Products Total" />
            <Typography variant="body1">${totalAmount.toFixed(2)}</Typography>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary="Delivery Fee" />
            <Typography variant="body1">${DELIVERY_FEE.toFixed(2)}</Typography>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary="Base Fee" />
            <Typography variant="body1">${BASE_FEE.toFixed(2)}</Typography>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem disableGutters>
            <Typography variant="h6">Grand Total</Typography>
            <Typography variant="h6">${grandTotal.toFixed(2)}</Typography>
          </ListItem>
        </List>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleConfirmPayment}
        >
          Confirm Payment
        </Button>
      </Box>
    </Modal>
  );
};



export default SummaryModal;
