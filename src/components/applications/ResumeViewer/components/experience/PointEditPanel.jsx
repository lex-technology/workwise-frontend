import { useState, useEffect } from 'react';
import { PencilIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function PointEditPanel({ point, isEditing, setIsEditing, onApply, modifiedPoints }) {
    console.log('PointEditPanel props:', {
        point,
        modifiedPoints: {
            type: modifiedPoints?.constructor.name,
            size: modifiedPoints?.size,
            entries: modifiedPoints ? Array.from(modifiedPoints.entries()) : []
        }
    });

    // Initialize with modified text from Map, or AI suggestion if not modified
    const [editedImprovement, setEditedImprovement] = useState(
        modifiedPoints?.get(point?.point_id)?.text || point?.improvement?.rewritten_point || ''
    );
    
    // Update editedImprovement when point changes, using modifiedPoints Map
    useEffect(() => {
        const modifiedText = modifiedPoints?.get(point?.point_id)?.text;
        setEditedImprovement(
            modifiedText || point?.improvement?.rewritten_point || ''
        );
    }, [point, modifiedPoints]);

    console.log('PointEditPanel state:', {
        pointId: point?.point_id,
        isModified: modifiedPoints?.has(point?.point_id),
        modifiedText: modifiedPoints?.get(point?.point_id)?.text,
        currentValue: editedImprovement
    });

    const handleApply = () => {
        console.log('Applying changes for point:', {
            pointId: point.point_id,
            originalText: point.original_text,
            newText: editedImprovement
        });
        
        onApply(point, {
            text: editedImprovement,
            version: 'improvement'
        });
    };

    const renderScoreBreakdown = () => (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Score Breakdown</h4>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(point.scoring_breakdown).map(([key, value]) => (
                    <div key={key} className="text-sm">
                        <div className="flex justify-between items-center mb-1">
                            <span className="capitalize">{key.replace('_', ' ')}</span>
                            <span className="font-medium">{value.score.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-600">{value.feedback}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Point Details</h3>

            <div className="space-y-6">
                {/* Original Text Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Original Text</h4>
                    </div>
                    <p className="text-gray-800 mb-4">{point.original_text}</p>
                    {!modifiedPoints?.has(point?.point_id) && renderScoreBreakdown()}
                </div>

                {/* AI Improvement Section - Always Editable */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-blue-700">AI Enhanced Version</h4>
                        <button
                            onClick={handleApply}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <CheckIcon className="h-5 w-5" />
                            Apply Changes
                        </button>
                    </div>
                    
                    <textarea
                        value={editedImprovement}
                        onChange={(e) => setEditedImprovement(e.target.value)}
                        className="w-full p-2 border rounded-lg mb-4 bg-white border-blue-300 focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Edit the AI suggestion..."
                    />
                    
                    <div className="space-y-4">
                        <div>
                            <h5 className="font-medium text-sm text-blue-700 mb-1">Why this improvement?</h5>
                            <p className="text-sm text-gray-600">{point.improvement?.explanation}</p>
                        </div>
                        
                        {point.improvement?.improvements_made && point.improvement.improvements_made.length > 0 && (
                            <div>
                                <h5 className="font-medium text-sm text-blue-700 mb-1">Key Improvements</h5>
                                <ul className="list-disc pl-5 space-y-1">
                                    {point.improvement.improvements_made.map((improvement, index) => (
                                        <li key={index} className="text-sm text-gray-600">{improvement}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 