'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ResumeTab from './tabs/ResumeTab'
import CoverLetterTab from './tabs/CoverLetterTab'
import InterviewPrepTab from './tabs/InterviewPrepTab'
import { ArrowLeft } from 'lucide-react'
import './styles/index.css'
import { useApi } from '@/utils/api'
import { useResumeData } from './hooks/useResumeData'
import { useAuth } from '@/components/auth/AuthContext'

const TABS = {
  RESUME: 'resume',
  COVER_LETTER: 'cover_letter',
  INTERVIEW_PREP: 'interview_prep'
}

export default function ResumeViewer() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(TABS.RESUME)
  const { supabase } = useAuth()
  
  const id = searchParams.get('id')
  console.log('Resume ID:', id)
  
  const { resumeData, isLoading, isError, refreshData } = useResumeData(id)
  console.log('ResumeViewer resumeData:', resumeData);

  // Setup real-time subscription for analysis status updates
  useEffect(() => {
    if (!id) return
    
    console.log('Setting up analysis status subscription')
    const channel = supabase
      .channel(`resume_analysis_${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resumes',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log('Received update:', payload);
          // Use refreshData instead of manual state update
          refreshData();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      })
  
    return () => {
      console.log('Cleaning up subscription')
      channel.unsubscribe()
    }
  }, [id, supabase, refreshData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="text-gray-600">Loading resume data...</div>
        </div>
      </div>
    )
  }

  if (isError || !resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">No resume data found</div>
      </div>
    )
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case TABS.RESUME:
        return <ResumeTab 
          resumeData={resumeData} 
          refreshData={refreshData} 
        />;
      case TABS.COVER_LETTER:
        return <CoverLetterTab resumeData={resumeData} />
      case TABS.INTERVIEW_PREP:
        return <InterviewPrepTab resumeData={resumeData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <button
            onClick={() => router.push('/.')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Applications</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <nav className="flex" aria-label="Tabs">
            {Object.entries(TABS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveTab(value)}
                className={`
                  py-4 px-6 font-medium text-sm border-b-2 transition-colors
                  ${activeTab === value
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {key.replace('_', ' ')}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 max-w-7xl py-8">
        {renderActiveTab()}
      </div>
    </div>
  )
}
