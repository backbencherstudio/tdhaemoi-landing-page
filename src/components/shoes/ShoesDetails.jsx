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
import { getProductById } from '@/apis/productsApis';

export default function ShoesDetails({ productId }) {
    const [shoe, setShoe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('app');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!productId) return;
                const product = await getProductById(productId);
                setShoe(product);
                if (product?.size) {
                    const parsedSizes = JSON.parse(product.size);
                    setSizes(parsedSizes);
                    setSelectedSize(parsedSizes[0]);
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

    const demoImages = shoe?.images || [];

    const handleThumbnailScroll = (direction) => {
        if (direction === 'up') {
            const newIndex = currentIndex === 0 ? (shoe?.images?.length - 1 || 0) : currentIndex - 1;
            setCurrentIndex(newIndex);
            setSelectedImage(newIndex);
        } else {
            const newIndex = currentIndex === (shoe?.images?.length - 1 || 0) ? 0 : currentIndex + 1;
            setCurrentIndex(newIndex);
            setSelectedImage(newIndex);
        }
    };

    // Modified function to show only available unique images
    const getVisibleThumbnails = () => {
        const totalImages = demoImages.length;
        return demoImages.map((_, index) => ({
            index,
            id: `thumb-${index}-${Date.now()}`
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
                                                    src={demoImages[item.index]}
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
                                    aria-label="Scroll up"
                                >
                                    <IoChevronBack className="transform rotate-90 text-xl" />
                                </button>

                                {/* Thumbnails container */}
                                <div className="px-1 py-6 flex flex-col gap-4 overflow-hidden h-[500px] items-center">
                                    {getVisibleThumbnails().map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedImage(item.index)}
                                            className={`bg-[#e8e8e8] rounded-lg p-2 transition-all w-20 flex-shrink-0 hover:shadow-md transform hover:scale-105 duration-300
                                                ${selectedImage === item.index ? 'ring-2 ring-green-500 shadow-lg' : ''}`}
                                        >
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={demoImages[item.index]}
                                                    fill
                                                    sizes="80px"
                                                    alt={`View ${item.index + 1}`}
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Down arrow button */}
                                <button
                                    onClick={() => handleThumbnailScroll('down')}
                                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-all duration-300"
                                    aria-label="Scroll down"
                                >
                                    <IoChevronBack className="transform -rotate-90 text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Main image */}
                        <div className="flex-1 border rounded-lg p-4 order-1 md:order-2 relative flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                            <div className="relative w-3/4 h-full transition-all duration-500 ease-in-out">
                                <Image
                                    src={demoImages[selectedImage]}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                                    alt={shoe?.name}
                                    className="object-contain p-2 md:p-4 transition-opacity duration-300"
                                    priority
                                    quality={100}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Details section - Updated classes */}
                    <div className="space-y-6 order-2 max-w-2xl">
                        <h1 className="text-3xl font-bold">{shoe?.name}</h1>
                        <div className="space-y-2">
                            <p className="text-lg">{shoe?.description}</p>
                            <p className="text-2xl font-semibold">{(shoe.price).toFixed(2)}€</p>
                            <p className="text-lg">{shoe?.Farbe ? `${shoe.Farbe} Farben` : '1 Farben'}</p>
                        </div>

                        {/* Color variants */}
                        <div className="flex gap-4 overflow-x-auto md:overflow-x-visible">
                            <div className="bg-[#e8e8e8] rounded-lg p-2 w-24 h-24 flex-shrink-0">
                                <Image
                                    src={shoe?.images?.[0] || ''}
                                    width={100}
                                    height={100}
                                    alt="Color variant 1"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="bg-[#e8e8e8] rounded-lg p-2 w-24 h-24 flex-shrink-0">
                                <Image
                                    src={shoe?.images?.[1] || shoe?.images?.[0] || ''}
                                    width={100}
                                    height={100}
                                    alt="Color variant 2"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Properties */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">EIGENSCHAFTEN</h3>
                            <div className="flex gap-4 overflow-x-auto md:overflow-x-visible">
                                <div className="border rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0">
                                    <Image width={100} height={100} src={icon4} alt='icon' className='w-14 h-14' />
                                </div>
                                <div className="border rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0">
                                    <Image width={100} height={100} src={icon3} alt='icon' className='w-14 h-14' />
                                </div>
                                <div className="border rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0">
                                    <Image width={100} height={100} src={icon2} alt='icon' className='w-14 h-14' />
                                </div>
                                <div className="border rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0">
                                    <Image width={100} height={100} src={icon1} alt='icon' className='w-14 h-14' />
                                </div>
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
                                        <div className="animate-fadeIn py-1">
                                            <h2 className="text-gray-900 font-semibold text-lg">
                                                Brooks Adrenaline GTS 24 – Stabilität & Komfort für deinen Lauf
                                            </h2>
                                            <p className='text-gray-800 mt-3'>Der Brooks Adrenaline GTS 24 kombiniert optimale Stabilität mit angenehmer Dämpfung und ist ideal für Läufer mit Überpronation. Die neue DNA Loft v3-Zwischensohle und das verbesserte GuideRails® Support System bieten eine gezielte Unterstützung und sanfte Dämpfung – perfekt für lange Läufe und den täglichen Einsatz.</p>

                                            <h1 className='text-gray-800 mt-5 font-semibold'>Warum der Brooks Adrenaline GTS 24 perfekt für dich ist:</h1>
                                            <p className='text-gray-800 mt-3'>
                                                -Die DNA LOFT v3-Dämpfung sorgt für maximalen Komfort, ist mit Stickstoff angereichert und bietet dir ein weiches Laufgefühl bei geringem Gewicht.
                                            </p>
                                            <p className='text-gray-800 mt-2'>
                                                -Das GuideRails-Unterstützungssystem bietet sanfte Stabilität und hilft dir, dein natürliches Abrollen zu bewahren.
                                            </p>
                                            <p className='text-gray-800 mt-2'>
                                                -Die RoadTack-Außensohle sorgt für besseren Grip und Haltbarkeit, was dir bei jedem Schritt mehr Sicherheit verleiht.
                                            </p>
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
                                        <div className="animate-fadeIn">
                                            <h1 className="text-gray-900 font-semibold text-lg">
                                                Technische Daten:
                                            </h1>
                                            <p className='text-gray-800 mt-3'><span className='font-semibold'>Schuhtyp:</span> Stabilitätsschuh / Allround-Trainingsschuh</p>
                                            <p className='text-gray-800 mt-3'><span className='font-semibold'>Obermaterial:</span>  Engineered Air Mesh für maximale Belüftung & sicheren Sitz</p>
                                            <p className='text-gray-800 mt-3'><span className='font-semibold'>Zwischensohle:</span> DNA Loft v3-Schaumstoff (stickstoffangereichert) für weiche & reaktive Dämpfung</p>
                                            <p className='text-gray-800 mt-3'><span className='font-semibold'>Fersenkappe:</span> Stabiler Halt für Knöchel und Ferse</p>
                                            <p className='text-gray-800 mt-3'><span className='font-semibold'>Laufsohle:</span> Robustes Gummi mit Flexkerben für hohe Haltbarkeit & guten Grip</p>
                                            <p className='text-gray-800 mt-3'><span className='font-semibold'>Sprengung:</span> 12 mm (35.1 mm Ferse / 22.7 mm Vorfuß)</p>
                                            <p className='text-gray-800 mt-3'><span className='font-semibold'>Gewicht:</span> Ca. 269 g (Damen) / 286 g (Herren)</p>
                                            <p className='text-gray-800 mt-3'>🏃‍♂️ Der perfekte Stabilitäts-Laufschuh für alle, die Unterstützung & Komfort bei langen und mittleren Läufen suchen!</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* recommend shoes  */}
                <div>
                    <RecommendShoes />
                </div>
            </div>
        </>
    );
}
