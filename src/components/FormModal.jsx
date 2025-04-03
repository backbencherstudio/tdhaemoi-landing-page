import React, { useState } from 'react'
import { IoClose } from "react-icons/io5"
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PrivacyPolicyModal from './PrivacyPolicyModal/PrivacyPolicyModal'
import { IoIosArrowBack } from 'react-icons/io'

export default function FormModal({ isOpen, onClose, category, categoryData }) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            acceptTerms: true,
            acceptNewsletter: true
        }
    })

    const normalizedData = categoryData || {
        id: category?.id,
        title: category?.title,
        slug: category?.slug,
        selectedSubCategory: null,
    }

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get questions from the category data
            const categoryQuestions = category?.questions || categoryData?.selectedSubCategory?.questions || [];

            // Create full submission data
            const submissionData = {
                ...data,
                categoryId: normalizedData.id,
                categoryTitle: normalizedData.title,
                categorySlug: normalizedData.slug,
                selectedSubCategory: normalizedData.selectedSubCategory,
                questions: categoryQuestions
            }

            // Store full submission data in sessionStorage
            sessionStorage.setItem('formSubmissionData', JSON.stringify(submissionData));

            // Create URL params with all necessary category info
            const urlParams = new URLSearchParams({
                categoryId: normalizedData.id,
                categoryTitle: normalizedData.title,
                categorySlug: normalizedData.slug || '',
            });

            if (normalizedData.selectedSubCategory?.id) {
                urlParams.append('subCategoryId', normalizedData.selectedSubCategory.id);
                urlParams.append('subCategoryTitle', normalizedData.selectedSubCategory.title);
                urlParams.append('subCategorySlug', normalizedData.selectedSubCategory.slug || '');
            }

            router.push(`/foot-scanning?${urlParams.toString()}`);
        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleModalClose = () => {
        reset();
        setShowPrivacyPolicy(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden">
                <div className="bg-[#5B9279] py-4 relative">
                    {showPrivacyPolicy ? (
                        <>
                            <button
                                onClick={() => setShowPrivacyPolicy(false)}
                                className="absolute cursor-pointer top-1/2 -translate-y-1/2 left-4 text-white hover:opacity-80"
                            >
                                <IoIosArrowBack className='text-xl' />
                            </button>

                            <h2 className="text-white text-2xl font-semibold text-center uppercase leading-relaxed px-16">
                                Datenschutzrichtlinie
                            </h2>
                            <button
                                onClick={handleModalClose}
                                className="absolute cursor-pointer top-4 right-4 text-white hover:opacity-80"
                            >
                                <IoClose size={24} />
                            </button>

                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleModalClose}
                                className="absolute cursor-pointer top-4 right-4 text-white hover:opacity-80"
                            >
                                <IoClose size={24} />
                            </button>

                            <h2 className="text-white text-2xl font-semibold text-center uppercase leading-relaxed">
                                Bevor wir Ihren individuellen 3D-Scan durchführen, benötigen wir einige persönliche Daten.
                            </h2>
                        </>
                    )}
                </div>

                {showPrivacyPolicy ? (
                    // Privacy Policy Content
                    <div className="p-8 max-h-[60vh] overflow-y-auto">
                        <div>
                            <PrivacyPolicyModal />
                        </div>
                    </div>
                ) : (
                    // Existing Form Content
                    <div className="p-8">
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                            <div className="flex items-center justify-center gap-10 mb-8">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="male"
                                        {...register('gender', { required: true })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-lg">Mann</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="female"
                                        {...register('gender', { required: true })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-lg">Frau</span>
                                </label>
                            </div>
                            {errors.gender && <span className="text-red-500 text-sm block text-center">Bitte wählen Sie Ihr Geschlecht</span>}
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
                                        // required: true,
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className="w-full p-3 rounded border border-black"
                                />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email.message || 'Dieses Feld ist erforderlich'}</span>}
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        {...register('acceptTerms', { required: true })}
                                        className="min-w-[20px] h-5 mt-[3px] rounded border-gray-300 accent-[#5B9279] cursor-pointer"
                                    />
                                    <span className="text-sm leading-[22px]">
                                        Hiermit erkläre ich mein Einverständnis zur Erhebung und Verarbeitung meiner personenbezogenen Daten gemäß der Datenschutzrichtlinie von FeetF1rst.
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        {...register('acceptNewsletter', { required: true })}
                                        className="min-w-[20px] h-5 mt-[3px] rounded border-gray-300 accent-[#5B9279] cursor-pointer"
                                    />
                                    <span className="text-sm leading-[22px]">
                                        Ich melde mich zum Newsletter gemäß der{' '}
                                        <button
                                            type="button"
                                            onClick={() => setShowPrivacyPolicy(true)}
                                            className="font-bold underline text-blue-500 cursor-pointer hover:text-blue-600"
                                        >
                                            Datenschutzrichtlinie
                                        </button>
                                        {' '}von FeetF1rst an.
                                    </span>
                                </div>
                            </div>
                            {(errors.acceptTerms || errors.acceptNewsletter) &&
                                <span className="text-red-500 text-sm block">Sie müssen die Bedingungen akzeptieren</span>
                            }
                            <div className="flex justify-center mt-12">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#62a07b] cursor-pointer text-white px-12 py-3 rounded-full text-lg font-medium uppercase hover:bg-opacity-90 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Laden...</span>
                                        </div>
                                    ) : (
                                        'Fortfahren'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}