import React, { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function ScanModal({ onClose, onComplete, side }) {
    const [progress, setProgress] = useState(0);
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

    useEffect(() => {
        const duration = 25000;
        const interval = 50;
        const steps = duration / interval;
        const increment = 100 / steps;

        const interval_id = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment;

                if (next >= 100) {
                    clearInterval(interval_id);
                    setTimeout(() => {
                        onComplete();
                    }, 1000);
                    return 100;
                }
                const eased = Math.pow(next / 100, 0.85) * 100;
                return Math.min(eased, 100);
            });
        }, interval);

        return () => clearInterval(interval_id);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur rounded-3xl w-full max-w-3xl p-10 shadow-2xl border border-white/20">
                {/* Header with modern design */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#62a07b] to-[#4a8063] flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-1">
                            Scanning {side === 'left' ? 'Left' : 'Right'} Foot
                        </h2>
                        <p className="text-gray-500">High-precision 3D foot scanning in progress</p>
                    </div>
                </div>

                {/* 3D Model Container with enhanced styling */}
                <div className="relative">
                    <div className="h-[450px] mb-8 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 overflow-hidden shadow-inner">
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
                            animation: 'scanEffect 0.8s ease-in-out infinite',
                            boxShadow: 'inset 0 0 30px rgba(98, 160, 123, 0.2)'
                        }}
                    />
                </div>

                {/* Progress Section with enhanced design */}
                <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#62a07b] animate-pulse" />
                            <span className="text-gray-700">Scanning in progress</span>
                        </div>
                        <span className="text-[#62a07b] font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-[#62a07b] to-[#4a8063] h-full rounded-full transition-all duration-300"
                            style={{ 
                                width: `${progress}%`,
                                boxShadow: '0 0 20px rgba(98, 160, 123, 0.4)'
                            }}
                        />
                    </div>
                    {/* Status message with icon */}
                    <div className="flex items-center justify-center gap-2 text-gray-500 bg-gray-50 py-3 px-4 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#62a07b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm">
                            Please keep your foot steady on the scanner for accurate results
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