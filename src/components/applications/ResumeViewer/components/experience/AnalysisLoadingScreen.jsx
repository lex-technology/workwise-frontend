import { useState, useEffect } from 'react';

export default function AnalysisLoadingScreen({ startTime }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [dots, setDots] = useState('');
    
    const steps = [
        { 
            id: 0, 
            message: "Initializing analysis",
            weight: 5  // Relative weight of step duration
        },
        { 
            id: 1, 
            message: "Processing experience points",
            weight: 15
        },
        { 
            id: 2, 
            message: "Calculating impact scores",
            weight: 20
        },
        { 
            id: 3, 
            message: "Evaluating relevance to job description",
            weight: 20
        },
        { 
            id: 4, 
            message: "Checking for repetitions",
            weight: 15
        },
        { 
            id: 5, 
            message: "Generating improvement suggestions",
            weight: 20
        },
        { 
            id: 6, 
            message: "Finalizing analysis",
            weight: 5
        }
    ];

    // Animate loading dots
    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prev => {
                if (prev.length >= 3) return '';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(dotsInterval);
    }, []);

    // Calculate progress based on elapsed time
    const totalWeight = steps.reduce((acc, step) => acc + step.weight, 0);
    const elapsedTime = Date.now() - startTime;
    
    // Estimate total time as 90 seconds initially, but adjust based on actual elapsed time
    const estimatedTotalTime = Math.max(90000, elapsedTime * 1.1); // Add 10% buffer
    
    // Calculate which step we should be on based on elapsed time
    useEffect(() => {
        const calculateStep = () => {
            const progress = elapsedTime / estimatedTotalTime;
            let accumulatedWeight = 0;
            
            for (let i = 0; i < steps.length; i++) {
                accumulatedWeight += steps[i].weight / totalWeight;
                if (progress <= accumulatedWeight) {
                    return i;
                }
            }
            return steps.length - 1;
        };

        const newStep = calculateStep();
        if (newStep !== currentStep) {
            setCurrentStep(newStep);
        }

        const timer = requestAnimationFrame(() => calculateStep());
        return () => cancelAnimationFrame(timer);
    }, [elapsedTime, estimatedTotalTime]);

    // Calculate progress percentage
    const progress = Math.min((elapsedTime / estimatedTotalTime) * 100, 99); // Cap at 99% until complete

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Analyzing Experience
                </h2>

                {/* Progress bar */}
                <div className="h-2 bg-gray-200 rounded-full mb-8">
                    <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Current step message */}
                <div className="text-center mb-8">
                    <p className="text-lg text-blue-600 font-medium">
                        {steps[Math.min(currentStep, steps.length - 1)].message}
                        <span className="inline-block w-6">{dots}</span>
                    </p>
                </div>

                {/* Step indicators */}
                <div className="grid grid-cols-7 gap-2">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`
                                h-1 rounded-full transition-all duration-500
                                ${index === currentStep ? 'bg-blue-500' : 
                                  index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                            `}
                        />
                    ))}
                </div>

                {/* Step details */}
                <div className="mt-8 space-y-3">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`
                                transition-all duration-300 flex items-center gap-2
                                ${index === currentStep ? 'text-blue-600 font-medium' : 
                                  index < currentStep ? 'text-green-600' : 'text-gray-300'}
                            `}
                        >
                            <div className={`
                                w-5 h-5 rounded-full flex items-center justify-center text-xs
                                ${index === currentStep ? 'bg-blue-100 text-blue-600' :
                                  index < currentStep ? 'bg-green-100 text-green-600' : 'bg-gray-100'}
                            `}>
                                {index < currentStep ? '✓' : index + 1}
                            </div>
                            {step.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 