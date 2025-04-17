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
  const [pagination, setPagination] = useState({
    currentPage: Number(searchParams.get('page')) || 1,
    totalPages: 0,
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const itemsPerPage = 8
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [startIndex, setStartIndex] = useState(0)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchParams.get('search') || '')

  // Debounced search handler
  const debounceSearch = useCallback((value) => {
    setSearchTerm(value)

    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout)
    }

    // Set new timeout for the actual search
    window.searchTimeout = setTimeout(() => {
      setDebouncedSearchTerm(value)
      setPagination(prev => ({ ...prev, currentPage: 1 }))
      updateURL(value, 1)
    }, 500)
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      const result = await getAllProduct({
        search: debouncedSearchTerm,
        page: pagination.currentPage,
        limit: itemsPerPage
      })

      setProducts(result.products)
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        total: result.total,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage
      })

      setStartIndex((result.currentPage - 1) * itemsPerPage)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError(error.message)
      setProducts([])
      setStartIndex(0)
    } finally {
      setLoading(false)
    }
  }

  // Simple function to update URL
  function updateURL(search, page) {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (page > 1) params.set('page', page.toString())

    router.push(`?${params.toString() || ''}`, { scroll: false })
  }

  // Simplified search handler
  function handleSearch(value) {
    setSearchTerm(value)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    updateURL(value, 1)
  }

  // Simplified page change handler
  function changePage(newPage) {
    if (newPage === pagination.currentPage) return
    setPagination(prev => ({ ...prev, currentPage: newPage }))
    updateURL(searchTerm, newPage)
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

  // Update useEffect to use debouncedSearchTerm
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1
    const search = searchParams.get('search') || ''

    setSearchTerm(search)
    setDebouncedSearchTerm(search)
    setPagination(prev => ({ ...prev, currentPage: page }))
    fetchProducts()
  }, [searchParams])

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout)
      }
    }
  }, [])

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    const { currentPage, totalPages } = pagination

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
      return pageNumbers
    }

    pageNumbers.push(1)

    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    if (currentPage <= 2) {
      end = 4
    } else if (currentPage >= totalPages - 1) {
      start = totalPages - 3
    }

    if (start > 2) pageNumbers.push('...')

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i)
    }

    if (end < totalPages - 1) pageNumbers.push('...')
    if (totalPages > 1) pageNumbers.push(totalPages)

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
              onChange={(e) => debounceSearch(e.target.value)}
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
                <TableHead className="w-[80px] text-center">Index</TableHead>
                <TableHead className="w-[250px]">Product</TableHead>
                <TableHead className="w-[150px] text-center">Colors</TableHead>
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
                  <TableCell colSpan={7}>
                    <div className="flex items-center justify-center py-20">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-500 text-sm">Loading products...</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    No shoes found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.colors && product.colors[0] && product.colors[0].images && product.colors[0].images[0] ? (
                          <div className="relative">
                            <img
                              src={product.colors[0].images[0].url}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover border border-gray-200"
                            />
                            {product.colors.length > 1 && (
                              <div className="absolute -top-2 -right-2">
                                <Badge variant="secondary" className="text-xs">
                                  +{product.colors.length - 1}
                                </Badge>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-gray-500">{product.typeOfShoes}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {product.colors.map((color) => (
                          <div
                            key={color.id}
                            className="group relative"
                            title={color.colorName}
                          >
                            <div
                              className="w-5 h-5 rounded-full border border-gray-200"
                              style={{ backgroundColor: color.colorCode }}
                            />
                            <div className="absolute hidden group-hover:block z-10 -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                              {color.colorName}
                            </div>
                          </div>
                        ))}
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
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">€{product.price.toFixed(2)}</span>
                        {product.offer > 0 && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            {product.offer}% OFF
                          </Badge>
                        )}
                      </div>
                    </TableCell>
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
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.push(`/dashboard/create-products?edit=${product.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Product</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600"
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
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
            {!loading && products.length > 0 && (
              <>
                Showing {((pagination.currentPage - 1) * itemsPerPage) + 1}-
                {Math.min(pagination.currentPage * itemsPerPage, pagination.total)} of {pagination.total} shoes
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => changePage(1)}
              disabled={!pagination.hasPreviousPage || loading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2">...</span>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={pagination.currentPage === page ? "default" : "outline"}
                  size="icon"
                  className={`h-8 w-8 ${pagination.currentPage === page ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => changePage(page)}
                  disabled={loading}
                >
                  {page}
                </Button>
              )
            ))}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => changePage(pagination.totalPages)}
              disabled={!pagination.hasNextPage || loading}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>

            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md ml-2">
              Page {pagination.currentPage} of {pagination.totalPages}
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
