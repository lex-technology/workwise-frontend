'use client'
import React, { useState } from 'react'
import { generateContent } from '../utils/generateContent'
import ResumeTemplate from '../templates/ResumeTemplate'
import JDViewer from '../components/JDViewer'
import { handleExport } from '../utils/exportUtils';
import { handleSectionClick, handleExperienceClick } from '../utils/sectionHandlers'
import { toast } from 'sonner';


export default function ResumeTab({ resumeData, refreshData }) {
  console.log('ResumeTab received data:', resumeData) 
  const [selectedTemplate, setSelectedTemplate] = useState('A')
  const [isExporting, setIsExporting] = useState(false);

  const handleExportClick = async (format) => {
    setIsExporting(true);
    try {
      await handleExport(format, resumeData);
      toast.success(`Resume exported as ${format.toUpperCase()} successfully`);
    } catch (error) {
      toast.error(`Failed to export resume: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Generate base content with sections and modals
  const { sections, modalHandlers } = generateContent(resumeData)
  const urlParams = new URLSearchParams(window.location.search)
  const resumeId = urlParams.get('id')

  return (
    <div className="flex gap-6">
      {/* Left Side - JD Viewer */}
      <div className="w-1/3">
      {console.log('About to render JDViewer with:', resumeData, refreshData)}  
        <JDViewer 
          resumeData={resumeData}
          refreshData={refreshData}
        />
      </div>

      {/* Right Side - Resume Template */}
      <div className="w-2/3">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Write Your Resume with AI</h2>
          <p className="text-sm text-gray-600 mt-1">
            Click on each section of your resume to improve
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* Template Controls */}
          <div className="flex flex-col gap-6 mb-6">
            {/* Template Selection */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Choose Template</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setSelectedTemplate('A')}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all duration-200
                    ${selectedTemplate === 'A' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedTemplate === 'A'
                        ? 'border-blue-500'
                        : 'border-gray-400'
                      }
                    `}>
                      {selectedTemplate === 'A' && (
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <span className={`font-medium ${
                      selectedTemplate === 'A'
                        ? 'text-blue-700'
                        : 'text-gray-700'
                    }`}>
                      Modern Template
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 ml-8">
                    Clean and contemporary design with modern layout
                  </p>
                </button>

                <button 
                  onClick={() => setSelectedTemplate('B')}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all duration-200
                    ${selectedTemplate === 'B' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedTemplate === 'B'
                        ? 'border-blue-500'
                        : 'border-gray-400'
                      }
                    `}>
                      {selectedTemplate === 'B' && (
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <span className={`font-medium ${
                      selectedTemplate === 'B'
                        ? 'text-blue-700'
                        : 'text-gray-700'
                    }`}>
                      Classic Template
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 ml-8">
                    Traditional format with proven effectiveness
                  </p>
                </button>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => handleExportClick('pdf')}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Export as PDF
              </button> */}
              <button
                onClick={() => handleExportClick('word')}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Export as Word
              </button>
            </div>
          </div>

          {/* Resume Content Box */}
          <div className="bg-gray-50 rounded-lg border p-6">
            <ResumeTemplate 
            sections={sections}
            templateStyle={selectedTemplate}
            resumeData={resumeData}
            refreshData={refreshData}
            modalHandlers={{
              handleSectionClick: (sectionTitle) => handleSectionClick(sectionTitle, resumeData, refreshData),
              handleExperienceClick: handleExperienceClick
            }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
