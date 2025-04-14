"use client"
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function Settings() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('profile')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        if (user) {
            setUsername(user.name || '')
            setEmail(user.email || '')
        }
    }, [user])

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission logic here
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h1>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-4">
                    <button
                        className={`py-2 px-4 border-b-2 font-medium transition-colors ${
                            activeTab === 'profile'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`py-2 px-4 border-b-2 font-medium transition-colors ${
                            activeTab === 'security'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('security')}
                    >
                        Security
                    </button>
                </div>
            </div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-lg font-medium text-gray-800 mb-5">Personal Information</h2>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-10 mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium shadow-sm"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            )}

            {/* Security Tab Content */}
            {activeTab === 'security' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-lg font-medium text-gray-800 mb-5">Change Password</h2>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="pl-10 mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pl-10 mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                                        placeholder="Enter new password"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10 mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium shadow-sm"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
