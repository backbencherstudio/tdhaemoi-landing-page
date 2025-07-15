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
import ScanningDetailsModal from './ScanningDetailsModal'
import ScanningLoading from './loading/ScanningLoading'
import { User, RotateCcw } from 'lucide-react'
import legsImg from '../../public/scanning/scanning.png'
import { useRouter, useSearchParams } from 'next/navigation'

function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

function ThreeScene({ containerId }) {
    const containerRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Check WebGL support
        if (!checkWebGLSupport()) {
            setError('WebGL is not supported in your browser');
            return;
        }

        try {
            // Scene setup
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);

            // Get container dimensions
            const container = containerRef.current;
            const width = container.clientWidth;
            const height = container.clientHeight;

            // Renderer setup with error handling
            let renderer;
            try {
                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    powerPreference: "high-performance",
                    failIfMajorPerformanceCaveat: true
                });
                renderer.setSize(width, height);
                container.appendChild(renderer.domElement);
            } catch (e) {
                setError('Failed to initialize 3D renderer');
                return;
            }

            // Camera setup
            const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
            camera.position.set(0, 2, 4)

            // Lighting setup
            const ambientLight = new THREE.AmbientLight(0xfff1e6, 0.6)
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
                if (renderer) {
                    renderer.dispose();
                    container.removeChild(renderer.domElement);
                }
                // Clear any animation frames
                if (window.animationFrameId) {
                    cancelAnimationFrame(window.animationFrameId);
                }
                window.removeEventListener('resize', handleResize)
            }
        } catch (e) {
            setError('Failed to initialize 3D scene');
            console.error(e);
        }
    }, [containerId])

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return <div ref={containerRef} id={containerId} className="w-full h-full" />;
}

// Progress Header Component
const ProgressHeader = ({ step }) => {
    // Map internal step to user-facing step number (1-5)
    let userStep = 1;
    if (step === 2) userStep = 1;
    else if (step === 3) userStep = 2;
    else if (step === 4) userStep = 3;
    else if (step === 5) userStep = 4;
    else if (step === 6) userStep = 5;

    const getProgressPercentage = () => (userStep / 5) * 100;

    if (step === 1) return null;

    return (
        <div className="">
            <div className="flex items-center mb-4  border-b p-2">
                <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center mr-4">
                    <User className="text-gray-500" size={28} />
                </div>
                <span className="text-xl font-semibold">Theo Brugger</span>
            </div>
            <div className='px-6 pt-4'>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1 ">
                    <div
                        className="bg-[#62a07b] h-1.5 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                </div>
                <p className="text-center text-xs text-gray-500">{`Schritt ${userStep}/5`}</p>
            </div>
        </div>
    );
};



