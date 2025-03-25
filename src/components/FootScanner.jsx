'use client'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import logo from '../../public/categoryData/logo.png'
import Link from 'next/link'
import Image from 'next/image'
import SuccessModal from './SuccessModal'
import ScanModal from './ScanModal'  

function ThreeScene({ containerId }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xffffff)

        // Get container dimensions
        const container = containerRef.current;
        const width = container.clientWidth
        const height = container.clientHeight

        // Camera setup
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
        camera.position.set(0, 2, 4)

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(width, height)
        container.appendChild(renderer.domElement)

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xfff1e6, 0.6) // Increased ambient intensity
        scene.add(ambientLight)

        // Main spotlight with increased intensity
        const spotLight = new THREE.SpotLight(0xfff1e6, 1.5)
        spotLight.position.set(5, 8, 5)
        spotLight.angle = 0.5
        spotLight.penumbra = 0.8
        spotLight.castShadow = true
        spotLight.decay = 1.2
        scene.add(spotLight)

        // Brighter fill light
        const fillLight = new THREE.DirectionalLight(0xffe4d6, 0.8)
        fillLight.position.set(-5, 3, -5)
        scene.add(fillLight)

        // Additional front light for better illumination
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.4)
        frontLight.position.set(0, 0, 5)
        scene.add(frontLight)

        // Softer bottom light with increased intensity
        const bottomLight = new THREE.PointLight(0xfff1e6, 0.5)
        bottomLight.position.set(0, -3, 0)
        bottomLight.decay = 1.5
        scene.add(bottomLight)

        // Brighter accent light
        const accentLight = new THREE.SpotLight(0xffe4d6, 0.6)
        accentLight.position.set(-3, 5, -3)
        accentLight.angle = 0.6
        accentLight.penumbra = 0.7
        scene.add(accentLight)

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.minDistance = 2
        controls.maxDistance = 7

        // Load STL
        const loader = new STLLoader()
        // Update material in STL loader
        loader.load('/3dScanner/3d.stl', (geometry) => {
            geometry.center()
            geometry.computeBoundingBox()
            
            const size = new THREE.Vector3()
            geometry.boundingBox.getSize(size)
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 4 / maxDim
            geometry.scale(scale, scale, scale)

            const material = new THREE.MeshPhysicalMaterial({
                color: 0xe6c5a9,  // Neutral skin tone
                metalness: 0.05,
                roughness: 0.7,
                clearcoat: 0.2,
                clearcoatRoughness: 0.3,
                sheen: 0.8,
                sheenRoughness: 0.9,
                sheenColor: 0xffebe0,
                transmission: 0.05,
                thickness: 0.5
            })
            const mesh = new THREE.Mesh(geometry, material)
            
            // Adjusted rotation and position to match the reference image
            mesh.rotation.x = -Math.PI / 2
            mesh.rotation.z = Math.PI  
            mesh.position.set(0, -0.5, 0)  
            scene.add(mesh)
        })

        // Camera setup adjustment
        camera.position.set(0, 8, -9)  
        // Animation loop
        function animate() {
            requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        // Handle window resize
        function handleResize() {
            const width = container.clientWidth
            const height = container.clientHeight
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height)
        }
        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
            container.removeChild(renderer.domElement)
            renderer.dispose()
        }
    }, [containerId])

    return <div ref={containerRef} id={containerId} className="w-full h-full" />;
}


