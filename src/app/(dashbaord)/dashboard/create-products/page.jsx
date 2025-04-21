"use client"
import React, { useState, useRef, useEffect } from 'react'
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
  X,
  Image as ImageIcon,
  Plus
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'
import { createProducts, getProductById, updateProduct, deleteSingleImage, getCharacteristics } from "@/apis/productsApis";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import JoditEditor from "jodit-react";


const colorMap = {
  '#000000': 'Black',
  '#FFFFFF': 'White',
  '#FF0000': 'Red',
  '#0000FF': 'Blue',
  '#008000': 'Green',
  '#FFFF00': 'Yellow',
  "#C0D432": "Sunny Yellow",
  '#FFA500': 'Orange',
  '#800080': 'Purple',
  '#A52A2A': 'Brown',
  '#808080': 'Gray',
  '#FFC0CB': 'Pink',
  '#40E0D0': 'Turquoise',
  '#FFD700': 'Gold',
  '#C0C0C0': 'Silver',
  '#ADD8E6': 'Light Blue',
  '#90EE90': 'Light Green',
  '#FFB6C1': 'Light Pink',
  '#D3D3D3': 'Light Gray',
  '#F08080': 'Light Coral',
  '#E6E6FA': 'Lavender',
  '#00FFFF': 'Cyan',
  '#8B0000': 'Dark Red',
  '#006400': 'Dark Green',
  '#00008B': 'Dark Blue',
  '#B22222': 'Fire Brick',
  '#DAA520': 'Goldenrod',
  '#F5DEB3': 'Wheat',
  '#FFE4C4': 'Bisque',
  '#D2691E': 'Chocolate',
  '#FA8072': 'Salmon',
  '#FF1493': 'Deep Pink',
  '#7FFFD4': 'Aquamarine',
  '#B0E0E6': 'Powder Blue',
  '#DC143C': 'Crimson',
  '#4B0082': 'Indigo',
  '#2F4F4F': 'Dark Slate Gray',
  '#708090': 'Slate Gray',
};


// extract image filename from url with base url
const extractImageFilename = (url) => {
  if (!url) return null;
  const parts = url.split('/uploads/');
  if (parts.length < 2) return null;
  return parts[1];
};

const editorConfig = {
  readonly: false,
  height: 300,
  toolbar: true,
  spellcheck: false,
  language: "en",
  toolbarButtonSize: "medium",
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
  buttons: [
    "source",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "ul",
    "ol",
    "|",
    "center",
    "left",
    "right",
    "justify",
    "|",
    "link",
    "image",
    "|",
    "hr",
    "eraser",
    "|",
    "undo",
    "redo",
    "|",
    "fullsize",
  ],
};

