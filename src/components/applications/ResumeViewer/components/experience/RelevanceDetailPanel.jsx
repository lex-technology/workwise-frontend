import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';

export default function RelevanceDetailPanel({ point, onSortByRelevance }) {
    if (!point || !point.relevance) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No relevance data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">
                    Overall Relevance Score: {point.relevance.score?.toFixed(2)}
                </h4>
                
                <div className="mb-4">
                    <h5 className="text-sm font-medium mb-2">Analysis:</h5>
                    <p className="text-sm text-gray-600">{point.relevance.reason}</p>
                </div>

                {point.relevance.matching_requirements && point.relevance.matching_requirements.length > 0 && (
                    <div className="mb-4">
                        <h5 className="text-sm font-medium mb-2">Matching Job Requirements:</h5>
                        <div className="flex flex-wrap gap-2">
                            {point.relevance.matching_requirements.map((req, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                                >
                                    {req}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {point.relevance.suggested_angle_shifts && point.relevance.suggested_angle_shifts.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-3 text-blue-700">Suggested Angle Shifts</h4>
                    <ul className="space-y-2">
                        {point.relevance.suggested_angle_shifts.map((suggestion, index) => (
                            <li key={index} className="text-sm text-gray-600 flex gap-2">
                                <span className="text-blue-500">•</span>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={onSortByRelevance}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                    <ArrowsUpDownIcon className="h-4 w-4" />
                    Sort by Relevance
                </button>
            </div>
        </div>
    );
} 