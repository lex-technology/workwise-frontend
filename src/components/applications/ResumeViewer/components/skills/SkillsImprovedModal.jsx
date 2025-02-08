'use client'

import { useState } from 'react';
import Modal from '@/components/ui/modal';

export default function SkillsImprovedModal({ 
    isOpen, 
    onClose, 
    currentSkills, 
    analysisResults,
    onGenerateNew,
    loading 
}) {
    // Parse skills and filter out empty ones
    const softSkills = Array.isArray(currentSkills) 
        ? currentSkills[0]?.soft_skills?.split(', ').filter(skill => skill.trim()) || []
        : [];
    
    const technicalSkills = Array.isArray(currentSkills) 
        ? currentSkills[0]?.technical_skills?.split(', ').filter(skill => skill.trim()) || []
        : [];

    if (loading) {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Skills</h2>

                {/* Success Banner */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                                Your skills have been optimized with AI suggestions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Current Skills Section */}
                <div className="space-y-6 mb-8">
                    {technicalSkills.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {technicalSkills.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {softSkills.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Soft Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {softSkills.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Missing Skills Section */}
                {analysisResults?.missing_skills && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Development Opportunities</h3>
                        <div className="space-y-4">
                            {analysisResults.missing_skills.technical_skills?.map((skill, index) => (
                                <div key={index} className="border border-gray-200 p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium text-gray-900">{skill.skill}</div>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            skill.importance === 'critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {skill.importance}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2">
                                        <div className="mt-1">{skill.development_path}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <button
                        onClick={onGenerateNew}
                        className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-md hover:bg-green-100"
                    >
                        Generate New
                    </button>
                </div>
            </div>
        </Modal>
    );
} 