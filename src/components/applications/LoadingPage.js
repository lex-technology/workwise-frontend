'use client'
import { useEffect, useState, useRef, useMemo } from 'react'
import { Loader, AlertCircle, CheckCircle2, Info, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const useLoadingSteps = () => {
  return useMemo(() => [
    { 
      id: 0, 
      title: 'Initializing', 
      description: 'Setting up your application...', 
      weight: 10,
      tip: 'We\'re preparing to process your application'
    },
    { 
      id: 1, 
      title: 'Processing Resume', 
      description: 'Parsing your resume...', 
      weight: 40,
      tip: 'Our AI is analyzing your resume structure'
    },
    { 
      id: 2, 
      title: 'Starting Analysis', 
      description: 'Initiating job description analysis...', 
      weight: 30,
      tip: 'Preparing to match your qualifications with requirements'
    },
    { 
      id: 3, 
      title: 'Finalizing', 
      description: 'Preparing your results...', 
      weight: 20,
      tip: 'Almost there! Setting up your personalized view'
    }
  ], []) // Empty dependency array since steps are static
}

export default function LoadingPage() {
  const steps = useLoadingSteps()
  const { getToken } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const isProcessing = useRef(false)
  const hasStartedProcessing = useRef(false)
  const processingStartTime = useRef(null)
  const [timeRemaining, setTimeRemaining] = useState(null)

  // Track individual operation states
  const [isReusingResume, setIsReusingResume] = useState(false)

  // Modified steps to reflect actual flow
  const totalWeight = steps.reduce((acc, step) => acc + step.weight, 0)
  const estimatedTotalTime = 8000 // Adjusted for both operations

  // Handle Resume Parsing
  const handleResumeParse = async (formData, token) => {
    try {
      console.log('Making parse-resume API call...');
      const response = await fetch('http://localhost:8000/api/parse-resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process resume');
      }
  
      const result = await response.json();
      console.log('Parse resume result:', result);
      
      if (!result.resume_id) {
        throw new Error('No resume ID received from server');
      }
  
      return result.resume_id;
    } catch (error) {
      console.error('Error in handleResumeParse:', error);
      throw error;
    }
  };
  
  // Main Process Function
  useEffect(() => {
    const processApplication = async () => {
      if (hasStartedProcessing.current) return;
      hasStartedProcessing.current = true;
      isProcessing.current = true;
      processingStartTime.current = Date.now();
  
      const pendingData = sessionStorage.getItem('pendingFormData');
      if (!pendingData) {
        setError('No application data found. Please submit again.');
        setTimeout(() => router.replace('/applications/process'), 2000);
        return;
      }
  
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Authentication required. Please log in again.');
        }
  
        // Setup form data
        const formData = JSON.parse(pendingData);
        const submitData = new FormData();
  
        if (formData.parsed_resume_id) {
          submitData.append('parsed_resume_id', formData.parsed_resume_id);
        } else {
          const base64Response = await fetch(formData.resume);
          const blob = await base64Response.blob();
          const file = new File([blob], formData.fileName, { type: blob.type });
          submitData.append('resume', file);
        }
        
        submitData.append('jobDescription', formData.jobDescription);
        submitData.append('companyApplied', formData.companyApplied);
        submitData.append('roleApplied', formData.roleApplied);
  
        // Parse Resume and redirect
        const resumeId = await handleResumeParse(submitData, token);
        sessionStorage.removeItem('pendingFormData');
        router.push(`/applications/viewer?id=${resumeId}`);
  
      } catch (error) {
        console.error('Error in processApplication:', error);
        setError(error.message);
        isProcessing.current = false;
        setTimeout(() => router.replace('/applications/process'), 2000);
      }
    };
  
    processApplication();
  }, [router, getToken]);

  // Progress calculation effect (existing code...)
  useEffect(() => {
    const calculateProgress = () => {
      if (!processingStartTime.current) return 0

      const elapsedTime = Date.now() - processingStartTime.current
      const rawProgress = Math.min((elapsedTime / estimatedTotalTime) * 100, 99)
      
      const totalWeight = steps.reduce((acc, step) => acc + step.weight, 0)
      let accumulatedWeight = 0
      
      for (let i = 0; i < steps.length; i++) {
        accumulatedWeight += (steps[i].weight / totalWeight) * 100
        if (rawProgress <= accumulatedWeight) {
          if (currentStep !== i) {
            setCurrentStep(i)
            setShowTip(true)
          }
          break
        }
      }

      const remaining = Math.max(0, estimatedTotalTime - elapsedTime)
      setTimeRemaining(Math.ceil(remaining / 1000))

      return rawProgress
    }

    const progressInterval = setInterval(() => {
      if (processingStartTime.current && !error) {
        setProgress(calculateProgress())
      }
    }, 50)

    return () => clearInterval(progressInterval)
  }, [currentStep, error, estimatedTotalTime, steps]) 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-cyan-50 to-cyan-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        {error ? (
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting you back...</p>
          </div>
        ) : (
          <div className="text-center">
            <Loader className="mx-auto h-12 w-12 text-cyan-600 animate-spin mb-6" />
            <h1 className="text-xl font-semibold text-cyan-800 mb-4">
              {isReusingResume ? 'Processing Your Application' : 'Analyzing Your Resume'}
            </h1>

            {timeRemaining !== null && (
              <div className="flex items-center justify-center gap-2 mb-4 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Estimated time remaining: {timeRemaining}s
                </span>
              </div>
            )}

            <div className="space-y-4 mt-6">
              {steps.map((step) => (
                <TooltipProvider key={step.id}>
                  <Tooltip open={showTip && currentStep === step.id}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center group cursor-pointer">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                          {currentStep > step.id ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : currentStep === step.id ? (
                            <div className="w-2 h-2 bg-cyan-600 rounded-full animate-pulse" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-300 rounded-full" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${
                              currentStep > step.id ? 'text-green-500' :
                              currentStep === step.id ? 'text-cyan-600' :
                              'text-gray-400'
                            }`}>
                              {step.title}
                            </p>
                            <Info className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {currentStep === step.id && (
                            <p className="text-xs text-gray-500 mt-1">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{step.tip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            <div className="mt-6">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-cyan-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {Math.round(progress)}% Complete
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}