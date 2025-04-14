"use client"
import React, { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Upload,
  X,
  Image as ImageIcon,
  Plus,
  ArrowLeft
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'

export default function CreateProducts() {
  // State for form fields
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: '',
    subCategory: '',
    typeOfShoes: '',
    productDesc: '',
    price: '',
    availability: true,
    offer: '',
    size: [],
    feetFirstFit: '',
    footLength: '',
    color: '',
    technicalData: '',
    company: '',
    gender: ''
  })

  // State for image uploads
  const [uploadedImages, setUploadedImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Available sizes for shoes
  const availableSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

  // Gender options
  const genderOptions = ['Male', 'Female', 'Unisex']

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle size selection
  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const currentSizes = [...prev.size]
      if (currentSizes.includes(size)) {
        return { ...prev, size: currentSizes.filter(s => s !== size) }
      } else {
        return { ...prev, size: [...currentSizes, size] }
      }
    })
  }

  // Handle availability toggle
  const handleAvailabilityToggle = (checked) => {
    setFormData(prev => ({ ...prev, availability: checked }))
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    e.stopPropagation()
    const files = e.target.files
    if (files && files.length > 0) {
      addNewImages(Array.from(files))
    }
  }

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      addNewImages(droppedFiles)
    }
  }

  // Process new images
  const addNewImages = (files) => {
    if (!files || files.length === 0) return;
    
    const newImages = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(2)
    }))

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setUploadedImages(prev => [...prev, ...newImages])
  }

  // Remove an image
  const removeImage = (id) => {
    setUploadedImages(prev => {
      const filtered = prev.filter(image => image.id !== id)
      return filtered
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Create form data object for submission
    const productFormData = new FormData()

    // Add all text fields
    Object.keys(formData).forEach(key => {
      if (key === 'size') {
        productFormData.append(key, JSON.stringify(formData[key]))
      } else {
        productFormData.append(key, formData[key])
      }
    })

    // Add all images
    uploadedImages.forEach((image, index) => {
      productFormData.append(`image-${index}`, image.file)
    })

    // Here you would typically send this to your API
    console.log('Form submitted:', formData)
    console.log('Images:', uploadedImages)

    // For demo purposes, just show an alert
    alert('Product submitted successfully!')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create New Product</h1>
          <p className="text-gray-500 mt-1">Add a new product to your inventory</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="lg:col-span-1">
            <CardContent className="pt-6">
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] transition-colors ${
                  isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={(e) => {
                  e.preventDefault()
                  fileInputRef.current?.click()
                }}
              >
                {uploadedImages.length === 0 ? (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 text-center mb-2">Drag & drop product images here</p>
                    <p className="text-gray-400 text-sm text-center">or click to browse files</p>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {uploadedImages.map(image => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={image.preview}
                            alt={image.name}
                            width={200}
                            height={200}
                            className=""
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        }
                      }}
                      className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Plus className="h-8 w-8 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">{uploadedImages.length} image(s) selected</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Images
                  </Button>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
                style={{ display: 'none' }}
              />
            </CardContent>
          </div>
          
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Enter the details of your product</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter brand name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="footwear">Footwear</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="hiking">Hiking</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subCategory">Sub-Category</Label>
                  <Select
                    value={formData.subCategory}
                    onValueChange={(value) => handleSelectChange('subCategory', value)}
                  >
                    <SelectTrigger id="subCategory">
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sneakers">Sneakers</SelectItem>
                      <SelectItem value="boots">Boots</SelectItem>
                      <SelectItem value="sandals">Sandals</SelectItem>
                      <SelectItem value="athletic">Athletic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typeOfShoes">Type of Shoes</Label>
                  <Select
                    value={formData.typeOfShoes}
                    onValueChange={(value) => handleSelectChange('typeOfShoes', value)}
                  >
                    <SelectTrigger id="typeOfShoes">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="hiking">Hiking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDesc">Product Description *</Label>
                <Textarea
                  id="productDesc"
                  name="productDesc"
                  value={formData.productDesc}
                  onChange={handleChange}
                  placeholder="Enter detailed product description"
                  className="min-h-[120px]"
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Pricing & Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing & Inventory</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (€) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offer">Discount (%)</Label>
                  <Input
                    id="offer"
                    name="offer"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.offer}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2 h-10">
                    <Checkbox
                      id="availability"
                      checked={formData.availability}
                      onCheckedChange={handleAvailabilityToggle}
                    />
                    <Label htmlFor="availability" className="cursor-pointer">
                      In Stock
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Shoe Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shoe Specifications</h3>

              <div className="space-y-4">
                <Label>Available Sizes *</Label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <Badge
                      key={size}
                      variant={formData.size.includes(size) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-gray-100 px-3 py-1"
                      onClick={() => handleSizeToggle(size)}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feetFirstFit">Feet First Fit (%)</Label>
                  <Input
                    id="feetFirstFit"
                    name="feetFirstFit"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.feetFirstFit}
                    onChange={handleChange}
                    placeholder="90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footLength">Foot Length (mm)</Label>
                  <Input
                    id="footLength"
                    name="footLength"
                    value={formData.footLength}
                    onChange={handleChange}
                    placeholder="e.g., 250-270"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g., Black, Red, Blue"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technicalData">Technical Data</Label>
                <Textarea
                  id="technicalData"
                  name="technicalData"
                  value={formData.technicalData}
                  onChange={handleChange}
                  placeholder="Enter technical specifications, materials, etc."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Manufacturer</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map(option => (
                        <SelectItem key={option} value={option.toLowerCase()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            className="bg-green-600 hover:bg-green-700"
          >
            Create Product
          </Button>
        </div>
      </div>
    </div>
  )
}