export default function FootScanner() {
    const [step, setStep] = useState(1);
    const [scanType, setScanType] = useState('barefoot');
    const [showScanningModal, setShowScanningModal] = useState(false);
    const [selectedFoot, setSelectedFoot] = useState('right');
    const [leftFootCompleted, setLeftFootCompleted] = useState(false);
    const [rightFootCompleted, setRightFootCompleted] = useState(false);
    const [nextStepAfterModal, setNextStepAfterModal] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);


    const handleQuestionsClick = () => {
        setLoading(true);
        setTimeout(() => {
            const currentParams = new URLSearchParams(searchParams.toString());
            router.push(`/question?${currentParams.toString()}`);
        }, 1000);
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="border border-gray-300 rounded-lg p-10 h-full flex flex-col items-center justify-center text-center bg-white">
                        <p className="mb-6">Tippe auf <b>„Jetzt starten"</b>, um deinen Scan zu beginnen.<br />Du wirst Schritt für Schritt durch den Prozess geführt.</p>
                        <div className='mt-10'>
                            <button className="bg-[#62a07b] text-sm cursor-pointer hover:bg-[#528c68] text-white px-8 py-2 rounded-full font-semibold" onClick={() => setStep(2)}>
                                Jetzt starten
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="border rounded-lg max-w-md mx-auto bg-white">
                        <ProgressHeader step={step} />
                        <h2 className="text-lg font-semibold mb-4 text-left p-6">1. Wie möchtest du deinen Scan durchführen?</h2>
                        <div className="mb-5 flex flex-col gap-4 md:flex-row justify-between items-center p-6">
                            <div
                                className={`flex items-center px-2 py-2 border rounded-lg cursor-pointer ${scanType === 'barefoot' ? 'border-[#62a07b]' : 'border-gray-300'}`}
                                onClick={() => setScanType('barefoot')}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${scanType === 'barefoot' ? 'border-[#62a07b]' : 'border-gray-400'}`}>
                                    {scanType === 'barefoot' && <div className="w-2.5 h-2.5 bg-[#62a07b] rounded-full"></div>}
                                </div>
                                <span className="text-sm">Barfuß (empfohlen)</span>
                            </div>
                            <div
                                className={`flex items-center px-2 py-2 border rounded-lg cursor-pointer ${scanType === 'socks' ? 'border-[#62a07b]' : 'border-gray-300'}`}
                                onClick={() => setScanType('socks')}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${scanType === 'socks' ? 'border-[#62a07b]' : 'border-gray-400'}`}>
                                    {scanType === 'socks' && <div className="w-2.5 h-2.5 bg-[#62a07b] rounded-full"></div>}
                                </div>
                                <span className="text-sm">Weiße Socken</span>
                            </div>
                        </div>
                        <div className='flex justify-center mt-10'>
                            <button className="w-fit cursor-pointer px-8 py-2 text-sm bg-[#62a07b] hover:bg-[#528c68] text-white  mt-2 rounded-full font-semibold" onClick={() => setStep(3)}>
                                Fortfahren
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white rounded-2xl border relative overflow-hidden">
                        <ProgressHeader step={step} />
                        <div className="flex flex-col md:flex-row items-center justify-center mt-5">
                            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6 flex justify-center">
                                <Image src={legsImg} alt="Hosenbeine hochziehen" width={180} height={180} className="object-contain w-40 h-48" />
                            </div>
                            <div className='px-6 md:px-2'>
                                <p className="mb-6 text-sm xl:text-lg text-start">Zieh nun bitte deine Hosenbeine so weit hoch, dass beide Knöchel gut sichtbar sind.</p>

                            </div>

                        </div>
                        <div className='flex justify-center mt-10'>
                            <button className="bg-[#62a07b] cursor-pointer text-sm hover:bg-[#528c68] text-white px-8 py-2 rounded-full font-semibold" onClick={() => setStep(4)}>
                                Fortfahren
                            </button>
                        </div>
                    </div>
                );

            // left foot scan
            case 4:
                return (
                    <div className="bg-white rounded-2xl  border relative overflow-hidden">
                        <ProgressHeader step={step} />
                        <div className="text-center mt-10">
                            <p className=''>Stelle den <span className='font-bold'>linken Fuß</span> auf die markierte Fläche, den rechten ruhig auf die Abstellfläche daneben – stehe entspannt und tippe auf <span className='font-bold'>„Scan starten“</span>.</p>

                            <div className='flex justify-center mt-10'>
                                <button className="bg-[#62a07b] cursor-pointer text-sm hover:bg-[#528c68] text-white px-8 py-2 rounded-full font-semibold" onClick={() => {
                                    setSelectedFoot('left');
                                    setShowScanningModal(true);
                                    setNextStepAfterModal(5);
                                }}>
                                    Fortfahren
                                </button>
                            </div>
                        </div>
                    </div>
                );

            // right foot scan
            case 5:
                return (
                    <div className="bg-white rounded-2xl w-full border relative overflow-hidden">
                        <ProgressHeader step={step} />
                        <div className="text-center mt-10">
                            <h1 className='mt-5 font-bold text-xl'>Der Scan war efolgreich!</h1>
                            <p className='mt-5 underline'>Wiederhole jetzt dasselbe mit deinem anderen Fuss! </p>
                            <div className='flex justify-center mt-10'>
                                <button className="bg-[#62a07b] cursor-pointer text-sm hover:bg-[#528c68] text-white px-8 py-2 rounded-full font-semibold" onClick={() => {
                                    setSelectedFoot('right');
                                    setShowScanningModal(true);
                                    setNextStepAfterModal(6);
                                }}>
                                    Rechten Fuß scannen
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="bg-white rounded-2xl p-10  border border-gray-100 relative overflow-hidden">
                        <ProgressHeader step={step} />
                        <div className="text-center mt-5">
                            <h2 className="text-xl font-bold mb-4">Glückwunsch – Ihr Fußscan wurde erfolgreich abgeschlossen</h2>
                            <p className="mb-6 text-sm underline">Bitte vergewissern Sie sich, dass alle Scanbilder scharf und vollständig sind, und fahren Sie anschließend mit Ihrer individuellen Versorgung fort.</p>
                            <button className="bg-[#62a07b] cursor-pointer text-sm hover:bg-[#528c68] text-white px-8 py-2 rounded-full font-semibold" onClick={handleQuestionsClick}>
                                Fortfahren
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    const handleScanComplete = () => {
        setShowScanningModal(false);
        if (selectedFoot === 'left') {
            setLeftFootCompleted(true);
        } else if (selectedFoot === 'right') {
            setRightFootCompleted(true);
        }
        if (nextStepAfterModal) {
            setStep(nextStepAfterModal);
            setNextStepAfterModal(null);
        }
    };

    return (
        <>
            <div className='flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
                <div className="w-full py-6 border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center items-center">
                            <Link href='/'>
                                <Image src={logo} alt="Logo" height={500} width={500} className="h-20 w-auto" />
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Title and subtitle at the top */}
                <div className="mt-12  text-center">
                    <h1 className="text-4xl font-bold mb-2">Dein Scan. Dein Vorteil.</h1>
                    <p className="text-lg text-gray-700">Folge den Schritten auf dem Bildschirm und schaffe die Basis für deine individuellen Empfehlungen<br />- einfach, schnell und auf dich abgestimmt.</p>
                </div>
                <div className='flex-1 flex justify-center py-10'>
                    <div className="container max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start px-2">
                            {/* Left 3D Model */}
                            <div className="w-full text-center">
                                <div className="flex rounded-md flex-col justify-center items-center h-[450px] relative transition-all duration-300 bg-white ">
                                    <ThreeScene containerId="leftFootContainer" />
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    {leftFootCompleted ? (
                                        <>
                                            <button
                                                className="bg-[#62a07b] text-white px-6 py-2 rounded-full font-semibold cursor-default border border-[#62a07b]"
                                                disabled
                                            >
                                                SCAN ERFOLGREICH
                                            </button>
                                            <button
                                                className="inline-flex items-center justify-center w-8 h-8 border cursor-pointer border-black rounded-full"
                                                onClick={() => {
                                                    setSelectedFoot('left');
                                                    setShowScanningModal(true);
                                                    setNextStepAfterModal(step);
                                                }}
                                                title="Erneut scannen"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedFoot('left')}
                                            className={`border px-6 py-2 rounded-full
                                            ${selectedFoot === 'left' ? 'bg-[#62a07b] text-white' : 'text-gray-700'}
                                        `}
                                        >
                                            {selectedFoot === 'left' ? 'LINKER FUSS AUSGEWÄHLT' : 'LINKER FUSS AUSWÄHLEN'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Center Content */}
                            <div className="lg:max-w-2xl mx-auto w-full h-fit md:h-[450px] flex">
                                {renderStepContent()}
                            </div>
                            {/* Right 3D Model */}
                            <div className="w-full text-center">
                                <div className="flex rounded-md flex-col justify-center items-center h-[450px] relative transition-all duration-300 bg-white">
                                    <ThreeScene containerId="rightFootContainer" />
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    {rightFootCompleted ? (
                                        <>
                                            <button
                                                className="bg-[#62a07b] text-white px-6 py-2 rounded-full font-semibold cursor-default border border-[#62a07b]"
                                                disabled
                                            >
                                                SCAN ERFOLGREICH
                                            </button>
                                            <button
                                                className="inline-flex items-center justify-center w-8 h-8 border cursor-pointer border-black rounded-full"
                                                onClick={() => {
                                                    setSelectedFoot('right');
                                                    setShowScanningModal(true);
                                                    setNextStepAfterModal(step);
                                                }}
                                                title="Erneut scannen"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedFoot('right')}
                                            className={`border px-6 py-2 rounded-full
                                            ${selectedFoot === 'right' ? 'bg-[#62a07b] text-white' : 'text-gray-700'}
                                        `}
                                        >
                                            {selectedFoot === 'right' ? 'RECHTER FUSS AUSGEWÄHLT' : 'RECHTEN FUSS AUSWÄHLEN'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showScanningModal && (
                    <ScanModal
                        onClose={() => setShowScanningModal(false)}
                        onComplete={handleScanComplete}
                        side={selectedFoot}
                    />
                )}
            </div>
            {loading && (
                <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
                    <ScanningLoading />
                </div>
            )}
        </>
    );
}