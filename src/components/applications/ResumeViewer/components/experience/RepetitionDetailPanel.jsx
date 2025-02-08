export default function RepetitionDetailPanel({ point }) {
    if (!point || !point.repetition) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No repetition data available</p>
            </div>
        );
    }

    console.log('Repetition detail data:', {
        point,
        repetitionData: point.repetition
    });

    return (
        <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Repetition Analysis</h3>
            
            <div className="space-y-4">
                {point.repetition.is_repeated ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-600 mb-2">
                            Repetition Detected
                        </h4>
                        <p className="text-sm text-gray-700 mb-4">
                            {point.repetition.similarity_explanation}
                        </p>
                        
                        {point.repetition.similar_points && point.repetition.similar_points.length > 0 && (
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium">Similar Points:</h5>
                                {point.repetition.similar_points.map((similarPoint, idx) => (
                                    <div 
                                        key={idx} 
                                        className="text-sm bg-white p-3 rounded border border-red-100"
                                    >
                                        {similarPoint}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-600">
                            No Repetition Found
                        </h4>
                        <p className="text-sm text-gray-700 mt-1">
                            This point is unique within your experience section.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 