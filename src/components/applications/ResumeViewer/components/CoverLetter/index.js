'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { QUESTIONS } from '@/components/applications/ResumeViewer/config/cover-letter.config'
// import { exportCoverLetterToPDF, exportCoverLetterToWord } from '../../utils/exportUtils'
import { useAuth } from '@/components/auth/AuthContext'
import { useApi } from '@/utils/api'
import { toast } from "sonner"
import { CreditGate } from '@/components/applications/common/CreditGate'
import { useProfileUpdate } from '@/hooks/useProfileUpdate'

export default function CoverLetterBuilder({ 
  resumeData, 
  selectedTone, 
  isGenerating, 
  initialData,
  onSave,
  onRefresh 
}) {
  const { user } = useAuth()
  const { fetchWithAuth } = useApi()

  // Move loadingSteps to useMemo to prevent recreation
  const loadingSteps = useMemo(() => [
    "Analyzing your experience...",
    "Processing your answers...",
    "Crafting your cover letter...",
    "Applying final touches..."
  ], [])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(initialData?.answers || {})
  const [generatedLetter, setGeneratedLetter] = useState(initialData?.cover_letter || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableLetter, setEditableLetter] = useState('')
  const [loadingStep, setLoadingStep] = useState(0)

  // Fixed useEffect with proper dependency
  useEffect(() => {
    let interval
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length)
      }, 2000)
    } else {
      setLoadingStep(0)
    }
    return () => clearInterval(interval)
  }, [isLoading, loadingSteps.length])

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleGenerate = async () => {
    // added
    // if (!checkCredits()) return

    setIsLoading(true)
    setError(null)
    setLoadingStep(0)

    if (!resumeData?.id || !user?.id) {
      setError('Missing required information')
      setIsLoading(false)
      return
    }

    try {
      const filteredAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
        if (value.trim()) {
          acc[key] = value
        }
        return acc
      }, {})

      const requestBody = {
        resume_id: resumeData.id,
        user_id: user.id,
        tone: selectedTone,
        answers: filteredAnswers,
        job_description: resumeData.job_description
      }

      const data = await fetchWithAuth('/api/generate-cover-letter', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      setGeneratedLetter(data.cover_letter)
      
      // added
      // await refreshProfile()
      // After successful generation, refresh the cached data
      if (onRefresh) {
        await onRefresh()
      }
    } catch (err) {
      console.error('Cover letter generation error:', {
        error: err,
        message: err.message,
        userId: user?.id,
        resumeId: resumeData?.id
      })
      setError(err.message || 'Failed to generate cover letter. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditableLetter(generatedLetter)
  }

  const handleSave = async () => {
    if (!resumeData?.id) {
      console.error('Missing resume ID for save')
      toast.error('Missing required information')
      return
    }

    try {
      await onSave(editableLetter)
      setIsEditing(false)
      setGeneratedLetter(editableLetter)
    } catch (error) {
      // Error is handled by the hook, including toast notifications
      console.error('Save operation failed:', error)
    }
  }

  const handleExportPDF = async () => {
    try {
      const content = isEditing ? editableLetter : generatedLetter
      await exportCoverLetterToPDF(content)
    } catch (error) {
      console.error('Failed to export PDF:', error)
      toast.error('Failed to export PDF')
    }
  }

  const handleExportWord = async () => {
    try {
      const content = isEditing ? editableLetter : generatedLetter
      await exportCoverLetterToWord(content)
    } catch (error) {
      console.error('Failed to export Word document:', error)
      toast.error('Failed to export Word document')
    }
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex]

  const LoadingButton = () => (
    <div className="flex flex-col items-center">
      <button
        disabled
        className="px-6 py-3 rounded-lg font-medium text-white bg-blue-400 cursor-not-allowed mb-4"
      >
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        </span>
      </button>
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-600 font-medium mb-2">
          {loadingSteps[loadingStep]}
        </div>
        <div className="flex gap-1">
          {loadingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                index === loadingStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* <CreditGate> */}
      {/* Generated Content */}
      {generatedLetter && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Generated Cover Letter</h3>
            <div className="flex items-center gap-3">
              {/* Export buttons */}
              <button
                onClick={handleExportPDF}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 flex items-center gap-2"
                title="Export as PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={handleExportWord}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 flex items-center gap-2"
                title="Export as Word"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Word
              </button>
              {/* Divider */}
              <div className="h-6 w-px bg-gray-300"></div>
              {/* Edit button */}
              <button
                onClick={isEditing ? handleSave : handleEdit}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {isEditing ? 'Save Changes' : 'Edit Letter'}
              </button>
            </div>
          </div>
          {isEditing ? (
            <textarea
              value={editableLetter}
              onChange={(e) => setEditableLetter(e.target.value)}
              className="w-full p-6 min-h-[400px] bg-white rounded-lg border shadow-sm text-justify font-serif text-gray-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <div className="prose max-w-none bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-justify font-serif text-gray-800 leading-relaxed whitespace-pre-wrap">
                {generatedLetter}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Question Card */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Question {currentQuestionIndex + 1} of {QUESTIONS.length}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              All questions are optional but help improve the quality of your cover letter
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium
                ${currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === QUESTIONS.length - 1}
              className={`px-4 py-2 rounded-md text-sm font-medium
                ${currentQuestionIndex === QUESTIONS.length - 1
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              Next
            </button>
          </div>
        </div>

        <p className="text-gray-700 mb-3">{currentQuestion.question}</p>
        <textarea
          value={answers[currentQuestion.id] || ''}
          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
          placeholder={currentQuestion.placeholder}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Generate Button */}
      {isLoading ? (
        <LoadingButton />
      ) : (
        <button
          onClick={handleGenerate}
          className="px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Generate Cover Letter
          </button>
        )}
      {/* </CreditGate> */}
    </div>
  )
}
 