export default function FootScanner() {
    const [scanStep, setScanStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showScanningModal, setShowScanningModal] = useState(false);
    const [leftFootCompleted, setLeftFootCompleted] = useState(false);
    const [rightFootCompleted, setRightFootCompleted] = useState(false);
    
    const handleRetry = () => {
        if (scanStep === 1) {
            setLeftFootCompleted(false);
        } else {
            setRightFootCompleted(false);
        }
    };
    
    const handleScanClick = () => {
        setShowScanningModal(true);
    };

    const handleScanComplete = () => {
        setShowScanningModal(false);
        if (scanStep === 1) {
            setLeftFootCompleted(true);
            setScanStep(2);
        } else {
            setRightFootCompleted(true);
            setShowSuccessModal(true);
        }
    };

    return (
        <div className='flex flex-col min-h-screen bg-gray-50'>
            {/* Header Section */}
            <div className="w-full bg-black py-6 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="text-[#62a07b] text-4xl font-bold">
                        <div className='flex justify-center items-center'>
                            <Link href='/'>
                                <Image
                                    src={logo}
                                    alt="Logo"
                                    height={500}
                                    width={500}
                                    className="h-20 w-auto"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
 
            {/* Main Content */}
            <div className='flex-1 flex justify-center items-center py-10'>
                <div className="container max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* Left Foot Section */}
                        <div className="w-full px-2">
                            {/* Left Foot Section */}
                            <div className={`flex border-3 ${scanStep === 1 
                                ? 'border-[#62a07b] shadow-lg ring-2 ring-[#62a07b]/20' 
                                : 'border-[#62a07b]'} 
                                flex-col justify-center items-center h-[330px] relative rounded-xl 
                                transition-all duration-300 bg-white`}>
                                <ThreeScene containerId="leftFootContainer" />
                                {scanStep === 1 && !leftFootCompleted ? (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-[#62a07b] text-white px-3 py-1 rounded-full text-sm">
                                            Active
                                        </span>
                                    </div>
                                ) : leftFootCompleted && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Completed
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Show buttons for left foot when it's active or completed */}
                            {(scanStep === 1 || leftFootCompleted) && (
                                <div className="space-y-3 mt-4">
                                    {leftFootCompleted ? (
                                        <button 
                                            onClick={() => {
                                                handleRetry();
                                                setScanStep(1);
                                            }}
                                            className="bg-gray-500 hover:bg-gray-600 transform hover:scale-[1.02] 
                                                transition-all duration-300 cursor-pointer text-white px-8 
                                                py-2 rounded-full w-full text-sm md:text-base font-semibold 
                                                shadow-md"
                                        >
                                            RETRY SCAN
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handleScanClick}
                                            className="bg-[#62a07b] hover:bg-[#528c68] transform hover:scale-[1.02]
                                                transition-all duration-300 cursor-pointer text-white px-8 
                                                py-3 rounded-full w-full text-sm md:text-base font-semibold 
                                                shadow-md"
                                        >
                                            START SCAN
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Instructions Section */}
                        <div className="w-full px-4 order-first md:order-none">
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                                    3D-SCANNER ANLEITUNG
                                </h2>
                                <div className="space-y-6 text-sm md:text-base">
                                    {scanStep === 1 ? (
                                        <>
                                            <div className="flex items-center gap-3 text-[#62a07b]">
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#62a07b]/10 font-bold">1</span>
                                                <h3 className="font-semibold">Linken Fuß scannen</h3>
                                            </div>
                                            <p className="text-gray-600 ml-11">
                                                Stellen Sie sich so, dass Ihr linker Fuß direkt auf dem Scanner steht, 
                                                während Ihr rechter Fuß auf der erhöhten Plattform rechts neben dem Scanner platziert wird.
                                            </p>
                                            <p className="text-gray-600 ml-11">
                                                Drücken Sie den „Scan"-Button auf dem Bildschirm und warten Sie, 
                                                bis der Fortschrittsbalken vollständig geladen ist.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3 text-[#62a07b]">
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#62a07b]/10 font-bold">2</span>
                                                <h3 className="font-semibold">Rechten Fuß scannen</h3>
                                            </div>
                                            <p className="text-gray-600 ml-11">
                                                Platzieren Sie nun Ihren rechten Fuß auf dem Scanner und den linken 
                                                Fuß auf der erhöhten Plattform.
                                            </p>
                                            <p className="text-gray-600 ml-11">
                                                Drücken Sie erneut den „Scan"-Button und warten Sie, 
                                                bis der Fortschrittsbalken vollständig geladen ist.
                                            </p>
                                        </>
                                    )}
                                    <div className="bg-[#62a07b]/10 p-4 rounded-lg mt-4">
                                        <p className="text-[#62a07b] font-semibold">
                                            Wichtig: Bleiben Sie während des Scans ruhig stehen.
                                        </p>
                                    </div>
                                    <div className="flex justify-center">
                                        <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                                            Schritt {scanStep} von 2
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Foot Section */}
                        <div className="w-full px-2">
                            <div className={`flex border-3 ${scanStep === 2 
                                ? 'border-[#62a07b] shadow-lg ring-2 ring-[#62a07b]/20' 
                                : scanStep > 2 || rightFootCompleted ? 'border-[#62a07b]' : 'border-gray-300'} 
                                flex-col justify-center items-center h-[330px] relative rounded-xl 
                                transition-all duration-300 bg-white`}>
                                <ThreeScene containerId="rightFootContainer" />
                                {scanStep === 2 && !rightFootCompleted ? (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-[#62a07b] text-white px-3 py-1 rounded-full text-sm">
                                            Active
                                        </span>
                                    </div>
                                ) : rightFootCompleted && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Completed
                                        </span>
                                    </div>
                                )}
                            </div>
                            {(scanStep === 2 || rightFootCompleted) && (
                                <div className="space-y-3 mt-4">
                                    {rightFootCompleted ? (
                                        <button 
                                            onClick={() => {
                                                handleRetry();
                                                setScanStep(2);
                                                setShowSuccessModal(false);
                                            }}
                                            className="bg-gray-500 hover:bg-gray-600 transform hover:scale-[1.02] 
                                                transition-all duration-300 cursor-pointer text-white px-8 
                                                py-2 rounded-full w-full text-sm md:text-base font-semibold 
                                                shadow-md"
                                        >
                                            RETRY SCAN
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleScanClick}
                                            className="bg-[#62a07b] hover:bg-[#528c68] transform hover:scale-[1.02]
                                                transition-all duration-300 cursor-pointer text-white px-8 
                                                py-3 rounded-full w-full text-sm md:text-base font-semibold 
                                                shadow-md"
                                        >
                                            START SCAN
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

          

            {/* Scanning Modal */}
            {showScanningModal && (
                <ScanModal 
                    onClose={() => setShowScanningModal(false)}
                    onComplete={handleScanComplete}
                    side={scanStep === 1 ? 'left' : 'right'}
                />
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal onClose={() => setShowSuccessModal(false)} />
            )}
        </div>
    )
}
