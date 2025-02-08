import { TrashIcon } from '@heroicons/react/24/outline';

export default function ExperiencePoints({
    points = [],
    activeView,
    getHighlightColor,
    onPointClick,
    modifiedPoints,
    onDeletePoint
}) {
    console.log('ExperiencePoints received:', {
        pointsCount: points?.length,
        activeView,
        samplePoint: points[0],
        modifiedPointsSize: modifiedPoints?.size
    });

    const getPointHighlight = (point) => {
        // Don't highlight modified points in any view
        if (modifiedPoints.has(point.point_id)) {
            return '';
        }

        if (!activeView) return '';

        if (activeView === 'repetition') {
            return point.repetition?.is_repeated ? 'bg-red-100' : '';
        }

        // Get the appropriate score based on the active view
        const score = activeView === 'impact' 
            ? point.impact_score 
            : point.relevance?.score;

        return getHighlightColor(score);
    };

    const shouldShowTrashIcon = (point) => {
        if (activeView === 'impact') return false;
        
        if (activeView === 'relevance') {
            // Increase threshold to 0.5 to make it more visible for testing
            // You can adjust this threshold as needed
            const threshold = 0.4;
            const score = point.relevance?.score ?? 1;
            
            console.log('Checking relevance score:', {
                pointId: point.point_id,
                score,
                threshold,
                showTrash: score < threshold,
                activeView
            });
            
            return score < threshold; // Show trash for scores below 0.5
        }
        
        if (activeView === 'repetition') {
            return point.repetition?.is_repeated;
        }
        
        return false;
    };

    const handleDelete = (e, point) => {
        e.stopPropagation(); // Prevent triggering the point click
        onDeletePoint(point);
    };

    const renderPoint = (point, index) => {
        console.log('Rendering point:', {
            pointId: point.point_id,
            activeView,
            relevanceScore: point.relevance?.score,
            showTrash: shouldShowTrashIcon(point),
            highlightClass: getPointHighlight(point)
        });

        const highlightClass = getPointHighlight(point);
        const isModified = modifiedPoints.has(point.point_id);
        const showTrash = shouldShowTrashIcon(point);
        
        const displayText = isModified 
            ? modifiedPoints.get(point.point_id).text
            : point.original_text;

        return (
            <li
                key={point.point_id}
                className={`relative flex gap-x-4 pb-4 cursor-pointer ${highlightClass} ${
                    isModified ? 'border-l-4 border-blue-500 pl-4' : ''
                }`}
                onClick={() => onPointClick(point)}
            >
                <span className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                    isModified ? 'bg-blue-500' : 'bg-gray-400'
                }`} />
                
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <span className="text-sm">{displayText}</span>
                        {showTrash && (
                            <button
                                onClick={(e) => handleDelete(e, point)}
                                className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Delete point"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    
                    {activeView && !isModified && (
                        <div className="text-xs text-gray-500 mt-1">
                            {activeView === 'impact' && (
                                <span>Impact Score: {point.impact_score?.toFixed(2)}</span>
                            )}
                            {activeView === 'relevance' && (
                                <span>Relevance Score: {point.relevance?.score?.toFixed(2)}</span>
                            )}
                            {activeView === 'repetition' && point.repetition?.is_repeated && (
                                <div className="text-red-500">
                                    Repetition detected
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </li>
        );
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Experience Points</h3>
            {activeView && (
                <div className="text-sm text-gray-600 mb-2">
                    Click on a point to see details and edit
                </div>
            )}
            <ul className="space-y-2">
                {points.length > 0 ? 
                    points.map((point, index) => renderPoint(point, index))
                    :
                    <li className="text-gray-500">No points available</li>
                }
            </ul>
        </div>
    );
} 