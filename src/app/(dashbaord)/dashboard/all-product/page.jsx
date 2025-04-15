"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from "react-hot-toast"
import { format } from 'date-fns'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import { getAllProduct, deleteProduct } from '@/apis/productsApis'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AllProduct() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const itemsPerPage = 8
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getAllProduct({
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage
      })
      setProducts(result.products || [])
      setTotalPages(result.totalPages || 0)
      setTotalItems(result.total || 0)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError(error.message)
      setProducts([])
      setTotalPages(0)
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  // Create a function to update URL with search params
  const updateSearchParams = useCallback((search, page) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (page > 1) params.set('page', page.toString())

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname

    router.push(newUrl)
  }, [router])

  // Update search handler
  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
    updateSearchParams(value, 1)
  }

  // Update page change handler
  const changePage = (page) => {
    setCurrentPage(page)
    updateSearchParams(searchTerm, page)
  }

  // Update delete handler
  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      await deleteProduct(productToDelete.id)
      toast.success('Product deleted successfully')
      setDeleteModalOpen(false)
      setProductToDelete(null)
      fetchProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Failed to delete product. Please try again.')
    }
  }

  // Add modal open handler
  const openDeleteModal = (product) => {
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchParams])

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        end = 4
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push('...')
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push('...')
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  const handleAddNewShoes = () => {
    router.push('/dashboard/create-products')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Footwear Collection</h1>
          <p className="text-gray-500 mt-1">Manage your shoes inventory by gender and style</p>
        </div>
        <Button className="bg-green-600 cursor-pointer hover:bg-green-700 flex items-center gap-2" onClick={handleAddNewShoes}>
          <Plus className="h-4 w-4" />
          Add New Shoes
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {/* Card header with search only */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or brand..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Add error message display */}
        {error && (
          <div className="p-4 text-red-600 bg-red-50 border-b border-red-100">
            Error: {error}
          </div>
        )}

        {/* Products table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[80px] text-center">ID</TableHead>
                <TableHead className="w-[250px]">Product</TableHead>
                <TableHead className="w-[120px] text-center">Gender</TableHead>
                <TableHead className="w-[120px] text-center">Price</TableHead>
                <TableHead className="w-[100px] text-center">Brand</TableHead>
                <TableHead className="w-[150px] text-center">Created At</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-red-600">
                    Failed to load products. Please try again later.
                  </TableCell>
                </TableRow>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-center">{product.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover border border-gray-200"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`font-normal ${product.gender === "MALE" ? "bg-blue-100 text-blue-800" :
                        product.gender === "FEMALE" ? "bg-pink-100 text-pink-800" :
                          "bg-purple-100 text-purple-800"
                        }`}>
                        {product.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">€{product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{product.brand}</TableCell>
                    <TableCell className="text-center text-gray-500">
                      {format(new Date(product.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="cursor-pointer h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] bg-white border border-gray-100 shadow-md">
                          <DropdownMenuLabel className="text-gray-700">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-100" />
                          {/* <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
                            <Eye className="mr-2 h-4 w-4 text-gray-500" />
                            <span>View Details</span>
                          </DropdownMenuItem> */}
                          <DropdownMenuItem 
                            className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                            onClick={() => router.push(`/dashboard/create-products?edit=${product.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Edit Product</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-100" />
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                            onClick={() => openDeleteModal(product)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    No shoes found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} shoes
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => changePage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2">...</span>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className={`h-8 w-8 ${currentPage === page ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => changePage(page)}
                >
                  {page}
                </Button>
              )
            ))}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>

            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md ml-2">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      </div>

      {/* Add the delete confirmation modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
