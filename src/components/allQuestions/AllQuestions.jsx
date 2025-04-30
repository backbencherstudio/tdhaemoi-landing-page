'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../../../public/categoryData/logo.png'
import { IoIosArrowDown } from 'react-icons/io'
import LoadingSpring from '../loading/LoadingSpring'

export default function AllQuestions() {
    const [submittedData, setSubmittedData] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showLoadingSpring, setShowLoadingSpring] = useState(false)
    const [nestedQuestions, setNestedQuestions] = useState(null)
    const [inputValues, setInputValues] = useState({})

    useEffect(() => {
        const loadData = () => {
            setIsLoading(true)
            try {
                // Get data from sessionStorage
                const storedData = sessionStorage.getItem('formSubmissionData')
                if (storedData) {
                    const parsedData = JSON.parse(storedData)

                    // Verify that the stored data matches the URL parameters
                    const categoryId = searchParams.get('categoryId')
                    const subCategoryId = searchParams.get('subCategoryId')

                    if (categoryId === parsedData.categoryId.toString() &&
                        (!subCategoryId || subCategoryId === parsedData.selectedSubCategory?.id?.toString())) {
                        setSubmittedData(parsedData)
                    } else {
                        console.error('URL parameters do not match stored data')
                    }
                } else {
                    console.error('No stored form data found')
                }
            } catch (error) {
                console.error('Error loading data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [searchParams])

    // Get questions based on current state
    // const questions = nestedQuestions ? nestedQuestions.questions : (submittedData?.questions || []);
    // const isLastQuestion = currentQuestionIndex === questions.length - 1;
    // const isFirstQuestion = currentQuestionIndex === 0;

    // Modify handleAnswerSelect to handle both radio and input
    const handleAnswerSelect = (questionId, answerId, answerText, option, inputValue = '') => {
        const newAnswers = {
            ...answers,
            [questionId]: { 
                id: answerId, 
                answer: answerText,
                hasNextQuestions: option.nextQuestions ? true : false,
                nextQuestions: option.nextQuestions || null,
                inputValue: inputValue || inputValues[questionId] || '',
                isNested: !!nestedQuestions
            }
        };
        setAnswers(newAnswers);
    }

    // Add new function to handle input changes
    const handleInputChange = (questionId, value) => {
        // Validate input to ensure it's a valid number
        const numericValue = value.replace(/[^0-9]/g, '');
        
        setInputValues(prev => ({
            ...prev,
            [questionId]: numericValue
        }));

        // Update answer when input changes
        if (numericValue) {
            const option = questions[currentQuestionIndex].options[0];
            const fullAnswer = `${option.option.split('______')[0]}${numericValue}${option.option.split('______')[1]}`;
            
            handleAnswerSelect(
                questionId, 
                option.id, 
                fullAnswer, 
                option,
                numericValue // Pass the numeric value separately
            );
        }
    }

    // Add a new state to track question history
    const [questionHistory, setQuestionHistory] = useState([]);

    // Modify handleNextQuestion
    const handleNextQuestion = () => {
        const currentQuestionId = questions[currentQuestionIndex].id;
        const currentAnswer = answers[currentQuestionId];

        if (currentAnswer) {
            if (currentAnswer.hasNextQuestions && currentAnswer.nextQuestions) {
                // Save current state before moving to nested questions
                setQuestionHistory(prev => [...prev, {
                    questions: questions,
                    index: currentQuestionIndex,
                    nestedQuestions: nestedQuestions
                }]);
                setNestedQuestions(currentAnswer.nextQuestions);
                setCurrentQuestionIndex(0);
                return;
            }

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            }
        }
    }

    // Modify handlePreviousQuestion
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else if (nestedQuestions) {
            // Get the last state from history
            const previousState = questionHistory[questionHistory.length - 1];
            if (previousState) {
                setNestedQuestions(previousState.nestedQuestions);
                setCurrentQuestionIndex(previousState.index);
                setQuestionHistory(prev => prev.slice(0, -1));
            } else {
                // If no history, go back to main questions
                setNestedQuestions(null);
                const mainQuestionIndex = submittedData.questions.findIndex(q => 
                    answers[q.id]?.hasNextQuestions && answers[q.id]?.nextQuestions
                );
                if (mainQuestionIndex !== -1) {
                    setCurrentQuestionIndex(mainQuestionIndex);
                }
            }
        }
    }

    const handleSkip = () => {
        const currentQuestionId = questions[currentQuestionIndex].id
        const newAnswers = {
            ...answers,
            [currentQuestionId]: { skipped: true }
        }
        setAnswers(newAnswers)
        // console.log('Skipped Question:', currentQuestionId)

        // Automatically move to next question after skip
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    const handleComplete = () => {
        const currentQuestionId = questions[currentQuestionIndex].id;
        if (answers[currentQuestionId]) {
            // Get user data from sessionStorage
            const formData = JSON.parse(sessionStorage.getItem('formSubmissionData') || '{}');
            
            // Create answers array with questions and selected options
            const answersArray = Object.entries(answers).map(([questionId, answerData]) => {
                const question = questions.find(q => q.id === parseInt(questionId)) || 
                               (nestedQuestions?.questions || []).find(q => q.id === parseInt(questionId));
                
                return {
                    questionId: parseInt(questionId),
                    question: question?.question || '',
                    selectedOption: {
                        id: answerData.id,
                        answer: answerData.answer
                    },
                    inputValue: answerData.inputValue || '',
                    isSkipped: answerData.skipped || false
                };
            });

            // Create final data structure
            const finalData = {
                userData: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    gender: formData.gender
                },
                categoryInfo: {
                    id: formData.categoryId,
                    title: formData.categoryTitle,
                    slug: formData.categorySlug,
                    subCategory: formData.selectedSubCategory ? {
                        id: formData.selectedSubCategory.id,
                        title: formData.selectedSubCategory.title,
                        slug: formData.selectedSubCategory.slug
                    } : null
                },
                questionsAndAnswers: answersArray
            };

            // Log the complete data structure
            // console.log('Complete User Journey Data:', finalData);

            // Store the final data
            sessionStorage.setItem('completeUserData', JSON.stringify(finalData));

            // Show loading animation
            setShowLoadingSpring(true);

            // Redirect to shoes page after a brief delay
            setTimeout(() => {
                router.push('/shoes');
            }, 500);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#62a07c] border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                </div>
            </div>
        )
    }

    if (!submittedData || !submittedData.questions || submittedData.questions.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
                <div>No questions found for this category. Please try again.</div>
            </div>
        )
    }

    // Get questions and current question safely
    const questions = nestedQuestions ? nestedQuestions.questions : (submittedData?.questions || []);
    const currentQuestion = questions[currentQuestionIndex] || null;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    // Add safety check for rendering
    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
                <div>Error loading question. Please try again.</div>
            </div>
        );
    }

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    if (showLoadingSpring) {
        return <div className='fixed inset-0 bg-black flex items-center justify-center z-[9999]'>
            <LoadingSpring />
        </div>
    }

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
                <h2 className="text-start text-[20px] md:text-[35px] font-semibold mb-10 uppercase">SHOE FINDER FEETF1RST</h2>

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
                        <h2 className="text-xl">
                            {nestedQuestions ? `${currentQuestion.question}` : currentQuestion.question}
                        </h2>
                        <button className="text-[#62a07c] rounded-full border border-[#62a07c] w-6 h-6 flex items-center justify-center">
                            ?
                        </button>
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                        {currentQuestion.options.map((option) => {
                            if (option.option.includes('______')) {
                                const beforeInput = option.option.split('______')[0];
                                const afterInput = option.option.split('______')[1];
                                
                                return (
                                    <label
                                        key={option.id}
                                        className="flex items-center w-full p-4 cursor-pointer border-gray-700 hover:border-[#62a07c] transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion.id}`}
                                            checked={answers[currentQuestion.id]?.id === option.id}
                                            onChange={() => handleAnswerSelect(currentQuestion.id, option.id, option.option, option, inputValues[currentQuestion.id] || '')}
                                            className="mr-4 accent-[#62a07c] w-5 h-5"
                                        />
                                        <span>{beforeInput}</span>
                                        <input
                                            type="number"
                                            value={inputValues[currentQuestion.id] || ''}
                                            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                            min="0"
                                            max="999"
                                            className="mx-2 w-20 p-1 bg-transparent border border-gray-700 rounded text-white focus:border-[#62a07c] outline-none"
                                        />
                                        <span>{afterInput}</span>
                                    </label>
                                );
                            }

                            return (
                                <label
                                    key={option.id}
                                    className={`flex items-center w-full p-4 cursor-pointer ${
                                        answers[currentQuestion.id]?.id === option.id
                                            ? 'bg-opacity-20'
                                            : 'border-gray-700 hover:border-[#62a07c]'
                                        } transition-colors`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        checked={answers[currentQuestion.id]?.id === option.id}
                                        onChange={() => handleAnswerSelect(currentQuestion.id, option.id, option.option, option, inputValues[currentQuestion.id] || '')}
                                        className="mr-4 accent-[#62a07c] w-5 h-5"
                                    />
                                    <span>{option.option}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col items-center gap-4 mt-8">
                    {/* Show back button if not first question OR if in nested questions */}
                    {(!isFirstQuestion || nestedQuestions) && (
                        <button
                            onClick={handlePreviousQuestion}
                            className="flex-1 py-3 cursor-pointer max-w-[451px] w-full rounded text-center uppercase text-sm font-semibold bg-gray-700 hover:bg-gray-600"
                        >
                            Zurück
                        </button>
                    )}

                    {(!isLastQuestion || (answers[currentQuestion.id]?.hasNextQuestions)) ? (
                        <button
                            onClick={handleNextQuestion}
                            disabled={!answers[currentQuestion.id]}
                            className={`flex-1 py-3 max-w-[451px] cursor-pointer w-full rounded text-center uppercase text-sm font-semibold ${
                                answers[currentQuestion.id]
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
                            className={`flex-1 py-3 cursor-pointer max-w-[451px] w-full rounded text-center uppercase text-sm font-semibold ${
                                answers[currentQuestion.id]
                                    ? 'bg-[#62a07c] hover:bg-opacity-90'
                                    : 'bg-gray-700 cursor-not-allowed'
                                }`}
                        >
                            Abschließen
                        </button>
                    )}

                    <button
                        onClick={handleSkip}
                        className="text-gray-400 cursor-pointer underline text-sm hover:text-gray-300"
                    >
                        Überspringen
                    </button>
                </div>
            </div>
        </div>
    )
}
