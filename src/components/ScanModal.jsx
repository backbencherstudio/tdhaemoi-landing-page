import React, { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function ScanModal({ onClose, onComplete, side }) {
    const [progress, setProgress] = useState(0);
    const [scanPhase, setScanPhase] = useState('initializing');
    const containerRef = useRef(null);
    const meshRef = useRef(null);
    const sceneRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xffffff)
        sceneRef.current = scene;

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
        const ambientLight = new THREE.AmbientLight(0xfff1e6, 0.4)
        scene.add(ambientLight)

        // Main spotlight 
        const spotLight = new THREE.SpotLight(0xfff1e6, 1.5)
        spotLight.position.set(5, 8, 5)
        spotLight.angle = 0.5
        spotLight.penumbra = 0.8
        spotLight.castShadow = true
        spotLight.decay = 1.2
        scene.add(spotLight)

        // Fill light for shadows
        const fillLight = new THREE.DirectionalLight(0xffe4d6, 0.8)
        fillLight.position.set(-5, 3, -5)
        scene.add(fillLight)

        // Rim light for edge definition
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.4)
        frontLight.position.set(0, 0, 5)
        scene.add(frontLight)

        // Bottom soft light
        const bottomLight = new THREE.PointLight(0xfff1e6, 0.5)
        bottomLight.position.set(0, -3, 0)
        bottomLight.decay = 1.5
        scene.add(bottomLight)

        // Additional accent light
        const accentLight = new THREE.SpotLight(0xffe4d6, 0.6)
        accentLight.position.set(-3, 5, -3)
        accentLight.angle = 0.6
        accentLight.penumbra = 0.7
        scene.add(accentLight)

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.minDistance = 2
        controls.maxDistance = 7
        controls.autoRotate = true
        controls.autoRotateSpeed = 3.0
        controls.enableZoom = true
        controls.enablePan = false
        controls.rotateSpeed = 0.8

        // Load STL
        const loader = new STLLoader()
        loader.load('/3dScanner/3d.stl', (geometry) => {
            geometry.center()
            geometry.computeBoundingBox()

            const size = new THREE.Vector3()
            geometry.boundingBox.getSize(size)
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 4 / maxDim
            geometry.scale(scale, scale, scale)

            const material = new THREE.MeshPhysicalMaterial({
                color: 0xe6c5a9,
                metalness: 0.05,
                roughness: 0.7,
                clearcoat: 0.3,
                clearcoatRoughness: 0.2,
                sheen: 1.0,
                sheenRoughness: 0.8,
                sheenColor: 0xffebe0,
                transmission: 0.05,
                thickness: 0.5
            })
            const mesh = new THREE.Mesh(geometry, material)

            mesh.rotation.x = -Math.PI / 2
            mesh.rotation.z = Math.PI
            mesh.position.set(0, -0.3, 0)
            scene.add(mesh)
            meshRef.current = mesh;
        })

        // Initial camera position for better view
        camera.position.set(4, 4, 4)

        camera.position.set(0, 8, -9)

        // Move animate function after controls setup
        function animate() {
            requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        function handleResize() {
            const width = container.clientWidth
            const height = container.clientHeight
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            container.removeChild(renderer.domElement)
            renderer.dispose()
        }
    }, []);

    // Enhanced progress tracking with phases
    useEffect(() => {
        const totalDuration = 12000;
        const phases = [
            { name: 'initializing', duration: 800, progress: 0 },
            { name: 'calibrating', duration: 1000, progress: 10 },
            { name: 'scanning', duration: 6000, progress: 60 },
            { name: 'processing', duration: 2000, progress: 85 },
            { name: 'finalizing', duration: 500, progress: 100 }
        ];

        let currentPhaseIndex = 0;
        let startTime = Date.now();
        let phaseStartTime = startTime;

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const phaseElapsed = Date.now() - phaseStartTime;
            const currentPhase = phases[currentPhaseIndex];

            if (elapsed >= totalDuration) {
                setProgress(100);
                setScanPhase('completed');
                setTimeout(() => {
                    onComplete();
                }, 500);
                return;
            }

            // Calculate progress within current phase
            const phaseProgress = Math.min(phaseElapsed / currentPhase.duration, 1);
            const currentPhaseStartProgress = currentPhaseIndex > 0 ? phases[currentPhaseIndex - 1].progress : 0;
            const currentPhaseEndProgress = currentPhase.progress;
            const phaseContribution = (currentPhaseEndProgress - currentPhaseStartProgress) * phaseProgress;

            const totalProgress = currentPhaseStartProgress + phaseContribution;

            setProgress(Math.round(totalProgress));
            setScanPhase(currentPhase.name);

            // Update 3D model based on scanning phase
            if (meshRef.current && sceneRef.current) {
                const mesh = meshRef.current;

                if (currentPhase.name === 'scanning') {
                    // Add scanning effect to the model
                    const scanIntensity = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
                    mesh.material.emissive = new THREE.Color(0x62a07b).multiplyScalar(scanIntensity * 0.2);
                    mesh.material.transmission = 0.05 + scanIntensity * 0.1;
                } else if (currentPhase.name === 'processing') {
                    // Processing effect
                    mesh.material.emissive = new THREE.Color(0x4a8063).multiplyScalar(0.3);
                    mesh.material.transmission = 0.15;
                } else {
                    // Reset effects
                    mesh.material.emissive = new THREE.Color(0x000000);
                    mesh.material.transmission = 0.05;
                }
            }

            // Check if we need to move to next phase
            if (phaseElapsed >= currentPhase.duration && currentPhaseIndex < phases.length - 1) {
                currentPhaseIndex++;
                phaseStartTime = Date.now();
            }

            requestAnimationFrame(updateProgress);
        };

        updateProgress();
    }, [onComplete]);

    const getPhaseMessage = () => {
        switch (scanPhase) {
            case 'initializing':
                return 'Initializing 3D scanner and calibrating sensors...';
            case 'calibrating':
                return 'Calibrating scanner for optimal accuracy...';
            case 'scanning':
                return 'Scanning foot geometry and capturing measurements...';
            case 'processing':
                return 'Processing scan data and generating 3D model...';
            case 'finalizing':
                return 'Finalizing results and preparing analysis...';
            case 'completed':
                return 'Scan completed successfully!';
            default:
                return 'Please keep your foot steady on the scanner for accurate results';
        }
    };

    const getPhaseIcon = () => {
        switch (scanPhase) {
            case 'initializing':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'calibrating':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'scanning':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#62a07b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'processing':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
            case 'finalizing':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#62a07b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur rounded-3xl w-full max-w-2xl p-10 shadow-2xl border border-white/20">
                {/* Header with modern design */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#62a07b] to-[#4a8063] flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                            Scanning {side === 'left' ? 'Left' : 'Right'} Foot
                        </h2>
                        <p className="text-gray-500 capitalize">{scanPhase} in progress</p>
                    </div>
                </div>

                {/* 3D Model Container with enhanced styling */}
                <div className="relative">
                    <div className="h-[350px] mb-8 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 overflow-hidden shadow-inner">
                        <div ref={containerRef} className="w-full h-full" />
                    </div>
                    {/* Scanning overlay effect */}
                    <div
                        className="absolute top-0 left-0 right-0 bottom-8 pointer-events-none overflow-hidden rounded-2xl"
                        style={{
                            background: `linear-gradient(180deg, 
                                rgba(98, 160, 123, 0.05), 
                                rgba(74, 128, 99, 0.2), 
                                rgba(98, 160, 123, 0.1)
                            )`,
                            animation: scanPhase === 'scanning' ? 'scanEffect 0.8s ease-in-out infinite' : 'none',
                            boxShadow: 'inset 0 0 30px rgba(98, 160, 123, 0.2)'
                        }}
                    />
                </div>

                {/* Progress Section with enhanced design */}
                <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${scanPhase === 'scanning' ? 'bg-[#62a07b] animate-pulse' :
                                    scanPhase === 'processing' ? 'bg-purple-500 animate-pulse' :
                                        scanPhase === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                }`} />
                            <span className="text-gray-700 capitalize">{scanPhase}</span>
                        </div>
                        <span className="text-[#62a07b] font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${scanPhase === 'scanning' ? 'bg-gradient-to-r from-[#62a07b] to-[#4a8063]' :
                                    scanPhase === 'processing' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                                        scanPhase === 'completed' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                            'bg-gradient-to-r from-blue-500 to-blue-600'
                                }`}
                            style={{
                                width: `${progress}%`,
                                boxShadow: `0 0 20px ${scanPhase === 'scanning' ? 'rgba(98, 160, 123, 0.4)' :
                                        scanPhase === 'processing' ? 'rgba(147, 51, 234, 0.4)' :
                                            scanPhase === 'completed' ? 'rgba(34, 197, 94, 0.4)' :
                                                'rgba(59, 130, 246, 0.4)'
                                    }`
                            }}
                        />
                    </div>
                    {/* Status message with icon */}
                    <div className="flex items-center justify-center gap-2 text-gray-500 bg-gray-50 py-3 px-4 rounded-xl">
                        {getPhaseIcon()}
                        <p className="text-sm">
                            {getPhaseMessage()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Add scanning animation styles */}
            <style jsx>{`
                @keyframes scanEffect {
                    0% {
                        clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
                        opacity: 0.8;
                        backdrop-filter: hue-rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        backdrop-filter: hue-rotate(45deg);
                    }
                    100% {
                        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                        opacity: 0.8;
                        backdrop-filter: hue-rotate(0deg);
                    }
                }
            `}</style>
        </div>
    );
}