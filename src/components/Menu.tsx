import React, { useState, useEffect } from 'react';
import { ref, onValue, off, database, remove } from '../firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ItemForm from './ItemsForm';
import DeleteConfirmation from './DeleteConfirmation';

interface MenuProps {}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  options?: string;
  price?: number;
  cost?: number;
  stock: number;
}

const useStyles = makeStyles({
  sortIndicator: {
    display: 'inline-block',
    marginLeft: '0.5rem',
    color: 'black',
  },
  buttonLabel: {
    color: 'black !important',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

const Menu: React.FC<MenuProps> = () => {
  const classes = useStyles();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [openItemForm, setOpenItemForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string>('');

  const [sortConfig, setSortConfig] = useState<{
    key: keyof MenuItem;
    direction: 'ascending' | 'descending' | null;
  }>({
    key: 'name',
    direction: null,
  });

  useEffect(() => {
    const menuRef = ref(database, 'menu');
    const unsubscribe = onValue(menuRef, (snapshot) => {
      const items = snapshot.val();
      if (items) {
        const menuList: MenuItem[] = Object.keys(items).map((key) => ({
          id: key,
          ...items[key],
        }));
        setMenuItems(
          menuList.map((item) => ({
            ...item,
            price: item.price || 0,
            cost: item.cost || 0,
          }))
        );
      }
    });

    return () => {
      off(menuRef, 'value', unsubscribe);
    };
  }, []);

  const handleDelete = (itemId: string) => {
    setDeletingItemId(itemId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = () => {
    remove(ref(database, `menu/${deletingItemId}`));
    setDeleteConfirmationOpen(false);
  };

  const handleOpenItemForm = () => {
    setOpenItemForm(true);
    setSelectedItem(null);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setOpenItemForm(true);
  };

  const handleCloseItemForm = () => {
    setOpenItemForm(false);
    setSelectedItem(null);
  };

  const handleFormSubmit = () => {
    fetchMenuItems();
  };

  const fetchMenuItems = () => {
    const menuRef = ref(database, 'menu');
    onValue(menuRef, (snapshot) => {
      const items = snapshot.val();
      if (items) {
        const menuList: MenuItem[] = Object.keys(items).map((key) => ({
          id: key,
          ...items[key],
        }));
        setMenuItems(
          menuList.map((item) => ({
            ...item,
            price: item.price || 0,
            cost: item.cost || 0,
          }))
        );
      }
    });
  };

  const sortByField = (key: keyof MenuItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedItems = [...menuItems].sort((a, b) => {
      if (direction === 'ascending') {
        if (key === 'name' || key === 'category' || key === 'options') {
          return (a[key] || '').localeCompare(b[key] || '');
        } else {
          return (Number(a[key]) || 0) - (Number(b[key]) || 0);
        }
      } else {
        if (key === 'name' || key === 'category' || key === 'options') {
          return (b[key] || '').localeCompare(a[key] || '');
        } else {
          return (Number(b[key]) || 0) - (Number(a[key]) || 0);
        }
      }
    });
    setMenuItems(sortedItems);
  };

  const getSortIndicator = (key: keyof MenuItem) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '';
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Menu</h2>
      <Grid container justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenItemForm}
          style={{
            marginBottom: '1rem',
            backgroundColor: '#4caf50',
            color: '#ffffff',
          }}
        >
          Add New Item
        </Button>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Button
                  onClick={() => sortByField('name')}
                  className={classes.buttonLabel}
                >
                  Name
                  <span className={classes.sortIndicator}>
                    {getSortIndicator('name')}
                  </span>
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => sortByField('category')}
                  className={classes.buttonLabel}
                >
                  Category
                  <span className={classes.sortIndicator}>
                    {getSortIndicator('category')}
                  </span>
                </Button>
              </TableCell>
              <TableCell>Options</TableCell>
              <TableCell>
                <Button
                  onClick={() => sortByField('price')}
                  className={classes.buttonLabel}
                >
                  Price ($)
                  <span className={classes.sortIndicator}>
                    {getSortIndicator('price')}
                  </span>
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => sortByField('cost')}
                  className={classes.buttonLabel}
                >
                  Cost ($)
                  <span className={classes.sortIndicator}>
                    {getSortIndicator('cost')}
                  </span>
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => sortByField('stock')}
                  className={classes.buttonLabel}
                >
                  Stock
                  <span className={classes.sortIndicator}>
                    {getSortIndicator('stock')}
                  </span>
                </Button>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.options || '-'}</TableCell>
                <TableCell>${(item.price || 0).toFixed(2)}</TableCell>
                <TableCell>${(item.cost || 0).toFixed(2)}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditItem(item)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(item.id)}
                    style={{
                      color: '#ffffff',
                      backgroundColor: '#f44336',
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ItemForm
        open={openItemForm}
        onClose={handleCloseItemForm}
        selectedItem={selectedItem}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmation
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default Menu;
