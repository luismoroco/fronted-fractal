import React, { useEffect, useState } from "react";
import { Title } from "../components/Title";
import {
  Alert,
  AlertTitle,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputAdornment,
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
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from "axios";

export const ProductsPages = () => {
  const [productsList, setProductLists] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSuccessAlert, setOpenSucessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [idForDelete, setIdForDelete] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [product, setProduct] = useState({
    name: null,
    price: null,
    stock: null
  });

  const clearBuff = () => {
    setProduct({
      name: null,
      price: null,
      stock: null
    });
  }

  useEffect(() => {
    axios
      .get('http://localhost:8080/products')
      .then((res) => { setProductLists(res.data) })
  }, [productsList])

  const handleFormSubmit = () => {
    if (!product.name || !product.price || !product.stock) {
      setOpenErrorAlert(true);
      return;
    }

    axios
      .post('http://localhost:8080/products', product)
      .then(() => alert('Saved!'))
      .catch((err) => { console.log(err) });

    clearBuff();
  }

  const handleDelete = (id) => {
    setIdForDelete(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (idForDelete != '') {
      axios
        .delete(`http://localhost:8080/products/${idForDelete}`)
        .then(setOpenSucessAlert(true))
        .catch((err) => alert('Error al borrar!', err));
    }

    setOpenDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setIdForDelete('');
    setOpenDeleteModal(false);
  };

  const handleCloseSuccessAlert = () => {
    setOpenSucessAlert(false);
  };

  const handleOpenErrorAlert = () => {
    setOpenErrorAlert(false);
  }

  const handleEditConfirm = () => {
    axios
      .put(`http://localhost:8080/products/${idForDelete}`, product)
      .then(alert('Edited!'))
      .catch((err) => alert('Error in Edit', err));

    setOpenEdit(false);
    clearBuff();
  }

  const handleEditCancel = () => {
    setOpenEdit(false);
    clearBuff();
    setIdForDelete('');
  }

  const handleEdit = (e) => {
    setOpenEdit(true);
    setIdForDelete(e.id);
    setProduct({
      name: e.name,
      price: e.price,
      stock: e.stock
    });
  }

  return (
    <>
      <Title prop={'Products'} />
      <Container margin={10}>
        <Typography
          variant={'h4'}
          fontWeight={'bold'}
          margin={1}
        > <Button
          variant={'outlined'}
          color={'success'}
        > <strong> Add Item </strong> </Button> </Typography>
        <FormControl>
          <Stack spacing={4} direction={'row'}>
            <TextField
              label='Name'
              variant='outlined'
              type='word'
              value={product.name}
              required={true}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'> <FormatBoldIcon /> </InputAdornment>
              }}
            />
            <TextField
              label='Price'
              variant='outlined'
              type='number'
              value={product.price}
              required={true}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'> <AttachMoneyIcon /> </InputAdornment>
              }}
            />
            <TextField
              label='Stock'
              variant='outlined'
              type='number'
              required={true}
              value={product.stock}
              onChange={(e) => setProduct({ ...product, stock: e.target.value })}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'> <InventoryIcon /> </InputAdornment>
              }}
            />
            <Button variant={'contained'} color={'success'} type={'submit'} onClick={handleFormSubmit}><AddCircleOutlineIcon /></Button>
          </Stack>
        </FormControl>
      </Container>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell> <Button variant={'outlined'} startIcon={<FormatBoldIcon />}> <strong> NAME </strong> </Button> </TableCell>
              <TableCell> <Button variant={'outlined'} startIcon={<AttachMoneyIcon />}> <strong> PRICE </strong> </Button> </TableCell>
              <TableCell> <Button variant={'outlined'} startIcon={<InventoryIcon />}> <strong> STOCK </strong> </Button> </TableCell>
              <TableCell> <Button variant={'contained'} color={'primary'} startIcon={<AutoFixNormalIcon />}> <strong> ACTION </strong> </Button> </TableCell>
            </TableRow>
            {
              productsList.map((e) => (
                <TableRow key={e.id}>
                  <TableCell > {e.name} </TableCell>
                  <TableCell> {e.price} </TableCell>
                  <TableCell> {e.stock} </TableCell>
                  <TableCell>
                    <Button variant={'contained'} sx={{ marginRight: '3px' }} color={'error'} onClick={() => handleDelete(e.id)}><DeleteIcon /></Button>
                    <Button variant={'contained'} sx={{ marginRight: '3px' }} color={'warning'} onClick={() => handleEdit(e)}><ModeEditOutlineIcon /></Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteModal} onClose={handleDeleteCancel}>
        <DialogTitle> <Typography fontWeight={'bold'}> Delete Product </Typography></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant={'contained'} onClick={handleDeleteConfirm} color='error'>
            <Typography fontWeight={'bold'}> Yes </Typography>
          </Button>
          <Button variant={'contained'} onClick={handleDeleteCancel} color='warning'>
            <Typography fontWeight={'bold'}> No </Typography>
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSuccessAlert}
        autoHideDuration={3000}
        onClose={handleCloseSuccessAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSuccessAlert} severity="success">
          Successfully Deleted!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openErrorAlert}
        autoHideDuration={3000}
        onClose={handleOpenErrorAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleOpenErrorAlert} severity={'error'} >
          Input all fields!
        </Alert>
      </Snackbar>

      <Dialog open={openEdit} onClose={handleDeleteCancel}>
        <DialogTitle margin={2}> <Typography fontWeight={'bold'}>  Editing: </Typography> {product.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <Container margin={5}>
            <FormControl>
              <Stack spacing={2} direction={'column'}>
                <TextField
                  variant='outlined'
                  type='word'
                  value={product.name}
                  disabled={true}
                  InputProps={{
                    startAdornment:
                      <InputAdornment position='start'> <FormatBoldIcon /> </InputAdornment>
                  }}
                />
                <TextField
                  label='Price'
                  variant='outlined'
                  type='number'
                  value={product.price}
                  required={true}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                  InputProps={{
                    startAdornment:
                      <InputAdornment position='start'> <AttachMoneyIcon /> </InputAdornment>
                  }}
                />
                <TextField
                  label='Stock'
                  variant='outlined'
                  type='number'
                  required={true}
                  value={product.stock}
                  onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                  InputProps={{
                    startAdornment:
                      <InputAdornment position='start'> <InventoryIcon /> </InputAdornment>
                  }}
                />
              </Stack>
            </FormControl>
            </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant={'contained'} onClick={handleEditConfirm} color='success'>
            <Typography fontWeight={'bold'}> Save </Typography>
          </Button>
          <Button variant={'contained'} onClick={handleEditCancel} color='warning'>
            <Typography fontWeight={'bold'}> CANCEL </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}