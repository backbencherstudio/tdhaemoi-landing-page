import React, { useState } from 'react'
import { IoClose } from "react-icons/io5"
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

export default function FormModal({ isOpen, onClose, categoryData }) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            acceptTerms: false
        }
    })

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const submissionData = {
                ...data,
                categoryId: categoryData.id,
                categoryTitle: categoryData.title,
                selectedCategory: categoryData.selectedSubCategory
            }
            router.push('/foot-scanning');
        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleModalClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden">
                <div className="bg-[#5B9279] p-8 relative">
                    <button
                        onClick={handleModalClose}
                        className="absolute cursor-pointer top-4 right-4 text-white hover:opacity-80"
                    >
                        <IoClose size={24} />
                    </button>
                    <h2 className="text-white text-2xl font-semibold text-center uppercase leading-relaxed">
                        Bevor wir Ihren individuellen 3D-Scan durchführen, benötigen wir einige persönliche Daten.
                    </h2>
                </div>
                <div className="p-8">
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block mb-3 text-sm">Vorname</label>
                                <input
                                    {...register('firstName', { required: true })}
                                    className="w-full p-3 rounded border border-black"
                                />
                                {errors.firstName && <span className="text-red-500 text-sm">Dieses Feld ist erforderlich</span>}
                            </div>
                            <div>
                                <label className="block mb-3 text-sm">Nachname</label>
                                <input
                                    {...register('lastName', { required: true })}
                                    className="w-full p-3 rounded border border-black"
                                />
                                {errors.lastName && <span className="text-red-500 text-sm">Dieses Feld ist erforderlich</span>}
                            </div>
                        </div>
                        <div>
                            <label className="block mb-3 text-sm">E-Mail</label>
                            <input
                                {...register('email', {
                                    required: true,
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="w-full p-3 rounded border border-black"
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message || 'Dieses Feld ist erforderlich'}</span>}
                        </div>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                {...register('acceptTerms', { required: true })}
                                className="mt-1 w-4 h-4 rounded border-white"
                            />
                            <label className="text-sm leading-tight">
                                Ich stimme den Datenschutzrichtlinien zu und bin einverstanden Emails zu bekommen um die App FeetF1rst zu aktivieren
                            </label>
                        </div>
                        {errors.acceptTerms && <span className="text-red-500 text-sm block">Sie müssen die Bedingungen akzeptieren</span>}
                        <div className="flex justify-center mt-12">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#62a07b] text-white px-12 py-3 rounded-full text-lg font-medium uppercase hover:bg-opacity-90 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Scanning...</span>
                                    </div>
                                ) : (
                                    'Scan Starten'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}