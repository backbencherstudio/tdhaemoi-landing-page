'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../../../public/categoryData/logo.png'
import { IoIosArrowDown } from 'react-icons/io'

export default function AllQuestions() {
    const [submittedData, setSubmittedData] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const searchParams = useSearchParams()

    useEffect(() => {
        setIsLoading(true)
        const data = searchParams.get('data')
        if (data) {
            try {
                const decodedData = JSON.parse(decodeURIComponent(data))
                console.log('Decoded Data:', decodedData)
                setSubmittedData(decodedData)
                setIsLoading(false)
            } catch (error) {
                console.error('Error parsing data:', error)
                setIsLoading(false)
            }
        }
    }, [searchParams])

    const questions = submittedData?.questions || [];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    const handleAnswerSelect = (questionId, answerId, answerText) => {
        const newAnswers = {
            ...answers,
            [questionId]: { id: answerId, answer: answerText }
        }
        setAnswers(newAnswers)
        console.log('Selected Answer:', { questionId, answerId, answerText })
        console.log('All Answers:', newAnswers)
    }

    const handleNextQuestion = () => {
        const currentQuestionId = questions[currentQuestionIndex].id;
        // Only proceed if an answer is selected or question was skipped
        if (answers[currentQuestionId]) {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1)
            } else {
                console.log('Final Answers:', answers)
            }
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const handleSkip = () => {
        const currentQuestionId = questions[currentQuestionIndex].id
        const newAnswers = {
            ...answers,
            [currentQuestionId]: { skipped: true }
        }
        setAnswers(newAnswers)
        console.log('Skipped Question:', currentQuestionId)

        // Automatically move to next question after skip
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    const handleComplete = () => {
        const currentQuestionId = questions[currentQuestionIndex].id;
        if (answers[currentQuestionId]) {
            console.log('All Questions Completed! Final Answers:', answers)

        }
    }

    if (!submittedData) {
        return <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
            <div>Loading...</div>
        </div>
    }

    if (!questions || questions.length === 0) {
        return <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
            <div>No questions found for this category.</div>
        </div>
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (

        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="flex justify-center items-center py-10">
                <Image
                    src={logo}
                    alt="FeetFirst Logo"
                    width={200}
                    height={124}
                    className="w-[103px] h-[124px]"
                />
            </div>


            {/* Main Content */}
            <div className="container px-4 py-2">
                <h2 className="text-start text-[20px] md:text-[35px] font-semibold mb-10 uppercase">Shoe finder feetfirst</h2>

                <div className="mb-8">

                    {submittedData?.selectedSubCategory?.title ? (
                        <p className="text-[24px] mb-2 flex items-center gap-2">{submittedData.selectedSubCategory.title} <IoIosArrowDown /></p>
                    ) : (
                        <h1 className="text-[24px] mb-2 flex items-center gap-2">{submittedData?.categoryTitle} <IoIosArrowDown /></h1>
                    )}

                    {/* Progress Bar */}
                    <div className="relative pt-10 max-w-4xl mx-auto">

                        <div className="flex h-2 overflow-hidden bg-gray-700 rounded">
                            <div
                                style={{ width: `${progress}%` }}
                                className="bg-[#62a07c] transition-all duration-500"
                            />
                        </div>
                        <div className="flex mb-2 items-center justify-center mt-1">
                            <div>
                                <span className="text-xs font-semibold inline-block text-[#FFF]">
                                    Question {currentQuestionIndex + 1}/{questions.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-xl">{currentQuestion.question}</h2>
                        <button className="text-[#62a07c] rounded-full border border-[#62a07c] w-6 h-6 flex items-center justify-center">
                            ?
                        </button>
                    </div>

                    {/* Options with Checkboxes */}
                    <div className="space-y-2">
                        {currentQuestion.options.map((option) => (
                            <label
                                key={option.id}
                                className={`flex items-center w-full p-4  cursor-pointer ${answers[currentQuestion.id]?.id === option.id
                                    ? ' bg-opacity-20'
                                    : 'border-gray-700 hover:border-[#62a07c]'
                                    } transition-colors`}
                            >
                                <input
                                    type="radio"
                                    name={`question-${currentQuestion.id}`}
                                    checked={answers[currentQuestion.id]?.id === option.id}
                                    onChange={() => handleAnswerSelect(currentQuestion.id, option.id, option.option)}
                                    className="mr-4 accent-[#62a07c] w-5 h-5"
                                />
                                <span>{option.option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col items-center gap-4 mt-8">
                    {!isFirstQuestion && (
                        <button
                            onClick={handlePreviousQuestion}
                            className="flex-1 py-3 max-w-[451px] w-full rounded text-center uppercase text-sm font-semibold bg-gray-700 hover:bg-gray-600"
                        >
                            Zurück
                        </button>
                    )}

                    {!isLastQuestion ? (
                        <button
                            onClick={handleNextQuestion}
                            disabled={!answers[currentQuestion.id]}
                            className={`flex-1 py-3 max-w-[451px] w-full rounded text-center uppercase text-sm font-semibold ${answers[currentQuestion.id]
                                ? 'bg-[#62a07c] hover:bg-opacity-90'
                                : 'bg-gray-700 cursor-not-allowed'
                                }`}
                        >
                            Nächste Frage
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            disabled={!answers[currentQuestion.id]}
                            className={`flex-1 py-3 max-w-[451px] w-full rounded text-center uppercase text-sm font-semibold ${answers[currentQuestion.id]
                                ? 'bg-[#62a07c] hover:bg-opacity-90'
                                : 'bg-gray-700 cursor-not-allowed'
                                }`}
                        >
                            Abschließen
                        </button>
                    )}
                    <button
                        onClick={handleSkip}
                        className="text-gray-400 underline text-sm hover:text-gray-300"
                    >
                        Überspringen
                    </button>
                </div>
            </div>
        </div>
    )
}
