'use client'
import React, { useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// added analysisStatus
export default function JDViewer({ resumeData, analysisStatus, isAnalyzing, isComplete, isFailed }) {
  console.log('Initial resumeData:', resumeData);

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

  const getSkillTypeColor = (skillType) => {
    switch (skillType?.toLowerCase()) {
      case 'technical skills': return 'text-blue-700'
      case 'domain knowledge': return 'text-purple-700'
      case 'soft skills': return 'text-yellow-700'
      default: return 'text-gray-700'
    }
  }

  const renderHighlightedText = (item) => {
    // console.log('Rendering highlighted text for item:', item);
    const { line_text, skill_type, has_skill, source, gap_analysis } = item;
    const skillColor = getSkillTypeColor(skill_type);

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
              <span className={skillColor}>{skill_type}</span>
            </div>
            <div className={`font-semibold mb-1 ${has_skill ? 'text-green-900' : 'text-red-900'}`}>
              {line_text}
            </div>
            {has_skill ? (
              <div className="text-green-700">
                <div className="font-medium">Found in Resume:</div>
                <div className="text-sm mb-1">{source.evidence}</div>
                <div className="text-sm text-green-600 italic">
                  {source.reason}
                </div>
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
    );
  };

  const processedJD = useMemo(() => {
    // console.log('Processing JD - Raw text:', resumeData?.job_description);
    
    if (!resumeData?.job_description) {
      return [];
    }

    let analysis = resumeData.jd_analysis;
    if (typeof analysis === 'string') {
      try {
        analysis = JSON.parse(analysis);
      } catch (e) {
        console.error('Error parsing jd_analysis:', e);
        analysis = [];
      }
    }

    if (!Array.isArray(analysis)) {
      console.log('Analysis is not an array, returning raw text');
      return [{ type: 'text', content: resumeData.job_description }];
    }

    // console.log('Parsed analysis:', analysis);

    // Keep track of processed text
    let fullText = resumeData.job_description;
    
    // Sort by length to handle nested matches
    const sortedAnalysis = [...analysis].sort((a, b) => 
      b.line_text.length - a.line_text.length
    );

    // console.log('Sorted analysis:', sortedAnalysis);

    // Create markers for each highlight
    const markers = [];
    sortedAnalysis.forEach((item, index) => {
      const { line_text } = item;
      if (!line_text) return;
      
      const marker = `___HIGHLIGHT_${index}___`;
      markers.push({
        marker,
        item
      });
      
      fullText = fullText.split(line_text).join(marker);
    });

    // console.log('Text with markers:', fullText);
    // console.log('Markers:', markers);

    // Process back into segments
    const segments = [];
    let currentText = '';

    for (let i = 0; i < fullText.length; i++) {
      let foundMarker = false;
      for (const { marker, item } of markers) {
        if (fullText.slice(i, i + marker.length) === marker) {
          if (currentText) {
            segments.push(currentText);
            currentText = '';
          }
          segments.push({ type: 'highlight', item });
          i += marker.length - 1;
          foundMarker = true;
          break;
        }
      }
      if (!foundMarker) {
        currentText += fullText[i];
      }
    }

    if (currentText) {
      segments.push(currentText);
    }

    console.log('Final processed segments:', segments);
    return segments;
  }, [resumeData]);

  const renderContent = (segments) => {
    // console.log('Rendering segments:', segments);
    return segments.map((segment, index) => {
      // console.log('Processing segment:', segment);
      if (typeof segment === 'string') {
        return <React.Fragment key={index}>{segment}</React.Fragment>;
      }
      if (segment.type === 'highlight') {
        return <React.Fragment key={index}>{renderHighlightedText(segment.item)}</React.Fragment>;
      }
      console.warn('Unknown segment type:', segment);
      return null;
    });
  };
  // Render loading state
  const renderLoadingState = () => (
    <div className="animate-pulse space-y-4 mt-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        <div className="space-y-3 mt-6">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
)
    const renderErrorState = () => (
      <div className="mt-4 text-center py-6">
          <div className="text-red-500 mb-2">
              Failed to analyze job description
          </div>
          <p className="text-sm text-gray-600">
              The analysis couldn't be completed. Please try again later.
          </p>
      </div>
    )

  return (
  //   <TooltipProvider>
  //     <div className="bg-white rounded-xl shadow-sm border p-6">
  //       {/* Application Details */}
  //       <div className="mb-6">
  //         {resumeData.company_applied && (
  //           <div className="mb-4">
  //             <div className="flex justify-between items-center">
  //               <h3 className="text-lg font-semibold text-gray-900">
  //                 {resumeData.company_applied}
  //               </h3>
  //               {resumeData.status && (
  //                 <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resumeData.status)}`}>
  //                   {resumeData.status}
  //                 </span>
  //               )}
  //             </div>
  //             {resumeData.role_applied && (
  //               <p className="text-gray-600 mt-1">
  //                 {resumeData.role_applied}
  //               </p>
  //             )}
  //           </div>
  //         )}
  //       </div>

  //       {/* Job Description */}
  //       <div className="border-t pt-4">
  //         <h2 className="text-xl font-semibold mb-2">Job Description</h2>
  //         <div className="mb-4">
  //           <div className="flex gap-4 text-xs">
  //             <div className="flex items-center gap-2">
  //               <div className={`w-3 h-3 rounded ${skillTypeStyles['technical skills']}`}></div>
  //               <span>Technical Skills</span>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <div className={`w-3 h-3 rounded ${skillTypeStyles['domain knowledge']}`}></div>
  //               <span>Domain Knowledge</span>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <div className={`w-3 h-3 rounded ${skillTypeStyles['soft skills']}`}></div>
  //               <span>Soft Skills</span>
  //             </div>
  //           </div>
  //           <div className="flex gap-4 text-xs mt-2">
  //             <div className="flex items-center gap-2">
  //               <span className="border-b-2 border-green-400 px-2">abc</span>
  //               <span>Found in your resume</span>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <span className="border-b border-red-400 px-2">abc</span>
  //               <span>Skill to develop</span>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="prose max-w-none">
  //           <pre className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-sans text-justify">
  //             {renderContent(processedJD)}
  //           </pre>
  //         </div>
  //       </div>


  //     </div>
  //   </TooltipProvider>
  // );
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
                      <span className={`
                          inline-block px-2 py-1 rounded-full text-xs font-medium
                          ${isAnalyzing ? 'bg-yellow-100 text-yellow-800' :
                            isFailed ? 'bg-red-100 text-red-800' :
                            isComplete ? getStatusColor(resumeData.status) :
                            'bg-gray-100 text-gray-800'}
                      `}>
                          {isAnalyzing ? 'Analyzing...' :
                           isFailed ? 'Analysis Failed' :
                           resumeData.status}
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
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          
          {/* Only show legend if analysis is complete */}
          {isComplete && (
              <div className="mb-4">
                  <div className="flex gap-4 text-xs">
                      {/* Your existing legend items */}
                  </div>
              </div>
          )}
          
          <div className="prose max-w-none">
              {/* Show original description while analyzing */}
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {resumeData.job_description}
              </div>

              {/* Show appropriate state below the description */}
              {isAnalyzing && (
                  <>
                      <div className="mt-6 mb-2 text-sm text-gray-600">
                          Analyzing job requirements...
                      </div>
                      {renderLoadingState()}
                  </>
              )}

              {isFailed && renderErrorState()}

              {isComplete && (
                  <div className="mt-6 border-t pt-4">
                      <pre className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-sans text-justify">
                          {renderContent(processedJD)}
                      </pre>
                  </div>
              )}
          </div>
      </div>
  </div>
</TooltipProvider>
  );
}
