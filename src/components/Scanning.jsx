import React, { useState, useRef } from 'react'
import { IoClose } from "react-icons/io5"
import Image from 'next/image'
import leftImg from '../../public/legs/left.png'
import rightImg from '../../public/legs/right.png'

export default function Scanning({ onClose }) {
    const [leftScanned, setLeftScanned] = useState(false);
    const [rightScanned, setRightScanned] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [currentSide, setCurrentSide] = useState(null);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImages, setCapturedImages] = useState({ left: null, right: null });

    const startScanning = async (side) => {
        setCurrentSide(side);
        setScanning(true);
        setProgress(0);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            videoRef.current.srcObject = stream;
            videoRef.current.style.display = 'block';
            await videoRef.current.play();

            // Start progress bar
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        captureImage(side, stream);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);

        } catch (err) {
            console.error("Error accessing camera:", err);
        }
    };

    const removeScan = (side) => {
        setCapturedImages(prev => ({ ...prev, [side]: null }));
        if (side === 'left') {
            setLeftScanned(false);
            setRightScanned(false); // Reset right scan as well since it depends on left
        } else {
            setRightScanned(false);
        }
    };

    // Update the captureImage function
    const captureImage = (side, stream) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        
        // Mirror both left and right foot images
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        
        ctx.drawImage(video, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        const capturedImage = canvas.toDataURL('image/png');
        setCapturedImages(prev => ({ ...prev, [side]: capturedImage }));

        stream.getTracks().forEach(track => track.stop());
        setScanning(false);
        
        if (side === 'left') {
            setLeftScanned(true);
        } else {
            setRightScanned(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-black overflow-y-auto flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg w-[90%] max-w-[1200px] p-4 md:p-8 my-auto">
                
                <div className="text-right mb-4">
                    <button onClick={onClose} className="text-gray-600 cursor-pointer hover:text-gray-800">
                        <IoClose size={24} />
                    </button>
                </div>

                <div className="w-full">
                    {/* Left Foot Section */}
                    <div className="w-full md:w-[30%] inline-block align-top px-2 mb-6">
                        <div className='flex border-2 border-gray-600 flex-col justify-center items-center h-[330px] relative'>
                            {currentSide === 'left' && scanning ? (
                                <video 
                                    ref={videoRef}
                                    className="w-[250px] h-[330px] object-cover"
                                    style={{ transform: currentSide === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
                                />
                            ) : capturedImages.left ? (
                                <div className="relative">
                                    <img src={capturedImages.left} alt="Captured left foot" className='w-[250px] h-[330px] object-cover' />
                                    <button 
                                        onClick={() => removeScan('left')}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <IoClose size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Image alt='left-leg' src={leftImg} width={200} height={300} className='w-[200px] h-[330px]' />
                            )}
                        </div>
                        {currentSide === 'left' && scanning && (
                            <div className="w-full bg-gray-200 h-2 mt-2 rounded">
                                <div 
                                    className="bg-[#62a07b] h-full rounded transition-all duration-200"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                        <button 
                            onClick={() => startScanning('left')}
                            disabled={scanning}
                            className={`bg-[#62a07b] text-white px-8 py-2 rounded-full w-full text-sm md:text-base mt-4 
                                ${scanning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {leftScanned ? 'RESCAN' : 'SCAN'}
                        </button>
                    </div>

                    {/* Instructions Section */}
                    <div className="w-full md:w-[40%] inline-block align-top px-4 mb-6">
                        <h2 className="text-lg md:text-xl font-semibold text-center mb-4">WIE FUNKTIONIERTS?</h2>
                        <div className="space-y-3 text-sm md:text-base">
                            <p>1) Linken Fuß mittig auf die Scan-Fläche stellen und auf gleichmäßigen Abstand achten.</p>
                            <p>2) Still stehen und „Scan starten" drücken. Warten, bis der Balken voll ist.</p>
                            <p>3) Nach dem Scan den rechten Fuß scannen und den Vorgang wiederholen.</p>
                            <p className="font-semibold">Wichtig: Nicht bewegen, um ein genaues Ergebnis zu erhalten.</p>
                        </div>
                    </div>

                    {/* Right Foot Section */}
                    <div className="w-full md:w-[30%] inline-block align-top px-2 mb-6">
                        <div className='flex border-2 border-gray-600 flex-col justify-center items-center h-[330px] relative'>
                            {currentSide === 'right' && scanning ? (
                                <video 
                                    ref={videoRef}
                                    className="w-[250px] h-[330px] object-cover"
                                    style={{ transform: 'scaleX(-1)' }}  // Mirror the right foot video
                                />
                            ) : capturedImages.right ? (
                                <div className="relative">
                                    <img src={capturedImages.right} alt="Captured right foot" className='w-[250px] h-[330px] object-cover' />
                                    <button 
                                        onClick={() => removeScan('right')}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <IoClose size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Image alt='right-leg' src={rightImg} width={200} height={300} className='w-[200px] h-[330px]' />
                            )}
                        </div>
                        {currentSide === 'right' && scanning && (
                            <div className="w-full bg-gray-200 h-2 mt-2 rounded">
                                <div 
                                    className="bg-[#62a07b] h-full rounded transition-all duration-200"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                        <button 
                            onClick={() => startScanning('right')}
                            disabled={scanning || !leftScanned}
                            className={`bg-[#62a07b] text-white px-8 py-2 rounded-full w-full text-sm md:text-base mt-4 
                                ${(scanning || !leftScanned) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {rightScanned ? 'RESCAN' : 'SCAN'}
                        </button>
                    </div>
                </div>

                {/* Hidden video and canvas elements */}
                <video ref={videoRef} className="hidden" />
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    )
}
