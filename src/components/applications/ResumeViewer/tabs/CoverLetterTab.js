'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { useApi } from '@/utils/api'
import JDViewer from '../components/JDViewer'
import CoverLetterBuilder from '../components/CoverLetter'
import { TONE_OPTIONS } from '@/components/applications/ResumeViewer/config/cover-letter.config'
import { useCoverLetter } from '../hooks/useCoverLetter'

// export default function CoverLetterTab({ resumeData }) {
//   const searchParams = useSearchParams()
//   const resumeId = searchParams.get('id')
//   const { user } = useAuth()
//   const { fetchWithAuth } = useApi()
//   const [selectedTone, setSelectedTone] = useState('personal')
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [coverLetterData, setCoverLetterData] = useState(null)

//   const enrichedResumeData = {
//     ...resumeData,
//     id: parseInt(resumeId, 10)
//   }

//   useEffect(() => {
//     const fetchCoverLetter = async () => {
//       console.log('Fetching cover letter:', {
//         resumeId,
//         userId: user?.id,
//         timestamp: new Date().toISOString()
//       })

//       try {
//         if (!resumeId || !user?.id) {
//           console.error('Missing required IDs for fetch:', {
//             resumeId,
//             userId: user?.id,
//             user: user
//           })
//           return
//         }

//         console.log('Sending fetch request:', {
//           url: `http://localhost:8000/api/get-cover-letter/${resumeId}`,
//           method: 'GET',
//           auth: !!user?.id,
//           timestamp: new Date().toISOString()
//         })

//         const data = await fetchWithAuth(`http://localhost:8000/api/get-cover-letter/${resumeId}`)
        
//         console.log('Cover letter fetch response:', {
//           success: true,
//           hasData: !!data,
//           timestamp: new Date().toISOString()
//         })

//         setCoverLetterData(data)
//         // If there's a saved tone, update the selected tone
//         if (data?.tone) {
//           setSelectedTone(data.tone)
//         }
//       } catch (error) {
//         console.error('Error fetching cover letter:', {
//           error,
//           message: error.message,
//           userId: user?.id,
//           resumeId,
//           timestamp: new Date().toISOString(),
//           errorStack: error.stack,
//           errorName: error.name,
//           statusCode: error.status || error.statusCode,
//           isNetworkError: error instanceof TypeError,
//           isAuthError: error.message?.includes('authentication')
//         })
//       }
//     }

//     if (resumeId) {
//       fetchCoverLetter()
//     }
//   }, [resumeId, user, fetchWithAuth])

//   return (
//     <div className="flex gap-6">
//       {/* Left Side - JD Viewer */}
//       <div className="w-1/3">
//         <JDViewer resumeData={resumeData} />
//       </div>

//       {/* Right Side - Cover Letter Builder */}
//       <div className="w-2/3">
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold text-gray-900">Write Your Cover Letter with AI</h2>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           {/* Tone Selection */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Tone
//             </label>
//             <div className="grid grid-cols-4 gap-3">
//               {TONE_OPTIONS.map((tone) => (
//                 <button
//                   key={tone.id}
//                   onClick={() => setSelectedTone(tone.id)}
//                   className={`
//                     p-3 rounded-lg text-sm font-medium text-center transition-all
//                     ${selectedTone === tone.id
//                       ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-600'
//                       : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
//                     }
//                   `}
//                   title={tone.description}
//                 >
//                   {tone.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <CoverLetterBuilder
//             resumeData={enrichedResumeData}
//             selectedTone={selectedTone}
//             isGenerating={isGenerating}
//             initialData={coverLetterData}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

export default function CoverLetterTab({ resumeData }) {
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('id')
  const [selectedTone, setSelectedTone] = useState('personal')
  const [isGenerating, setIsGenerating] = useState(false)

  const {
    coverLetterData,
    isLoading,
    isError,
    saveCoverLetter,
    refreshData
  } = useCoverLetter(resumeId)

  const enrichedResumeData = {
    ...resumeData,
    id: parseInt(resumeId, 10)
  }

  // If there's a saved tone in the cover letter data, update the selected tone
  useEffect(() => {
    if (coverLetterData?.tone) {
      setSelectedTone(coverLetterData.tone)
    }
  }, [coverLetterData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="text-gray-600">Loading cover letter...</div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600">Failed to load cover letter data</div>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      {/* Left Side - JD Viewer */}
      <div className="w-1/3">
        <JDViewer resumeData={resumeData} />
      </div>

      {/* Right Side - Cover Letter Builder */}
      <div className="w-2/3">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Write Your Cover Letter with AI</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* Tone Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tone
            </label>
            <div className="grid grid-cols-4 gap-3">
              {TONE_OPTIONS.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`
                    p-3 rounded-lg text-sm font-medium text-center transition-all
                    ${selectedTone === tone.id
                      ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-600'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }
                  `}
                  title={tone.description}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          <CoverLetterBuilder
            resumeData={enrichedResumeData}
            selectedTone={selectedTone}
            isGenerating={isGenerating}
            initialData={coverLetterData}
            onSave={saveCoverLetter}
            onRefresh={refreshData}
          />
        </div>
      </div>
    </div>
  )
}