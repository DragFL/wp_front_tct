
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, Delete } from '@mui/icons-material';
import { addItemToCart, removeItemFromCart, updateItemQuantity } from '../../redux/features/cart/cartSlice';

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
};

const CartModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);

  const handleAddItem = (item) => {
    dispatch(addItemToCart(item));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCart(id));
  };
  
  const handleDeleteItem = (id) => {
    dispatch(updateItemQuantity({ id, quantity: 0 }));
  };

  const handleCheckout = () => {
    handleClose(); // Close the cart modal
    // TODO: Open Credit Card/Delivery Info Modal
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="cart-modal-title"
      aria-describedby="cart-modal-description"
    >
      <Box sx={style}>
        <Typography id="cart-modal-title" variant="h6" component="h2">
          Shopping Cart
        </Typography>
        {items.length === 0 ? (
          <Typography id="cart-modal-description" sx={{ mt: 2 }}>
            Your cart is empty.
          </Typography>
        ) : (
          <>
            <List>
              {items.map((item) => (
                <ListItem key={item.id} secondaryAction={
                  <IconButton edge="end" aria-label="delete item" onClick={() => handleDeleteItem(item.id)}>
                    <Delete />
                  </IconButton>
                }>
                  <ListItemText
                    primary={item.name}
                    secondary={`$${item.price.toFixed(2)} x ${item.quantity}`}
                  />
                  <IconButton aria-label="remove one item" onClick={() => handleRemoveItem(item.id)}>
                    <RemoveCircleOutline />
                  </IconButton>
                  <IconButton aria-label="add one item" onClick={() => handleAddItem(item)}>
                    <AddCircleOutline />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${totalAmount.toFixed(2)}
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CartModal;
