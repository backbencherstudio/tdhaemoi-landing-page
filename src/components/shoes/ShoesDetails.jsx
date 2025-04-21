'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';;
import icon from "../../../public/shoesDetails/icon.png"
import icon1 from "../../../public/shoesDetails/icon1.png"
import icon2 from "../../../public/shoesDetails/icon2.png"
import icon3 from "../../../public/shoesDetails/icon3.png"
import icon4 from "../../../public/shoesDetails/icon4.png"
import footImg from "../../../public/shoesDetails/footImg.png"
import scannerImg from "../../../public/shoesDetails/scanner.png"
import RecommendShoes from './Recommend';
import { IoChevronDown, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { getProductByIdclient } from '@/apis/productsApis';

export default function ShoesDetails({ productId }) {
    const [shoe, setShoe] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('app');
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColorVariant, setSelectedColorVariant] = useState(0);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!productId) return;
                const data = await getProductByIdclient(productId);
                setShoe(data.product);
                setRecommendedProducts(data.recommendedProducts);

                if (data.product?.size) {
                    if (Array.isArray(data.product.size)) {
                        setSizes(data.product.size);
                        setSelectedSize(data.product.size[0]);
                    } else {
                        try {
                            const parsedSizes = JSON.parse(data.product.size);
                            setSizes(parsedSizes);
                            setSelectedSize(parsedSizes[0]);
                        } catch (e) {
                            console.error('Error parsing sizes:', e);
                            setSizes([]);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);



    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            </>
        );
    }

    if (!shoe) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-red-500">Shoe not found</p>
                </div>
            </>
        );
    }

    const handleThumbnailScroll = (direction) => {
        const currentVariant = shoe?.colors?.[selectedColorVariant];
        if (!currentVariant?.images?.length) return;

        const maxIndex = currentVariant.images.length - 1;

        if (direction === 'up') {
            setSelectedImage(prev => (prev === 0 ? maxIndex : prev - 1));
        } else {
            setSelectedImage(prev => (prev === maxIndex ? 0 : prev + 1));
        }
    };

    const getVisibleThumbnails = () => {
        const currentVariant = shoe?.colors?.[selectedColorVariant];
        if (!currentVariant) return [];

        return currentVariant.images.map((image, index) => ({
            index,
            id: `thumb-${index}-${Date.now()}`,
            url: image.url
        }));
    };

    const handleTabClick = (tabName) => {
        setActiveTab(activeTab === tabName ? null : tabName);
    };

    return (
        <>
            <Navbar />
            <div className="w-full px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8 mt-6">
                    <div className="flex md:flex-row flex-col gap-4 h-full">
                        {/* Thumbnails Section - Already on the left */}
                        <div className="relative flex md:flex-col flex-row order-2 md:order-1 md:justify-center">
                            {/* Mobile view */}
                            <div className="md:hidden relative flex items-center w-full">
                                <button
                                    onClick={() => handleThumbnailScroll('up')}
                                    className="absolute left-0 z-10 h-full px-2 flex items-center justify-center"
                                    aria-label="Previous"
                                >
                                    <IoChevronBack className="text-2xl text-gray-600" />
                                </button>

                                <div className="flex justify-center items-center w-full gap-2 px-8">
                                    {getVisibleThumbnails().map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedImage(item.index)}
                                            className={`bg-[#e8e8e8] rounded-lg p-2 transition-all w-20 flex-shrink-0
                                                ${selectedImage === item.index ? 'ring-2 ring-green-500' : ''}`}
                                        >
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={item.url}
                                                    fill
                                                    sizes="80px"
                                                    alt={`View ${item.index + 1}`}
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleThumbnailScroll('down')}
                                    className="absolute right-0 z-10 h-full px-2 flex items-center justify-center"
                                    aria-label="Next"
                                >
                                    <IoChevronForward className="text-2xl text-gray-600" />
                                </button>
                            </div>

                            {/* Updated Desktop Thumbnails */}
                            <div className="hidden md:flex md:flex-col relative items-center">
                                {/* Up arrow button */}
                                <button
                                    onClick={() => handleThumbnailScroll('up')}
                                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-all duration-300"
                                    aria-label="Previous image"
                                >
                                    <IoChevronBack className="transform rotate-90 text-xl" />
                                </button>

                                {/* Thumbnails container */}
                                <div className="px-1 py-6 flex flex-col gap-4 overflow-hidden items-center">
                                    {getVisibleThumbnails().map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedImage(item.index)}
                                            className={`border cursor-pointer rounded-lg transition-all flex-shrink-0 hover:shadow-md transform hover:scale-105 duration-300 relative group
                                                ${selectedImage === item.index ? 'ring ring-green-500 shadow-lg' : ''}`}
                                        >
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={item.url}
                                                    width={100}
                                                    height={100}
                                                    sizes="80px"
                                                    alt={`View ${item.index + 1}`}
                                                    className="object-contain p-1 w-full h-full"
                                                />
                                                {/* Thumbnail tooltip */}
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-0 left-0 right-0 bg-black/80 bg-opacity-10 text-white p-1 text-center text-xs rounded-b-lg">
                                                    {shoe?.name}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Down arrow button */}
                                <button
                                    onClick={() => handleThumbnailScroll('down')}
                                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-all duration-300"
                                    aria-label="Next image"
                                >
                                    <IoChevronBack className="transform -rotate-90 text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Main image */}
                        <div className="flex-1 border rounded-lg p-4 order-1 md:order-2 relative flex items-center justify-center min-h-[300px] md:min-h-[400px] group">
                            <div className="relative w-3/4 h-full">
                                <Image
                                    src={shoe?.colors?.[selectedColorVariant]?.images?.[selectedImage]?.url || ''}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                                    alt={`${shoe?.name} - ${shoe?.colors?.[selectedColorVariant]?.colorName}`}
                                    className="object-contain  transition-all duration-500 ease-in-out transform"
                                    priority
                                    quality={100}
                                />

                            </div>
                        </div>
                    </div>

                    {/* Details section - Updated classes */}
                    <div className="space-y-6 order-2 max-w-2xl">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{shoe?.name}</h1>
                            {shoe?.offer > 0 && (
                                <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
                                    {shoe.offer}% OFF
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg">{shoe?.description}</p>
                            <div className="flex items-center gap-3">
                                {shoe?.offer ? (
                                    <>
                                        <span className="text-gray-500 line-through text-2xl">
                                            {Number(shoe.price).toFixed(2)}€
                                        </span>
                                        <span className="text-green-600 font-semibold text-2xl">
                                            {Number(shoe.price * (1 - shoe.offer / 100)).toFixed(2)}€
                                        </span>
                                    </>
                                ) : (
                                    <p className="text-2xl font-semibold">
                                        {Number(shoe.price).toFixed(2)}€
                                    </p>
                                )}
                            </div>
                            <div className='flex items-center gap-2'>
                                <p className="text-lg flex items-center gap-2">
                                    Farbe: {shoe?.colors?.[selectedColorVariant]?.colorName || 'N/A'}
                                    <span
                                        className='w-6 h-6 rounded-full border'
                                        style={{ backgroundColor: shoe?.colors?.[selectedColorVariant]?.colorCode || '#fff' }}
                                    ></span>
                                </p>
                                <p className='text-lg'>|</p>
                                <p className='text-lg'>{shoe?.gender}</p>
                            </div>
                        </div>

                        {/* Color variants */}
                        <div className="space-y-4">
                            <div className="flex gap-4 overflow-x-auto md:overflow-x-visible">
                                {shoe?.colors?.map((variant, index) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => {
                                            setSelectedColorVariant(index);
                                            setSelectedImage(0); // Reset to first image when changing color
                                        }}
                                        className={`border rounded-lg p-2 w-24 h-24 flex-shrink-0 transition-all duration-300
                                            ${selectedColorVariant === index ? 'ring ring-green-500 shadow-lg' : ''}`}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={variant.images[0]?.url || ''}
                                                fill
                                                sizes="96px"
                                                alt={variant.colorName}
                                                className="object-contain p-1"
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Properties */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">EIGENSCHAFTEN</h3>
                            <div className="flex gap-4 overflow-x-auto md:overflow-x-visible">
                                {shoe?.characteristics?.map((characteristic) => (
                                    <div 
                                        key={characteristic.id} 
                                        className="border rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0"
                                        title={characteristic.text}
                                    >
                                        <Image 
                                            width={100} 
                                            height={100} 
                                            src={characteristic.image} 
                                            alt={characteristic.text} 
                                            className='w-14 h-14' 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='bg-black rounded'>
                            <div className='flex justify-between items-center px-3 py-2'>
                                <Image src={icon} alt='logo' width={400} height={200} className='w-60' />
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="text-white font-semibold text-xl px-4 py-2 rounded flex items-center gap-2"
                                    >
                                        {selectedSize || (sizes.length > 0 ? sizes[0] : '--')}
                                        <svg
                                            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <p className='text-white'>90% FIT</p>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-24 bg-white rounded-lg shadow-lg z-10">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => {
                                                        setSelectedSize(size);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`block w-full text-left px-4 py-2 
                                                    ${selectedSize === size
                                                            ? 'bg-black text-white'
                                                            : 'hover:bg-gray-100 text-black'
                                                        } transition-colors duration-200`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* button  */}
                        <div className='flex flex-col sm:flex-row gap-5 justify-between items-center w-full'>
                            <button className='uppercase border py-4 px-10 text-lg font-semibold rounded-md w-full'>Jetzt Anprobieren</button>
                            <button className='uppercase border py-4 text-lg px-10 font-semibold rounded-md w-full'>Beratung</button>
                        </div>
                    </div>
                </div>
                {/* middle part this  */}
                <div className="my-24">
                    <div className="grid md:grid-cols-2 gap-8  relative">
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-black transform -translate-x-1/2"></div>
                        <div className="space-y-4 text-center">
                            <div className="bg-white p-4 rounded-lg">
                                <Image
                                    src={footImg}
                                    alt="Foot measurement"
                                    width={800}
                                    height={300}
                                    className="mx-auto w-auto h-auto"
                                />
                            </div>

                        </div>
                        {/* tab use */}
                        <div className='px-5'>
                            <div className='flex flex-col gap-10'>
                                <div className='space-y-4'>
                                    <button
                                        onClick={() => handleTabClick('app')}
                                        className='flex items-center gap-2 justify-between w-full border-b border-black pb-2'
                                    >
                                        <span className='font-semibold'>Persönlicher App Zugang</span>
                                        <IoChevronDown className={`transform transition-transform duration-300 ${activeTab === 'app' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeTab === 'app' && (
                                        <div className="animate-fadeIn">
                                            <div className="space-y-4 text-center ">
                                                <div className="bg-white p-4 rounded-lg">
                                                    <Image
                                                        src={scannerImg}
                                                        alt="QR Scanner"
                                                        width={500}
                                                        height={500}
                                                        className="w-[289px] h-[277px] mx-auto"
                                                    />
                                                </div>
                                                <div className="max-w-md mx-auto">
                                                    <p className="text-gray-600">Dies ist dein persönlicher QR Code für den Zugang zur FeetF1rst App um jederzeit den perfekten Schuh griffbereit zu haben</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className='space-y-4'>
                                    <button
                                        onClick={() => handleTabClick('description')}
                                        className='flex items-center gap-2 justify-between w-full border-b border-black pb-2'
                                    >
                                        <span className='font-semibold'>Produktbeschreibung</span>
                                        <IoChevronDown className={`transform transition-transform duration-300 ${activeTab === 'description' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeTab === 'description' && (
                                        <div className="animate-fadeIn py-1 pl-4">
                                            {/* <h2 className="text-gray-900 font-semibold text-lg mb-4">
                                                {shoe?.name}
                                            </h2> */}
                                            <div 
                                                className="text-gray-800 prose max-w-none"
                                                dangerouslySetInnerHTML={{ __html: shoe?.productDesc || '' }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className='space-y-4'>
                                    <button
                                        onClick={() => handleTabClick('technical')}
                                        className='flex items-center gap-2 justify-between w-full border-b border-black pb-2'
                                    >
                                        <span className='font-semibold'>Technische Daten</span>
                                        <IoChevronDown className={`transform transition-transform duration-300 ${activeTab === 'technical' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeTab === 'technical' && (
                                        <div className="animate-fadeIn py-1 pl-4">
                                            
                                            <div 
                                                className="text-gray-800 prose max-w-none"
                                                dangerouslySetInnerHTML={{ __html: shoe?.technicalData || '' }}
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* recommend shoes  */}
                <div>
                    {recommendedProducts && recommendedProducts.length > 0 && (
                        <RecommendShoes recommendedProducts={recommendedProducts} />
                    )}
                </div>
            </div>
        </>
    );
}
