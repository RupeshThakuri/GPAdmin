"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Pagination,
} from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"
import { toast } from "react-hot-toast"
import  ProductForm  from "./product-form"
import type { ProductFormValues } from "@/types"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
}

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [addProduct, setAddProduct] = useState(false)
  const [formKey, setFormKey] = useState(0) // Key to force remount ProductForm
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalProducts, setTotalProducts] = useState(0)

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`/api/products?page=${page}&limit=${rowsPerPage}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data.products)
      setTotalProducts(data.total)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast.error("Failed to fetch products.")
    }
  }, [page, rowsPerPage])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setAddProduct(true)
    setFormKey((prevKey) => prevKey + 1) // Update key to remount the form
  }

  const handleDelete = (id: number) => {
    setProductToDelete(id)
    setDeleteConfirmationOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      toast.success("Product deleted successfully!")
      fetchProducts() // Refresh product list
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast.error("Failed to delete product.")
    } finally {
      setDeleteConfirmationOpen(false)
      setProductToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false)
    setProductToDelete(null)
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(1) // Reset to the first page when changing rows per page
  }

  const handleAddProductOpen = () => {
    setSelectedProduct(null)
    setAddProduct(true)
    setFormKey((prevKey) => prevKey + 1) // Update key to remount the form
  }

  const handleFormClose = (newProduct: ProductFormValues) => {
    setAddProduct(false)
    setSelectedProduct(null)

    // If a new product was added or an existing one was updated, refresh the product list
    if (newProduct) {
      fetchProducts()
      toast({
        title: "Success",
        description: selectedProduct ? "Product updated successfully!" : "Product added successfully!",
      })
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Products</Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddProductOpen}>
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {product.id}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" onClick={() => handleEdit(product)}>
                    <Edit />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(product.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
          <Select
            labelId="rows-per-page-label"
            id="rows-per-page"
            value={rowsPerPage}
            label="Rows per page"
            onChange={handleChangeRowsPerPage}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
        </FormControl>
        <Pagination
          count={Math.ceil(totalProducts / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Dialog open={deleteConfirmationOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this product?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addProduct} onClose={() => setAddProduct(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <ProductForm
            key={formKey}
            defaultValues={selectedProduct || undefined}
            onSubmit={handleFormClose}
            isUpdate={!!selectedProduct}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddProduct(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductTable
