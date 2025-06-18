'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthContext'

export default function JDViewer({ resumeData, refreshData }) {
  // Move all hooks to the top level
  const { getToken } = useAuth()
  const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Move useMemo to top level
    const processedJD = useMemo(() => {
      if (!resumeData?.job_description) {
        return []
      }
    
      if (resumeData?.jd_analysis && Array.isArray(resumeData.jd_analysis) && resumeData.jd_analysis.length > 0) {
        const sortedAnalysis = [...resumeData.jd_analysis].sort((a, b) => 
          b.line_text.length - a.line_text.length
        )
    
        let fullText = resumeData.job_description
        const markers = []
    
        // Create markers for highlights
        sortedAnalysis.forEach((item, index) => {
          if (!item.line_text) return
          const marker = `___HIGHLIGHT_${index}___`
          markers.push({ marker, item })
          fullText = fullText.split(item.line_text).join(marker)
        })
    
        // Process segments
        const segments = []
        let currentText = ''
    
        for (let i = 0; i < fullText.length; i++) {
          let foundMarker = false
          for (const { marker, item } of markers) {
            if (fullText.slice(i, i + marker.length) === marker) {
              if (currentText) {
                segments.push({ type: 'text', content: currentText })
                currentText = ''
              }
              segments.push({ type: 'highlight', item })
              i += marker.length - 1
              foundMarker = true
              break
            }
          }
          if (!foundMarker) {
            currentText += fullText[i]
          }
        }
    
        if (currentText) {
          segments.push({ type: 'text', content: currentText })
        }
    
        return segments
      }
    
      return [{ type: 'text', content: resumeData?.job_description || '' }]
    }, [resumeData?.job_description, resumeData?.jd_analysis]) 
  // Early return with proper null check
  if (!resumeData) {
    return null
  }

  const skillTypeStyles = {
    'technical skills': 'bg-blue-100/80',
    'domain knowledge': 'bg-purple-100/80',
    'soft skills': 'bg-yellow-100/80'
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'bg-blue-100 text-blue-800'
      case 'interview': return 'bg-purple-100 text-purple-800'
      case 'offer': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'writing cv': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAnalyze = async () => {
    debugger; 
    console.log('HandleAnalyze called with refreshData:', !!refreshData);
    if (!refreshData) {
      console.error('refreshData function not provided');
      return;
    }
    try {
      console.log('Starting analysis process');
      setIsAnalyzing(true)
      const token = getToken()
      
      // Start analysis
      console.log('Calling analyze-jd endpoint');
      const response = await fetch(`/api/analyze-jd/${resumeData.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
  
      if (!response.ok) {
        throw new Error('Failed to start analysis')
      }
  
      const analysisResult = await response.json();
      console.log('Analysis started:', analysisResult);
  
      let pollCount = 0;
      const maxPolls = 10; // Maximum number of polling attempts
  
      // Poll for completion
      const checkAnalysis = async () => {
        pollCount++;
        console.log(`Polling attempt ${pollCount}`);
  
        const checkResponse = await fetch(`/api/check-analysis/${resumeData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
  
        if (!checkResponse.ok) {
          throw new Error('Failed to check analysis status')
        }
  
        const result = await checkResponse.json()
        console.log('Check analysis response:', result);
        
        if (result.jd_analysis && Array.isArray(result.jd_analysis) && result.jd_analysis.length > 0) {
          console.log('Analysis data found, forcing refresh');
          refreshData();
          setIsAnalyzing(false);
        } else if (result.analysis_status === 'failed') {
          throw new Error('Analysis failed');
        } else if (pollCount >= maxPolls) {
          console.log('Max polling attempts reached');
          setIsAnalyzing(false);
          throw new Error('Analysis timeout');
        } else {
          console.log('Analysis still in progress, polling again in 2s');
          setTimeout(checkAnalysis, 2000);
        }
      }
  
      // Start polling
      await checkAnalysis()
  
    } catch (error) {
      console.error('Analysis error:', error)
      setIsAnalyzing(false)
    }
  }

  const renderHighlightedText = (item) => {
    const { line_text, skill_type, has_skill, source, gap_analysis } = item
    
    return (
      <Tooltip key={line_text}>
        <TooltipTrigger asChild>
          <span 
            className={`${skillTypeStyles[skill_type.toLowerCase()] || 'bg-gray-100'} 
                     rounded px-1.5 py-0.5 mx-0.5 
                     hover:bg-opacity-60 cursor-pointer 
                     transition-colors duration-200
                     ${has_skill ? 'border-b-2 border-green-400' : 'border-b border-red-400'}`}
          >
            {line_text}
          </span>
        </TooltipTrigger>
        <TooltipContent className={`${has_skill ? 'bg-green-50' : 'bg-red-50'} p-0 max-w-sm border-2 ${has_skill ? 'border-green-200' : 'border-red-200'}`}>
          <div className="p-3">
            <div className="text-sm font-medium mb-1">
              <span className={skill_type.toLowerCase() === 'technical skills' ? 'text-blue-700' : 
                             skill_type.toLowerCase() === 'domain knowledge' ? 'text-purple-700' : 
                             'text-yellow-700'}>
                {skill_type}
              </span>
            </div>
            <div className={`font-semibold mb-1 ${has_skill ? 'text-green-900' : 'text-red-900'}`}>
              {line_text}
            </div>
            {has_skill ? (
              <div className="text-green-700">
                <div className="font-medium">Found in Resume:</div>
                <div className="text-sm mb-1">{source.evidence}</div>
                <div className="text-sm text-green-600 italic">{source.reason}</div>
              </div>
            ) : (
              <div className="text-red-700">
                <div className="font-medium mb-1">Required Actions:</div>
                {gap_analysis?.short_term_actions?.length > 0 && (
                  <div className="mb-2">
                    <div className="font-medium text-sm">Short term:</div>
                    <ul className="list-disc list-inside text-sm pl-2">
                      {gap_analysis.short_term_actions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {gap_analysis?.long_term_actions?.length > 0 && (
                  <div>
                    <div className="font-medium text-sm">Long term:</div>
                    <ul className="list-disc list-inside text-sm pl-2">
                      {gap_analysis.long_term_actions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }


  const renderContent = (segments) => {
    // console.log('RenderContent called with segments:', segments)
    return segments.map((segment, index) => {
      if (typeof segment === 'string') {
        // console.log('Rendering string segment:', segment);
        return <React.Fragment key={index}>{segment}</React.Fragment>
      }
      if (segment.type === 'highlight') {
        // console.log('Rendering highlight segment:', segment.item);
        return renderHighlightedText(segment.item)
      }
      if (segment.type === 'text') {
        // console.log('Rendering text segment:', segment.content);
        return <React.Fragment key={index}>{segment.content}</React.Fragment>
      }
      // console.warn('Unknown segment type:', segment)
      return null
    })
  }

  return (
    <TooltipProvider>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        {/* Application Details */}
        <div className="mb-6">
          {resumeData.company_applied && (
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {resumeData.company_applied}
                </h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resumeData.status)}`}>
                  {resumeData.status}
                </span>
              </div>
              {resumeData.role_applied && (
                <p className="text-gray-600 mt-1">
                  {resumeData.role_applied}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="border-t pt-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Job Description</h2>
            </div>
            
            {(!resumeData.jd_analysis || !Array.isArray(resumeData.jd_analysis)) && !isAnalyzing && (
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    console.log('Button clicked');
                    console.log('refreshData exists:', !!refreshData);
                    handleAnalyze();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  Analyze Job Requirements
                </Button>
                <p className="text-center text-sm text-gray-500">Try it out for free</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex items-center justify-center text-blue-600 gap-2 w-full mt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analyzing...</span>
              </div>
            )}
          </div>

          {resumeData.jd_analysis && Array.isArray(resumeData.jd_analysis) && (
            <div className="mb-4">
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${skillTypeStyles['technical skills']}`}></div>
                  <span>Technical Skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${skillTypeStyles['domain knowledge']}`}></div>
                  <span>Domain Knowledge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${skillTypeStyles['soft skills']}`}></div>
                  <span>Soft Skills</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs mt-2">
                <div className="flex items-center gap-2">
                  <span className="border-b-2 border-green-400 px-2">abc</span>
                  <span>Found in your resume</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border-b border-red-400 px-2">abc</span>
                  <span>Skill to develop</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="prose max-w-none">
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {/* {console.log('Rendering content:', processedJD)} */}
              {renderContent(processedJD)}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}