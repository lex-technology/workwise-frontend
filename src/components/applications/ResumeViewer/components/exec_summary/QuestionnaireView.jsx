'use client'

import { useState, useEffect } from 'react';

export default function QuestionnaireView({ sectionTitle, onSubmit }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [currentAnswer, setCurrentAnswer] = useState('');

    // Questionnaire for Executive Summary
    const questions = {
        'executive_summary': [
            {
                id: 'target_role',
                question: 'What is your target role or industry?',
                placeholder: 'e.g., Software Engineer, Product Manager'
            },
            {
                id: 'key_strengths',
                question: 'What are your top 3 professional strengths?',
                placeholder: 'e.g., Technical leadership, Problem-solving'
            },
            {
                id: 'years_experience',
                question: 'How many years of relevant experience do you have?',
                placeholder: 'e.g., 5 years'
            }
        ]
    };

    const currentQuestions = questions[sectionTitle.toLowerCase().replace(' ', '_')] || [];
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    const handleNext = () => {
        if (currentAnswer.trim()) {
            setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: currentAnswer
            }));
        }
        setCurrentAnswer('');
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentAnswer.trim()) {
            setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: currentAnswer
            }));
        }
        const previousQuestion = currentQuestions[currentQuestionIndex - 1];
        setCurrentAnswer(answers[previousQuestion.id] || '');
        setCurrentQuestionIndex(prev => prev - 1);
    };

    const handleSubmitAnswers = () => {
        // Even if no answers were provided, submit with an empty object
        const finalAnswers = currentAnswer.trim() 
            ? {
                ...answers,
                [currentQuestion.id]: currentAnswer
              }
            : answers;
            
        // Log the answers being sent (for debugging)
        console.log('Submitting answers:', finalAnswers);
        
        onSubmit(finalAnswers || {}); // Ensure we at least send an empty object
    };

    useEffect(() => {
        setCurrentAnswer(answers[currentQuestion?.id] || '');
    }, [currentQuestionIndex]);

    const renderProgressBar = () => {
        const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
        
        return (
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-600">
                        Question {currentQuestionIndex + 1} of {currentQuestions.length}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                {renderProgressBar()}
                
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm mr-3">
                            {currentQuestionIndex + 1}
                        </span>
                        {currentQuestion.question}
                    </h3>
                    
                    <textarea
                        className="w-full p-4 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200"
                        placeholder={currentQuestion.placeholder}
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                    />

                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Your answer helps AI generate better content</span>
                        </div>
                        
                        <div className="flex space-x-3">
                            {!isFirstQuestion && (
                                <button
                                    onClick={handlePrevious}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-1 hover:bg-gray-100 rounded transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span>Previous</span>
                                </button>
                            )}
                            {isLastQuestion ? (
                                <button
                                    onClick={handleSubmitAnswers}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <span>Submit</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <span>Next</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleSubmitAnswers}
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                    <span>Generate Now</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </button>
            </div>
        </>
    );
}