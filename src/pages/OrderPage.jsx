import React, { useEffect, useState } from "react";
import { Title } from "../components/Title";
import {
  Alert,
  AlertTitle,
  Box,
  Select,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import SearchIcon from '@mui/icons-material/Search';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import format from "date-fns/format";
import AddCircleIcon from '@mui/icons-material/AddCircle';

import axios from "axios";

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [head, setHead] = useState('');
  const [total, setTotal] = useState(0);
  const [viewAddOrderModal, setViewAddOrderModal] = useState(false);
  const [searchItem, setSearchItem] = useState('');
  const [openModalStatus, setOpenModalStatus] = useState(false);
  const [selectedState, setSelectedState] = useState('');

  const [products, setProducts] = useState([]);
  const [newcart, setCart] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/orders')
      .then((res) => { setOrders(res.data) })
  }, [orders])

  useEffect(() => {
    axios
      .get('http://localhost:8080/products')
      .then((res) => { setProducts(res.data) })
  }, [products])

  useEffect(() => {
    const calculateTotal = () => {
      const newTotal = newcart.reduce((accumulator, item) => {
        const subtotal = item.price * item.quantity;
        return accumulator + subtotal;
      }, 0);
      setTotal(newTotal);

    };

    calculateTotal();
  }, [newcart]);

  const handleViewItems = (data, head, total) => {
    setViewModal(true);
    setItems(data);
    setHead(head);
    setTotal(total);
  }

  const handleCloseViewModal = () => {
    setViewModal(false);
    setHead('');
    setItems([]);
    setTotal(0);
  }

  const handleNewOrder = () => {
    setViewAddOrderModal(true);
  }

  const handleAddToCart = (item) => {
    const itemId = item.id;
    const itemAlreadyInCart = newcart.some((cartItem) => cartItem.id === itemId);

    if (!itemAlreadyInCart) {
      const updatedItem = { ...item, quantity: 1 };
      const updatedCart = [...newcart, updatedItem];
      setCart(updatedCart);
    }
  };

  const handleAddToCartModalCancel = () => {
    setViewAddOrderModal(false);
    setCart([]);
    setTotal(0);
  }

  const handleAddOrderConfirm = () => {
    const filteredCart = newcart.map(({ name, price, stock, ...rest }) => rest);
    const cart = filteredCart.map(e => ({
      second: e.id,
      first: e.quantity,
    }));

    axios
      .post('http://localhost:8080/orders', { price: total, cart })
      .then(() => { alert('Order stored!') })
      .catch((err) => { alert('Error', err) });

    setTotal(0);
    setCart([]);

    setViewAddOrderModal(false);
  }

  const handleDeleteOrder = (id) => {
    axios.delete(`http://localhost:8080/orders/${id}`)
      .then(() => { alert('Order deleted') })
      .catch((err) => { alert('Error in delete!', err) });
  }



  const renderButton = (status, id) => {
    switch (status) {
      case "P":
        return (
          <Button onClick={() => handleChangeStatus(status, id)} variant="contained" color='error'>
            Pendient
          </Button>
        );
      case "I":
        return (
          <Button onClick={() => handleChangeStatus(status, id)} variant="contained" color='warning'>
            In Progress
          </Button>
        );
      case "C":
        return (
          <Button onClick={() => handleChangeStatus(status, id)} variant="contained" color='success'>
            Completed
          </Button>
        );
      default:
        return null;
    }
  };

  const handleCloseModalStatus = () => {
    setOpenModalStatus(false);
  }

  const handleChangeStatus = (status, id) => {
    if (status == 'C') {
      alert("COMPLETED Orders can not be changued!");
      return;
    }
    setHead(id);
    setOpenModalStatus(true);
  }

  const handleUpModalClose = () => {
    setOpenModalStatus(false);
    setSelectedState('');
    setHead('');
  }

  const handleUpModalConfirm = () => {
    axios.put(`http://localhost:8080/orders/status/${head}`, {newState: selectedState} )
      .then(() => {alert('Updated!')})
      .catch((err) => {alert('Error in', err)})
  }

  return (
    <>
      <Title prop={'My Orders'} />
      <Button
        variant={'contained'}
        color={'success'}
        fontWeight={'bold'}
        startIcon={<AddCircleIcon />}
        onClick={handleNewOrder}
      > <strong> ORDER NOW </strong>
      </Button>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell> <Button variant={'outlined'} startIcon={<FormatListNumberedIcon />}> <strong> ORDER </strong> </Button> </TableCell>
              <TableCell> <Button variant={'outlined'} startIcon={<DateRangeIcon />}> <strong> DATE </strong> </Button> </TableCell>
              <TableCell> <Button variant={'outlined'} startIcon={<PriceCheckIcon />}> <strong> PRICE FINAL </strong> </Button> </TableCell>
              <TableCell> <Button variant={'outlined'} startIcon={<DownloadDoneIcon />} > <strong> STATUS </strong> </Button> </TableCell>
              <TableCell> <Button variant={'contained'} color={'primary'} startIcon={<AutoFixNormalIcon />}> <strong> ACTION </strong> </Button> </TableCell>
            </TableRow>
            {
              orders.map((e) => (
                <TableRow key={e.id}>
                  <TableCell> {`0000${e.order}`} </TableCell>
                  <TableCell> {format(new Date(e.modifiedAt), 'yyyy-MM-dd HH:mm:ss')} </TableCell>
                  <TableCell> {e.priceFinal} </TableCell>
                  <TableCell> {renderButton(e.status, e.id)} </TableCell>
                  <TableCell>
                    <Button variant={'contained'} sx={{ marginRight: '3px' }} color={'error'} onClick={() => handleDeleteOrder(e.id)} ><DeleteIcon /></Button>
                    <Button variant={'contained'} sx={{ marginRight: '3px' }} color={'warning'} ><ModeEditOutlineIcon /></Button>
                    <Button variant={'contained'} sx={{ marginRight: '3px' }} color={'success'} onClick={() => { handleViewItems(e.products, e.id, e.priceFinal) }}><RemoveRedEyeIcon /></Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={viewModal} onClose={handleCloseViewModal}>
        <DialogTitle> <Typography fontWeight={'bold'}> View of ORDER: </Typography> {head} </DialogTitle>
        <DialogTitle> <Typography fontWeight={'bold'}> TOTAL: </Typography> {total} </DialogTitle>
        <DialogContent>
          <DialogContentText>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell> <Button variant={'outlined'} startIcon={<FormatBoldIcon />}> <strong> NAME </strong> </Button> </TableCell>
                    <TableCell> <Button variant={'outlined'} startIcon={<AttachMoneyIcon />}> <strong> QUANTITY </strong> </Button> </TableCell>
                    <TableCell> <Button variant={'outlined'} startIcon={<InventoryIcon />}> <strong> SUBTOTAL </strong> </Button> </TableCell>
                  </TableRow>
                  {
                    items.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell > {e.second.name} </TableCell>
                        <TableCell> {`x${e.first}`} </TableCell>
                        <TableCell> {e.second.price * e.first} </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant={'contained'} onClick={handleCloseViewModal} color='error'>
            <Typography fontWeight={'bold'}> CLOSE </Typography>
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewAddOrderModal} onClose={handleCloseViewModal}>
        <DialogTitle> <Typography fontWeight={'bold'}> Add New Order </Typography> </DialogTitle>
        <DialogTitle> <Typography fontWeight={'bold'}> TOTAL: </Typography> {total} </DialogTitle>

        <Container margin={10}>
          <FormControl>
            <Stack spacing={4} direction={'row'}>
              <TextField
                label="Search by Name"
                variant="outlined"
                color={'info'}
                type="text"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </FormControl>
        </Container>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Button variant={'outlined'} startIcon={<FormatBoldIcon />}>
                    <strong> NAME </strong>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant={'outlined'} startIcon={<AttachMoneyIcon />}>
                    <strong> PRICE </strong>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant={'outlined'} startIcon={<InventoryIcon />}>
                    <strong> STOCK </strong>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant={'contained'}
                    color={'primary'}
                  > <strong> ACTION </strong>
                  </Button>
                </TableCell>
              </TableRow>
              {products
                .filter((product) =>
                  product.name.toLowerCase().includes(searchItem.toLowerCase())
                )
                .map((e) => (
                  <TableRow key={e.id}>
                    <TableCell> {e.name} </TableCell>
                    <TableCell> {e.price} </TableCell>
                    <TableCell> {e.stock} </TableCell>
                    <TableCell>
                      <Button
                        variant={'contained'}
                        sx={{ marginRight: '3px' }}
                        color={'success'}
                        onClick={() => handleAddToCart(e)}
                      >
                        <AddCircleIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <DialogContent>
          <DialogContentText>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Button variant={'outlined'} startIcon={<FormatBoldIcon />}>
                        <strong> NAME </strong>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant={'outlined'} startIcon={<AttachMoneyIcon />}>
                        <strong> QUANTITY </strong>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant={'outlined'} startIcon={<InventoryIcon />}>
                        <strong> SUBTOTAL </strong>
                      </Button>
                    </TableCell>
                  </TableRow>
                  {newcart.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.name}</TableCell>
                      <TableCell>
                        <TextField
                          required
                          type="number"
                          inputProps={{
                            min: 0,
                          }}
                          value={e.quantity || 1}
                          onChange={(event) => {
                            const quantity = parseInt(event.target.value);
                            const updatedCart = newcart.map((item) =>
                              item.id === e.id ? { ...item, quantity } : item
                            );
                            setCart(updatedCart);
                          }}
                        />
                      </TableCell>
                      <TableCell>{e.price * (e.quantity || 1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant={'contained'} onClick={handleAddToCartModalCancel} color='error'>
            <Typography fontWeight={'bold'}> CANCEL </Typography>
          </Button>
          <Button variant={'contained'} onClick={handleAddOrderConfirm} color='success'>
            <Typography fontWeight={'bold'}> SAVE </Typography>
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModalStatus} onClose={handleCloseModalStatus} maxWidth>
        <DialogTitle> <Typography fontWeight={'bold'}> Changue Status </Typography></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a New State
          </DialogContentText>
          <Container margin={5}>
            <FormControl>
              <Select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                <MenuItem value='P'> PENDIENT </MenuItem>
                <MenuItem value='I'> IN PROGRESS </MenuItem>
                <MenuItem value='C'> COMPLETE </MenuItem>
              </Select>
            </FormControl>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button variant={'contained'} onClick={handleUpModalConfirm} color='success'>
            <Typography fontWeight={'bold'}> SAVE </Typography>
          </Button>
          <Button variant={'contained'} onClick={handleUpModalClose} color='warning'>
            <Typography fontWeight={'bold'}> CANCEL </Typography>
          </Button>
        </DialogActions>  
      </Dialog>
    </>
  )
}