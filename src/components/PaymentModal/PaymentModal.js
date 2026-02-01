import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const PaymentModal = ({ open, handleClose, handlePaymentSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    cardHolderName: '',
    identificationType: '',
    identificationNumber: '',
    installments: '1',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    
    if (!formData.email.trim()) {
        newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Email is not valid.';
    }
    
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile Number is required.';
    
    if (!formData.cardHolderName.trim()) newErrors.cardHolderName = 'Card Holder Name is required.';

    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card Number is required.';
    } else if (!/^[0-9]{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'Card Number must be 16 digits.';
    }
    
    if (!formData.expirationDate.trim()) {
      newErrors.expirationDate = 'Expiration Date is required.';
    } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.expirationDate)) {
      newErrors.expirationDate = 'Expiration Date must be in MM/YY format.';
    }
    
    if (!formData.cvc) {
      newErrors.cvc = 'CVC is required.';
    } else if (!/^[0-9]{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = 'CVC must be 3 or 4 digits.';
    }

    if (!formData.identificationType) newErrors.identificationType = 'Identification Type is required.';
    
    if (!formData.identificationNumber.trim()) newErrors.identificationNumber = 'Identification Number is required.';

    if (parseInt(formData.installments, 10) < 1) newErrors.installments = 'Number of Payments must be at least 1.';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let sanitizedValue = value;
    if (name === 'mobileNumber' || name === 'identificationNumber') {
      sanitizedValue = value.replace(/\D/g, '');
    } else if (name === 'cardNumber' ) {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'cvc'){
        sanitizedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'fullName' || name === 'cardHolderName') {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));

    if (errors[name]) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // On successful validation, clear errors
    setErrors({});
    console.log('Payment data:', formData);
    handlePaymentSubmit(); // Use the new handler
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
      <Box sx={style}>
        <Typography id="payment-modal-title" variant="h6" component="h2">
          Credit Card and Delivery Information
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid gridColumn="span 12">
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>
            <Grid gridColumn="span 6">
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid gridColumn="span 6">
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                required
              />
            </Grid>
            <Grid gridColumn="span 12">
              <TextField
                fullWidth
                label="Card Holder Name"
                name="cardHolderName"
                value={formData.cardHolderName}
                onChange={handleChange}
                error={!!errors.cardHolderName}
                helperText={errors.cardHolderName}
                required
              />
            </Grid>
            <Grid gridColumn="span 12">
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                required
              />
            </Grid>
            <Grid gridColumn="span 6">
              <TextField
                fullWidth
                label="Expiration Date (MM/YY)"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                error={!!errors.expirationDate}
                helperText={errors.expirationDate}
                required
              />
            </Grid>
            <Grid gridColumn="span 6">
              <TextField
                fullWidth
                label="CVC"
                name="cvc"
                value={formData.cvc}
                onChange={handleChange}
                error={!!errors.cvc}
                helperText={errors.cvc}
                required
              />
            </Grid>
            <Grid gridColumn="span 6">
              <FormControl fullWidth required error={!!errors.identificationType}>
                <InputLabel id="identification-type-label">Identification Type</InputLabel>
                <Select
                  labelId="identification-type-label"
                  id="identification-type"
                  name="identificationType"
                  value={formData.identificationType}
                  label="Identification Type"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                  <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                </Select>
                {errors.identificationType && <FormHelperText>{errors.identificationType}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid gridColumn="span 6">
              <TextField
                fullWidth
                label="Identification Number"
                name="identificationNumber"
                value={formData.identificationNumber}
                onChange={handleChange}
                error={!!errors.identificationNumber}
                helperText={errors.identificationNumber}
                required
              />
            </Grid>
            <Grid gridColumn="span 6">
              <TextField
                fullWidth
                label="Number of Payments"
                name="installments"
                type="number"
                value={formData.installments}
                onChange={handleChange}
                error={!!errors.installments}
                helperText={errors.installments}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid gridColumn="span 12">
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Submit Payment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default PaymentModal;

