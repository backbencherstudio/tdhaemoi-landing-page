'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../Navbar/Navbar';
import { RiArrowLeftSLine } from "react-icons/ri";
import icon from "../../../public/shoesDetails/icon.png"
import icon1 from "../../../public/shoesDetails/icon1.png"
import icon2 from "../../../public/shoesDetails/icon2.png"
import icon3 from "../../../public/shoesDetails/icon3.png"
import icon4 from "../../../public/shoesDetails/icon4.png"
import footImg from "../../../public/shoesDetails/footImg.png"
import scannerImg from "../../../public/shoesDetails/scanner.png"
import RecommendShoes from './Recommend';
import { IoChevronDown, IoChevronBack, IoChevronForward } from "react-icons/io5";


export default function ShoesDetails({ params }) {
    const [shoe, setShoe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('36');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('app');
    const id = params?.id;

    const sizes = ['36', '38', '40', '42', '44'];

    useEffect(() => {
        fetchShoeDetails();
    }, [id]);

    const fetchShoeDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            // Fetch all data sources
            const [shoesResponse, fitShoesResponse, recommendShoesRes] = await Promise.all([
                fetch('/data/data.json'),
                fetch('/data/fitShoes.json'),
                fetch('/data/recommendShoes.json')
            ]);

            // Parse JSON responses
            const [shoesData, fitShoesData, recommendShoes] = await Promise.all([
                shoesResponse.json(),
                fitShoesResponse.json(),
                recommendShoesRes.json()
            ]);

            // Combine all shoes data with unique IDs
            const allShoes = [
                ...shoesData.map(s => ({ ...s, source: 'regular' })),
                ...fitShoesData.map(s => ({ ...s, source: 'fit' })),
                ...recommendShoes.map(s => ({ ...s, source: 'recommended' }))
            ];

            // Find the requested shoe
            const foundShoe = allShoes.find(s => s.id.toString() === id.toString());

            if (foundShoe) {
                setShoe(foundShoe);
            }
        } catch (error) {
            console.error('Error fetching shoe details:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const demoImages = shoe ? [
        shoe.image,
        shoe.image,
        shoe.image,
        shoe.image
    ] : [];

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? demoImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === demoImages.length - 1 ? 0 : prev + 1));
    };

    // Calculate visible thumbnails
    const getVisibleThumbnails = () => {
        const visibleIndexes = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % demoImages.length;
            visibleIndexes.push(index);
        }
        return visibleIndexes;
    };

    const handleTabClick = (tabName) => {
        setActiveTab(activeTab === tabName ? null : tabName);
    };

    return (
        <>
            <Navbar />
            <div className="w-full px-4 py-8 ">
                <Link href="/shoes" className="text-green-600 flex hover:text-green-800 mb-6 items-center">
                    <RiArrowLeftSLine className='text-2xl' /> Back to Shoes
                </Link>

                <div className="grid lg:grid-cols-2 gap-8 mt-6">
                    <div className="flex md:flex-row flex-col gap-4 h-full ">
                        {/* Thumbnails Section - Different for mobile and desktop */}
                        <div className="relative flex md:flex-col flex-row order-2 md:order-1">
                            {/* Mobile Thumbnails */}
                            <div className="md:hidden relative flex items-center w-full">
                                <button
                                    onClick={handlePrevious}
                                    className="absolute left-0 z-10 h-full px-2 flex items-center justify-center"
                                    aria-label="Previous"
                                >
                                    <IoChevronBack className="text-2xl text-gray-600" />
                                </button>

                                <div className="flex justify-center items-center w-full gap-2 px-8">
                                    {getVisibleThumbnails().map((index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`bg-[#e8e8e8] rounded-lg p-2 transition-all w-20 flex-shrink-0
                                                ${selectedImage === index ? 'ring-2  ring-green-500' : ''}`}
                                        >
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={demoImages[index]}
                                                    fill
                                                    sizes="80px"
                                                    alt={`View ${index + 1}`}
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="absolute right-0 z-10 h-full px-2 flex items-center justify-center"
                                    aria-label="Next"
                                >
                                    <IoChevronForward className="text-2xl text-gray-600" />
                                </button>
                            </div>

                            {/* Desktop Thumbnails - Original vertical layout */}
                            <div className="hidden md:flex md:flex-col px-1 py-1 gap-5 overflow-y-auto max-h-[600px]">
                                {demoImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`bg-[#e8e8e8] rounded-lg p-2 transition-all w-20 flex-shrink-0
                                            ${selectedImage === index ? 'ring-2  ring-green-500' : ''}`}
                                    >
                                        <div className="relative aspect-square">
                                            <Image
                                                src={img}
                                                fill
                                                sizes="80px"
                                                alt={`View ${index + 1}`}
                                                className="object-contain p-1"
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main image - Updated classes */}
                        <div className="flex-1 bg-[#e8e8e8] rounded-lg p-4 order-1 md:order-2 relative flex items-center justify-center min-h-[400px] md:min-h-[600px]">
                            <div className="relative w-full h-full">
                                <Image
                                    src={demoImages[selectedImage]}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                                    alt={shoe.name}
                                    className="object-contain p-2 md:p-4"
                                    priority
                                    quality={100}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Details section - Updated classes */}
                    <div className="space-y-6 order-2 max-w-2xl">
                        <h1 className="text-3xl font-bold">{shoe.name}</h1>
                        <div className="space-y-2">
                            <p className="text-lg">{shoe.description}</p>
                            <p className="text-2xl font-semibold">{(shoe.price / 100).toFixed(2)}€</p>
                            <p className="text-lg">{shoe.Farbe ? `${shoe.Farbe} Farben` : '3 Farben'}</p>
                        </div>

                        {/* Color variants */}
                        <div className="flex gap-4 overflow-x-auto md:overflow-x-visible">
                            <div className="bg-[#e8e8e8] rounded-lg p-2 w-24 h-24 flex-shrink-0">
                                <Image
                                    src={shoe.image}
                                    width={100}
                                    height={100}
                                    alt="Color variant 1"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="bg-[#e8e8e8] rounded-lg p-2 w-24 h-24 flex-shrink-0">
                                <Image
                                    src={shoe.image}
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
                                        className=" text-white font-semibold text-xl px-4 py-2 rounded flex items-center gap-2"
                                    >
                                        {selectedSize || '36'}
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
                                        <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg z-10">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => {
                                                        setSelectedSize(size);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
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
                            <div className="max-w-md mx-auto">
                                <p className="text-gray-600">FeetF1rst empfiehlt  Ihnen Größe 36 und erzielt damit eine fast ideale Passform.
                                    Der Schuh passt perfekt in Länge und Breite.Insgesamt eine sehr gute Wahl für dich!</p>
                            </div>
                        </div>

                        {/* Right column - QR Scanner */}


                        {/* tab use */}
                        <div className='px-5'>
                            <div className='flex flex-col gap-10'>
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
