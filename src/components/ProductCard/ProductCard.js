import React from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { addItemToCart } from '../../redux/features/cart/cartSlice'; // Import addItemToCart action
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleAddToCart = () => {
    dispatch(addItemToCart(product)); // Dispatch addItemToCart with the product
  };

  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="h6" color="text.primary">
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">View Details</Button>
        <Button size="small" onClick={handleAddToCart}>Add to Cart</Button> {/* Add onClick handler */}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
