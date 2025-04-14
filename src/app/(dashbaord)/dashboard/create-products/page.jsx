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
import { createProducts } from "@/apis/productsApis";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CreateProducts() {
  const router = useRouter();
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
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Add reset form function
  const resetForm = () => {
    setFormData({
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
    });
    setUploadedImages([]);
  };
  
  // Update handleSubmit function
  const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validate required fields
      const requiredFields = ['productName', 'brand', 'category', 'price'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
          toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
          return;
      }
  
      // Validate size selection
      if (formData.size.length === 0) {
          toast.error('Please select at least one size');
          return;
      }
  
      setIsLoading(true); // Start loading
  
      try {
          // Prepare the product data according to API requirements
          const productData = {
              name: formData.productName,
              brand: formData.brand,
              Category: formData.category,
              Sub_Category: formData.subCategory || null,
              typeOfShoes: formData.typeOfShoes || null,
              productDesc: formData.productDesc,
              price: parseFloat(formData.price),
              availability: Boolean(formData.availability),
              offer: formData.offer || null,
              size: formData.size,
              feetFirstFit: formData.feetFirstFit || null,
              footLength: formData.footLength || null,
              color: formData.color || null,
              technicalData: formData.technicalData || null,
              Company: formData.company || null,
              gender: formData.gender?.toUpperCase() || null,
              images: uploadedImages.map(img => img.file)
          };
  
          const response = await createProducts(productData);
  
          if (response.success) {
              toast.success(response.message || "Product created successfully!");
              resetForm(); // Reset form after successful creation
              // router.push("/dashboard/products");
          } else {
              throw new Error(response.message || "Failed to create product");
          }
      } catch (error) {
          toast.error(error.message);
          console.error("Error creating product:", error);
      } finally {
          setIsLoading(false); // Stop loading
      }
  };
  
  // Update the submit button in the return statement
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create New Product</h1>
          <p className="text-gray-500 mt-1">Add a new product to your inventory</p>
        </div>
        {/* <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button> */}
      </div>

      <div className="space-y-6">
        <Card>
          <div className="lg:col-span-1">
            <CardContent className="pt-6">
              <div
                className={`border-2 border-dashed rounded-lg p-6  transition-colors ${
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
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-gray-50 rounded-full p-4 mb-4">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">Drag & drop product images here</p>
                    <p className="text-gray-500">or click to browse files</p>
                    {/* <p className="text-xs text-gray-400 mt-2">Supported formats: PNG, JPG, JPEG</p> */}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uploadedImages.map(image => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          <Image
                            src={image.preview}
                            alt={image.name}
                            width={200}
                            height={200}
                            className="object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="absolute inset-0 hover:bg-black/50 bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                          className="absolute top-2 cursor-pointer  right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <p className="text-xs text-white truncate bg-black/70 bg-opacity-50 rounded-md px-2 py-1">
                            {image.name}
                          </p>
                        </div>
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
                      className="aspect-square rounded-lg cursor-pointer  border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all"
                    >
                      <Plus className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500">Add More</span>
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
                      className="cursor-pointer hover:bg-gray-100 hover:text-black hover:border-black px-3 py-1"
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Product...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}




// Basic filtering: /products/query?name=nike&brand=nike
 
// Price range: /products/query?minPrice=50&maxPrice=100
 
// Category filtering: /products/query?category=running&subCategory=trail
 
// Size and color: /products/query?size=10&color=black
 
// Pagination: /products/query?page=2&limit=10
 
// Sorting: /products/query?sortBy=price&sortOrder=desc


// query?name=Ora Hopkins&brand=Qui laborum ullam qu&minPrice=50&maxPrice=60&category=running&subCategory=boots&size=37&color=Perspiciatis ea nat&page=1&limit=10&sortBy=price&sortOrder=desc