'use client'
import { templateConfig } from './templateConfig'
import { renderSection } from './sectionRenderer'
import { evaluateTemplateSpecificTips } from './templateUtils'
import { useState } from 'react'

export default function ResumeTemplate({ sections, modalHandlers, templateStyle, resumeData }) {
  const config = templateConfig[templateStyle]
  const { styles, validation, sectionOrder, editableConfig } = config
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Get resumeId from URL
  const urlParams = new URLSearchParams(window.location.search)
  const resumeId = urlParams.get('id')

  // Check for missing sections
  const missingSections = validation.required.filter(
    sectionKey => !sections[sectionKey]?.content && !sections[sectionKey]?.entries?.length
  )

  // Get template-specific tips
  const applicableTips = evaluateTemplateSpecificTips(config, sections)
  console.log('Tips:', { config, sections, applicableTips }) // Debug log

  const toggleDropdown = (type) => {
    setActiveDropdown(activeDropdown === type ? null : type)
  }

  const isEditable = (sectionKey) => {
    return editableConfig[sectionKey] || false
  }

  const isEntryEditable = (sectionKey) => {
    return sectionKey === 'experience'
  }

  const getEditableStyles = (sectionKey, section) => {
    if (!isEditable(sectionKey)) return ''
    if (isEntryEditable(sectionKey)) return ''

    const baseStyles = 'cursor-pointer border-l-4 pl-4'
    return section.ai_improved_section 
      ? `${baseStyles} hover:bg-green-50 border-green-500 bg-green-25` 
      : `${baseStyles} hover:bg-blue-50 border-blue-500 bg-blue-25`
  }

  // Map section keys to titles for the modal
  const sectionTitles = {
    summary: 'Executive Summary',
    skills: 'Skills',
    experience: 'Professional Experience',
    // ... add other mappings as needed
  }

  return (
    <div className="space-y-6">
      {/* Feedback Section */}
      <div className="flex gap-4">
        {/* Warnings Dropdown */}
        {missingSections.length > 0 && (
          <div className="flex-1">
            <button
              onClick={() => toggleDropdown('warnings')}
              className="w-full flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-t-lg hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-yellow-800">
                  Recommended Sections ({missingSections.length})
                </span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform ${activeDropdown === 'warnings' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'warnings' && (
              <div className="p-4 border border-t-0 border-yellow-200 rounded-b-lg bg-yellow-50">
                <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700">
                  {missingSections.map(section => (
                    <li key={section}>
                      {validation.messages[section]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tips Dropdown */}
        {applicableTips.length > 0 && (
          <div className="flex-1">
            <button
              onClick={() => toggleDropdown('tips')}
              className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-t-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-blue-800">
                  Tips for Resume Structure ({applicableTips.length})
                </span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform ${activeDropdown === 'tips' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'tips' && (
              <div className="p-4 border border-t-0 border-blue-200 rounded-b-lg bg-blue-50">
                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                  {applicableTips.map((tip, index) => (
                    <li key={index}>{tip.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resume content */}
      <div className={`${styles.container} resume-export`}>
        {sectionOrder.map(sectionKey => (
          sections[sectionKey] && (
            <section 
              key={sectionKey}
              data-section={sectionKey}
              className={`
                ${styles[sectionKey]?.container} 
                group 
                relative 
                transition-all 
                ${getEditableStyles(sectionKey, sections[sectionKey])}
              `}
              onClick={() => {
                if (isEditable(sectionKey) && !isEntryEditable(sectionKey) && modalHandlers.handleSectionClick) {
                  modalHandlers.handleSectionClick(sectionTitles[sectionKey], resumeId, resumeData)
                }
              }}
            >
              {/* Edit indicator - only show for editable sections that aren't entry-based */}
              {isEditable(sectionKey) && !isEntryEditable(sectionKey) && (
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`text-xs px-2 py-1 rounded-md ${
                    sections[sectionKey].ai_improved_section 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {sections[sectionKey].ai_improved_section 
                      ? 'Analysed with AI' 
                      : 'Click to edit'}
                  </span>
                </div>
              )}
              {renderSection(
                sections[sectionKey], 
                {
                  ...styles[sectionKey],
                  content: `${styles[sectionKey]?.content} relative`,
                  entry: `${styles[sectionKey]?.entry} ${
                    isEntryEditable(sectionKey) ? 
                    'cursor-pointer transition-all my-4 border-l-4 pl-4' : ''
                  }`
                },
                modalHandlers,
                isEditable(sectionKey)
              )}
            </section>
          )
        ))}
      </div>
    </div>
  )
} 