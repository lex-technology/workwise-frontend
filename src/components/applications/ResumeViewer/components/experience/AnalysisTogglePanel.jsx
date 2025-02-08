import { ChartBarIcon, TagIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export default function AnalysisTogglePanel({ activeView, onViewChange }) {
    const views = [
        {
            id: 'repetition',
            label: 'Repetition',
            icon: DocumentDuplicateIcon,
            description: 'Identify repeated or similar points',
            legend: [
                { color: 'bg-red-100', range: '', label: 'Repeated Content' }
            ]
        },
        {
            id: 'relevance',
            label: 'Relevance',
            icon: TagIcon,
            description: 'Check how well each point matches the job description',
            legend: [
                { color: 'bg-green-100', range: '0.7 - 1.0', label: 'Highly Relevant' },
                { color: 'bg-yellow-100', range: '0.4 - 0.69', label: 'Moderately Relevant' },
                { color: 'bg-red-100', range: '0.0 - 0.39', label: 'Not Relevant' }
            ]
        },
        {
            id: 'impact',
            label: 'Impact',
            icon: ChartBarIcon,
            description: 'Evaluate the strength and effectiveness of each point',
            legend: [
                { color: 'bg-green-100', range: '0.7 - 1.0', label: 'High Impact' },
                { color: 'bg-yellow-100', range: '0.4 - 0.69', label: 'Medium Impact' },
                { color: 'bg-red-100', range: '0.0 - 0.39', label: 'Low Impact' }
            ]
        }
    ];

    const isViewEnabled = (viewId) => {
        if (!activeView) return viewId === 'repetition'; // Only repetition enabled at start
        
        switch (activeView) {
            case 'repetition':
                return viewId === 'repetition' || viewId === 'relevance';
            case 'relevance':
                return viewId === 'relevance' || viewId === 'repetition' || viewId === 'impact';
            case 'impact':
                return viewId === 'impact' || viewId === 'relevance';
            default:
                return false;
        }
    };

    return (
        <div className="bg-white rounded-lg p-4">
            {/* Tabs at the top */}
            <div className="flex items-center border-b mb-4">
                {views.map((view, index) => {
                    const enabled = isViewEnabled(view.id);
                    return (
                        <div key={view.id} className="flex items-center">
                            <button
                                onClick={() => enabled && onViewChange(view.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 -mb-px
                                    ${activeView === view.id 
                                        ? 'border-b-2 border-blue-500 text-blue-600' 
                                        : enabled
                                            ? 'text-gray-500 hover:text-gray-700'
                                            : 'text-gray-300 cursor-not-allowed'
                                    }
                                `}
                                disabled={!enabled}
                            >
                                <view.icon className={`h-4 w-4 ${!enabled && 'opacity-50'}`} />
                                <span className="font-medium text-sm">{view.label}</span>
                            </button>
                            {index < views.length - 1 && (
                                <span className="text-gray-400 px-2">
                                    →
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Active view description and legend */}
            {activeView && views.map((view) => (
                view.id === activeView && (
                    <div key={view.id} className="text-sm">
                        <p className="text-gray-600 mb-3">
                            {view.description}
                        </p>
                        <div className="flex gap-4">
                            {view.legend.map((item, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <span 
                                        className={`
                                            inline-block w-3 h-3 rounded
                                            ${item.color}
                                        `}
                                    />
                                    <span className="text-xs text-gray-600">
                                        {item.range && `${item.range}: `}
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
} 