export default function CreateProducts() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditMode = Boolean(editId)
  const [isLoading, setIsLoading] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [characteristics, setCharacteristics] = useState([]);

  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
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
    gender: '',
    colorVariants: [],
    characteristics: []
  })

  const availableSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47']
  const genderOptions = ['Male', 'Female', 'Unisex']

  // Add this effect to fetch product data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProductData()
    }
  }, [editId])


  useEffect(() => {
    fetchCharacteristics();
  }, []);

  const fetchCharacteristics = async () => {
    try {
      const response = await getCharacteristics();
      if (response.success) {
        setCharacteristics(response.data);
      }
    } catch (error) {
      console.error('Error fetching characteristics:', error);
      toast.error('Failed to load characteristics');
    }
  };

  const fetchProductData = async () => {
    try {
      const product = await getProductById(editId);
      if (product) {
        let parsedSize = [];
        try {
          parsedSize = product.size ?
            (typeof product.size === 'string' ? JSON.parse(product.size) : product.size)
            : [];
        } catch (parseError) {
          console.error('Error parsing size data:', parseError);
          parsedSize = Array.isArray(product.size) ? product.size : [];
        }

        // Handle characteristics - they are now objects in the array
        const characteristicIds = product.characteristics ?
          (Array.isArray(product.characteristics) ? 
            product.characteristics.map(char => char.id.toString()) : 
            [])
          : [];

        const colorVariants = product.colorVariants || [];

        setFormData({
          productName: product.name || '',
          brand: product.brand || '',
          category: (product.Category || '').toLowerCase(),
          subCategory: product.Sub_Category || '',
          typeOfShoes: product.typeOfShoes || '',
          productDesc: product.productDesc || '',
          price: product.price?.toString() || '',
          availability: Boolean(product.availability),
          offer: product.offer?.toString() || '',
          size: parsedSize,
          feetFirstFit: product.feetFirstFit?.toString() || '',
          footLength: product.footLength || '',
          color: product.color || '',
          technicalData: product.technicalData || '',
          company: product.Company || '',
          gender: (product.gender || '').toLowerCase(),
          colorVariants: colorVariants,
          characteristics: characteristicIds  // Use the extracted IDs
        });

        if (colorVariants.length > 0) {
          setCurrentColor(colorVariants[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error("Failed to fetch product data");
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    if (name === 'characteristics') {
      setFormData(prev => ({
        ...prev,
        characteristics: prev.characteristics.includes(value)
          ? prev.characteristics.filter(id => id !== value)
          : [...prev.characteristics, value]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Check if a color is selected
    if (!currentColor) {
      toast.error('Please select a color variant first');
      return;
    }

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      toast.error('Please drop image files only');
      return;
    }

    // Process the dropped files
    const newImages = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    // Update the formData with new images for current color
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map(variant =>
        variant.colorCode === currentColor.colorCode
          ? { ...variant, images: [...variant.images, ...newImages] }
          : variant
      )
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.productName || !formData.brand) {
        toast.error('Name and brand are required fields');
        setIsLoading(false);
        return;
      }
      if (formData.colorVariants.length === 0) {
        toast.error('At least one color variant is required');
        setIsLoading(false);
        return;
      }

      const hasEmptyImages = formData.colorVariants.some(variant => variant.images.length === 0);
      if (hasEmptyImages) {
        toast.error('Each color variant must have at least one image');
        setIsLoading(false);
        return;
      }

      // Modified image validation to handle both new and existing images
      const hasInvalidImages = formData.colorVariants.some(variant =>
        variant.images.some(img =>
          !img.isExisting && (!img.file || !(img.file instanceof File))
        )
      );
      if (hasInvalidImages) {
        toast.error('Invalid image files detected');
        setIsLoading(false);
        return;
      }

      // Convert characteristics to stringified array of IDs
      const characteristicIds = JSON.stringify(formData.characteristics.map(id => parseInt(id)));

      const productData = {
        name: formData.productName,
        brand: formData.brand,
        Category: formData.category,
        Sub_Category: formData.subCategory,
        typeOfShoes: formData.typeOfShoes,
        productDesc: formData.productDesc,
        price: formData.price,
        availability: formData.availability,
        offer: formData.offer || '0',
        size: formData.size,
        feetFirstFit: formData.feetFirstFit,
        footLength: formData.footLength,
        technicalData: formData.technicalData,
        Company: formData.company,
        gender: formData.gender?.toUpperCase(),
        colorVariants: formData.colorVariants,
        characteristics: characteristicIds
      };

      let response;
      if (isEditMode) {
        response = await updateProduct(editId, productData);
      } else {
        response = await createProducts(productData);
      }

      if (response.success) {
        toast.success(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
        router.push('/dashboard/all-product');
      } else {
        throw new Error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddColorVariant = (colorName) => {
    const colorCode = Object.entries(colorMap).find(([_, name]) => name === colorName)[0];
    const newVariant = {
      colorName,
      colorCode,
      images: []
    };

    setFormData(prev => ({
      ...prev,
      colorVariants: [...prev.colorVariants, newVariant]
    }));
    setCurrentColor(newVariant);
  };

  const handleRemoveColorVariant = (index) => {
    setFormData(prev => {
      const newColorVariants = prev.colorVariants.filter((_, i) => i !== index);
      if (currentColor?.colorCode === prev.colorVariants[index].colorCode) {
        const nextColor = newColorVariants[index] || newColorVariants[index - 1] || null;
        setCurrentColor(nextColor);
      }

      return {
        ...prev,
        colorVariants: newColorVariants
      };
    });
  };

  const handleImageUpload = (e, colorCode) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setFormData(prev => {
      const updatedColorVariants = prev.colorVariants.map(variant =>
        variant.colorCode === colorCode
          ? { ...variant, images: [...variant.images, ...newImages] }
          : variant
      );

      // Update current color with new images immediately
      if (currentColor?.colorCode === colorCode) {
        setCurrentColor(updatedColorVariants.find(v => v.colorCode === colorCode));
      }

      return {
        ...prev,
        colorVariants: updatedColorVariants
      };
    });
  };

  // Remove image single  image
  const handleRemoveImage = async (colorCode, imageId) => {
    try {
      const variant = formData.colorVariants.find(v => v.colorCode === colorCode);
      const image = variant?.images.find(img => img.id === imageId);

      if (!image) {
        throw new Error('Image not found');
      }
      if (image.isExisting && editId) {
        const filename = extractImageFilename(image.url);
        if (!filename) {
          throw new Error('Invalid image URL');
        }
        const response = await deleteSingleImage(editId, filename);
        if (response.success) {
          setFormData(prev => ({
            ...prev,
            colorVariants: prev.colorVariants.map(variant =>
              variant.colorCode === colorCode
                ? {
                  ...variant,
                  images: variant.images.filter(img => img.id !== imageId)
                }
                : variant
            )
          }));

          if (currentColor?.colorCode === colorCode) {
            setCurrentColor(prev => ({
              ...prev,
              images: prev.images.filter(img => img.id !== imageId)
            }));
          }

          toast.success('Image deleted successfully');
        }
      } else {
        setFormData(prev => ({
          ...prev,
          colorVariants: prev.colorVariants.map(variant =>
            variant.colorCode === colorCode
              ? {
                ...variant,
                images: variant.images.filter(img => img.id !== imageId)
              }
              : variant
          )
        }));
        if (currentColor?.colorCode === colorCode) {
          setCurrentColor(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== imageId)
          }));
        }
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error(error.message || 'Failed to delete image');
    }
  };

  useEffect(() => {
    if (currentColor) {
      const updatedCurrentColor = formData.colorVariants.find(
        variant => variant.colorCode === currentColor.colorCode
      );
      if (updatedCurrentColor) {
        setCurrentColor(updatedCurrentColor);
      }
    }
  }, [formData.colorVariants]);


  return (
    <div className=" max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Update Product' : 'Create New Product'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditMode ? 'Update the details of your product' : 'Enter the details of your new product'}
          </p>
        </div>
      </div>

      <div className="space-y-6 ">
        <Card>
          {/* Color Variants and Images - Updated Design */}
          <div className="mb-6">
            <CardHeader>
              <CardTitle>Product Colors & Images*</CardTitle>
              <CardDescription>Add color variants and their respective images</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 mt-3">
              {/* Color Selection Bar */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {formData.colorVariants.map((variant, index) => (
                  <div
                    key={variant.colorCode}
                    onClick={() => setCurrentColor(variant)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${currentColor?.colorCode === variant.colorCode
                      ? 'bg-green-50 border border-green-500'
                      : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border shadow-sm"
                      style={{ backgroundColor: variant.colorCode }}
                    />
                    <span className="text-sm font-medium whitespace-nowrap">{variant.colorName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveColorVariant(index);
                      }}
                      className="ml-1 text-gray-400 hover:text-red-500  transition-colors"
                    >
                      <X className="h-3.5 w-3.5 cursor-pointer" />
                    </button>
                  </div>
                ))}

                <Select
                  value=""
                  onValueChange={(colorName) => handleAddColorVariant(colorName)}
                >
                  <SelectTrigger className="w-[140px] h-9 px-4 bg-gray-50 border border-dashed cursor-pointer">
                    <SelectValue placeholder="Add Color" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(colorMap)
                      .filter(([hex, name]) =>
                        !formData.colorVariants.some(v => v.colorName === name)
                      )
                      .map(([hex, name]) => (
                        <SelectItem key={hex} value={name}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: hex }}
                            />
                            <span className="text-sm">{name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload Area */}
              {currentColor ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Images for {currentColor.colorName}
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {currentColor.colorCode}
                        </span>
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Upload up to 5 images for this color variant
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Images
                    </Button>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`grid ${currentColor.images.length > 0
                      ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
                      : 'grid-cols-1'
                      } gap-4 ${isDragging
                        ? 'border-2 border-dashed border-primary bg-primary/5'
                        : ''
                      }`}
                  >
                    {currentColor.images.length > 0 ? (
                      currentColor.images.map((image) => (
                        <div key={image.id} className="group relative">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                            <Image
                              src={image.preview}
                              alt={image.name}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveImage(currentColor.colorCode, image.id)}
                            className="absolute cursor-pointer -top-2 -right-2 bg-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed ${isDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                          } rounded-lg p-8 text-center cursor-pointer transition-colors`}
                      >
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-primary">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleImageUpload(e, currentColor.colorCode)}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700">No Color Selected</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Select or add a color variant to manage images
                  </p>
                </div>
              )}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="space-y-2 w-full">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger className="w-full" id="category">
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

                <div className="space-y-2 w-full">
                  <Label htmlFor="subCategory">Sub-Category</Label>
                  <Select
                    value={formData.subCategory}
                    onValueChange={(value) => handleSelectChange('subCategory', value)}
                  >
                    <SelectTrigger className="w-full" id="subCategory">
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

                <div className="space-y-2 w-full">
                  <Label htmlFor="typeOfShoes">Type of Shoes</Label>
                  <Select
                    value={formData.typeOfShoes}
                    onValueChange={(value) => handleSelectChange('typeOfShoes', value)}
                  >
                    <SelectTrigger className="w-full" id="typeOfShoes">
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
                <div className="border rounded-md">
                  <JoditEditor
                    value={formData.productDesc}
                    config={editorConfig}
                    onChange={newContent => {
                      setFormData(prev => ({ ...prev, productDesc: newContent }));
                    }}
                  />
                </div>
              </div>
            </div>

            {/* <Separator /> */}

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

              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              </div> */}

              <div className="space-y-2">
                <Label htmlFor="technicalData">Technical Data</Label>
                <div className="border rounded-md">
                  <JoditEditor
                    value={formData.technicalData}
                    config={editorConfig}
                    onChange={newContent => {
                      setFormData(prev => ({ ...prev, technicalData: newContent }));
                    }}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="space-y-2 w-full">
                  <Label htmlFor="company">Company/Manufacturer</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="w-full"
                  />
                </div>

                {/* GENDER */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger className="w-full" id="gender">
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

                {/* CHARACTERISTICS */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="characteristics">Characteristics *</Label>
                  <Select
                    value=""
                    onValueChange={(value) => handleSelectChange('characteristics', value)}
                    multiple
                  >
                    <SelectTrigger className="w-full" id="characteristics">
                      <SelectValue placeholder="Select characteristics">
                        {formData.characteristics.length > 0
                          ? `${formData.characteristics.length} selected`
                          : "Select characteristics"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {characteristics.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id.toString()}
                        >
                          <div className="flex items-center justify-between w-full gap-2">
                            <div>
                              <p>{item.text}</p>
                            </div>
                            <div className="flex items-center gap-2">

                              <div className="w-12 h-12 rounded-full">
                                <Image
                                  src={item.image}
                                  alt={item.text}
                                  width={100}
                                  height={100}
                                  className="w-full h-full rounded-full"
                                />
                              </div>
                              {formData.characteristics.includes(item.id.toString()) && (
                                <span className="font-semibold text-lg text-green-600">✓</span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.characteristics.map((charId) => {
                      const char = characteristics.find(c => c.id.toString() === charId);
                      return char ? (
                        <Badge
                          key={charId}
                          variant="secondary"
                          className="flex items-center gap-2"
                        >
                          {char.text}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectChange('characteristics', charId);
                            }}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3 cursor-pointer" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Separator />


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
                {isEditMode ? 'Updating Product...' : 'Creating Product...'}
              </>
            ) : (
              isEditMode ? 'Update Product' : 'Create Product'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
