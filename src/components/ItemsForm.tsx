import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ref, update, push, database } from '../firebase'; 

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  selectedItem: MenuItem | null;
  onSubmit: () => void; 
}

interface MenuItem {
  id?: string; 
  name: string;
  category: string;
  options?: string;
  price?: number; 
  cost?: number; 
  stock: number;
}

const useStyles = makeStyles({
  formContainer: {
    padding: '2rem',
  },
  formField: {
    marginBottom: '1.5rem',
  },
  errorText: {
    color: 'red',
  },
});

const ItemForm: React.FC<ItemFormProps> = ({
  open,
  onClose,
  selectedItem,
  onSubmit,
}) => {
  const classes = useStyles();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [options, setOptions] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [cost, setCost] = useState<number | undefined>(undefined); 
  const [stock, setStock] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name);
      setCategory(selectedItem.category);
      setOptions(selectedItem.options || '');
      setPrice(selectedItem.price); 
      setCost(selectedItem.cost); 
      setStock(selectedItem.stock);
    } else {
      resetForm();
    }
  }, [selectedItem]);

  const resetForm = () => {
    setName('');
    setCategory('');
    setOptions('');
    setPrice(undefined); 
    setCost(undefined);
    setStock(0);
    setValidationError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newItem: MenuItem = {
      name,
      category,
      options,
      price: price || 0, 
      cost: cost || 0, 
      stock,
    };

    if (selectedItem && selectedItem.id) {

      update(ref(database, `menu/${selectedItem.id}`), newItem)
        .then(() => {
          console.log('Item updated successfully');
          onSubmit(); 
          onClose(); 
        })
        .catch((error) => {
          console.error('Error updating item:', error);
        });
    } else {

      if (validatePriceCost()) {
        push(ref(database, 'menu'), newItem)
          .then(() => {
            console.log('Item saved successfully');
            onSubmit(); 
            onClose();
            resetForm(); 
          })
          .catch((error) => {
            console.error('Error saving item:', error);
          });
      } else {
        setValidationError('Price must be greater than Cost.');
      }
    }
  };

  const validatePriceCost = (): boolean => {
    if (price && cost && price <= cost) {
      return false;
    }
    return true;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{selectedItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={classes.formContainer}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                fullWidth
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Options"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                fullWidth
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Price"
                value={price === undefined ? '' : price.toString()}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
                fullWidth
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Cost"
                value={cost === undefined ? '' : cost.toString()}
                onChange={(e) => setCost(parseFloat(e.target.value))}
                required
                fullWidth
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12}>
              {validationError && (
                <Typography className={classes.errorText}>
                  {validationError}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Stock"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value, 10))}
                required
                fullWidth
                className={classes.formField}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {selectedItem ? 'Update Item' : 'Add Item'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ItemForm;
