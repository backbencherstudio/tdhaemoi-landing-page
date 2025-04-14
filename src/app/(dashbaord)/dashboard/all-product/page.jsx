"use client"
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
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

export default function AllProduct() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Sample shoes product data - replace with your actual data fetching logic
  const products = [
    {
      id: 1,
      name: "Air Max Running Shoes",
      category: "Footwear",
      gender: "Male",
      price: 129.99,
      stock: 45,
      status: "In Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 2,
      name: "Leather Ballet Flats",
      category: "Footwear",
      gender: "Female",
      price: 89.99,
      stock: 12,
      status: "Low Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 3,
      name: "Hiking Boots",
      category: "Footwear",
      gender: "Unisex",
      price: 149.99,
      stock: 78,
      status: "In Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 4,
      name: "Canvas Sneakers",
      category: "Footwear",
      gender: "Male",
      price: 59.99,
      stock: 0,
      status: "Out of Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 5,
      name: "High Heel Sandals",
      category: "Footwear",
      gender: "Female",
      price: 79.99,
      stock: 23,
      status: "In Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 6,
      name: "Sports Trainers",
      category: "Footwear",
      gender: "Male",
      price: 119.99,
      stock: 15,
      status: "In Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 7,
      name: "Ankle Boots",
      category: "Footwear",
      gender: "Female",
      price: 95.00,
      stock: 32,
      status: "In Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 8,
      name: "Slip-on Loafers",
      category: "Footwear",
      gender: "Male",
      price: 69.99,
      stock: 8,
      status: "Low Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 9,
      name: "Platform Sneakers",
      category: "Footwear",
      gender: "Female",
      price: 84.99,
      stock: 0,
      status: "Out of Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 10,
      name: "Waterproof Boots",
      category: "Footwear",
      gender: "Unisex",
      price: 129.99,
      stock: 18,
      status: "In Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 11,
      name: "Dress Shoes",
      category: "Footwear",
      gender: "Male",
      price: 109.99,
      stock: 7,
      status: "Low Stock",
      image: "https://placehold.co/40x40"
    },
    {
      id: 12,
      name: "Running Shoes",
      category: "Footwear",
      gender: "Female",
      price: 99.99,
      stock: 25,
      status: "In Stock",
      image: "https://placehold.co/40x40"
    }
  ]

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.gender.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

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

  // Function to change page
  const changePage = (page) => {
    setCurrentPage(page)
  }

  // Function to get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Out of Stock":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Footwear Collection</h1>
          <p className="text-gray-500 mt-1">Manage your shoes inventory by gender and style</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
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
              placeholder="Search shoes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Products table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[80px] text-center">ID</TableHead>
                <TableHead className="w-[250px]">Product</TableHead>
                <TableHead className="w-[120px] text-center">Gender</TableHead>
                <TableHead className="w-[120px] text-center">Price</TableHead>
                <TableHead className="w-[100px] text-center">Stock</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-center">{product.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover border border-gray-200"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`font-normal ${product.gender === "Male" ? "bg-blue-100 text-blue-800" :
                        product.gender === "Female" ? "bg-pink-100 text-pink-800" :
                          "bg-purple-100 text-purple-800"
                        }`}>
                        {product.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{product.stock}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={`font-normal ${getStatusVariant(product.status)}`}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] bg-white border border-gray-100 shadow-md">
                          <DropdownMenuLabel className="text-gray-700">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-100" />
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
                            <Eye className="mr-2 h-4 w-4 text-gray-500" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
                            <Edit className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Edit Product</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-100" />
                          <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
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
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} shoes
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
        )}
      </div>
    </div>
  )
}
