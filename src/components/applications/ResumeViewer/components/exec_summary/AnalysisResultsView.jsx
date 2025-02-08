import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRateLimit } from '../../hooks/useRateLimit';

export default function AnalysisResultsView({ 
    versions, 
    onClose, 
    onVersionSelect, 
    currentContent, 
    onGenerateNew 
}) {
    const [editedContent, setEditedContent] = useState('');
    const [showOriginal, setShowOriginal] = useState(false);
    const { isLimited, checkRateLimit } = useRateLimit(5000); 

    useEffect(() => {
        if (versions?.enhanced_version?.content) {
            setEditedContent(versions.enhanced_version.content);
        }
    }, [versions]);

    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    if (!versions?.enhanced_version) {
        return <div>No analysis data available</div>;
    }

    const handleApplyChanges = () => {
        if (!checkRateLimit()) {
            toast.error('Please wait a few seconds before applying changes again');
            return;
        }
        onVersionSelect(editedContent);
    };

    const { enhanced_version, improvement_examples } = versions;

    return (
        <div className="space-y-6">
            {/* Toggle Current Version Button */}
            <button
                onClick={() => setShowOriginal(!showOriginal)}
                className="flex items-center space-x-2 bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 transition-colors duration-200"
            >
                {showOriginal ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                <span className="font-medium">Show Current Version</span>
            </button>

            {/* Current Version (Collapsible) */}
            {showOriginal && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-amber-800">Current Version</h3>
                        {currentContent && (
                            <span className="text-xs text-amber-600">
                                {currentContent.length} characters
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap bg-white p-3 rounded border">
                        {currentContent || 'No current content available'}
                    </div>
                    <button
                        onClick={() => setEditedContent(currentContent)}
                        className="mt-3 text-sm text-amber-700 hover:text-amber-800 flex items-center space-x-1"
                    >
                        <span>Use Current Version</span>
                    </button>
                </div>
            )}
            {/* Enhanced Version Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-xl text-blue-900">Enhanced Executive Summary</h3>
                    <span className="text-xs text-blue-600">
                        {editedContent.length} characters
                    </span>
                </div>
                
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-4 border border-blue-200 rounded-lg bg-white min-h-[150px] text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
                    placeholder="Edit the content..."
                />

                {/* Apply button for AI version */}
                <button
                    onClick={handleApplyChanges}
                    disabled={isLimited}
                    className={`mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 ${
                        isLimited ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <span>Apply Enhanced Version</span>
                    {isLimited && <span className="text-sm">(Please wait...)</span>}
                </button>

                {/* Improvements Explanation */}
                {enhanced_version.rationale?.length > 0 && (
                    <div className="mt-4 bg-white p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">Key Improvements</h4>
                        <ul className="space-y-2">
                            {enhanced_version.rationale.map((point, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Additional Relevant Experiences */}
            {/* {versions.additional_opportunities?.relevant_experiences && (
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">Other Relevant Experiences</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        These experiences from your work history also align well with the job requirements and could be considered for future versions:
                    </p>
                    <div className="space-y-4">
                        {Object.entries(versions.additional_opportunities.relevant_experiences).map(([key, value], index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

            {/* Action Buttons at bottom */}
            <div className="flex justify-end space-x-3 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onGenerateNew}
                    className="px-4 py-2 border rounded bg-green-50 text-green-700 hover:bg-green-100"
                >
                    Generate New
                </button>
            </div>
        </div>
    );
}