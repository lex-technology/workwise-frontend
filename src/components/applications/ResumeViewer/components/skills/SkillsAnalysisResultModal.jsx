'use client'

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import { SkillsManager } from '@/utils/skillsService';
import { updateSection } from '../../utils/sectionHandlers';

export default function SkillsAnalysisResultModal({ isOpen, onClose, analysisResults, currentSkills, loading, resumeId, onGenerateNew }) {
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [skillsManager] = useState(() => {
        const manager = new SkillsManager(currentSkills);
        console.log('Initializing SkillsManager with currentSkills:', currentSkills);
        manager.initializeFromAnalysis(analysisResults);
        console.log('After initialization with analysis results:', analysisResults);
        return manager;
    });
    // Add state to force re-renders
    const [, forceUpdate] = useState({});

    const handleSkillClick = (skill, type) => {
        console.log('resumeId in handleSkillClick:', resumeId);
        console.log('handleSkillClick called with:', { 
            skill, 
            type,
            skillsManager: skillsManager
        });
        
        // For existing skills that aren't removed, don't show details
        if (type === 'existing') {
            try {
                const isRemoved = skillsManager.isSkillRemoved(skill, type);
                console.log('Checking if skill is removed:', { 
                    skill, 
                    type,
                    isRemoved,
                    removedSkills: skillsManager.removedSkills
                });
                
                if (!isRemoved) {
                    console.log('Skipping details for unremoved existing skill');
                    return;
                }
            } catch (error) {
                console.error('Error checking if skill is removed:', error);
                return;
            }
        }

        try {
            const details = skillsManager.getSkillDetails(skill, type);
            console.log('Retrieved skill details:', { 
                skill, 
                type, 
                details,
                skillsManagerState: {
                    currentSkills: skillsManager.currentSkills,
                    addedSkills: skillsManager.addedSkills,
                    removedSkills: skillsManager.removedSkills
                }
            });

            if (details) {
                setSelectedSkill({
                    skill,
                    type: details.type,
                    details: details.details
                });
            }
        } catch (error) {
            console.error('Error getting skill details:', error);
        }
    };

    const handleRemoveSkill = (skill, type, isExisting = false) => {
        console.log('Before removal - Current state:', {
            currentSkills: {
                technical: skillsManager.getCurrentSkills('technical'),
                soft: skillsManager.getCurrentSkills('soft')
            },
            addedSkills: {
                technical: skillsManager.getAddedSkills('technical'),
                soft: skillsManager.getAddedSkills('soft')
            },
            removedSkills: {
                technical: skillsManager.getRemovedSkills('technical'),
                soft: skillsManager.getRemovedSkills('soft')
            }
        });

        skillsManager.removeSkill(skill, type, isExisting);
        console.log(`Removing ${isExisting ? 'existing' : 'added'} skill:`, { skill, type });

        console.log('After removal - Current state:', {
            currentSkills: {
                technical: skillsManager.getCurrentSkills('technical'),
                soft: skillsManager.getCurrentSkills('soft')
            },
            addedSkills: {
                technical: skillsManager.getAddedSkills('technical'),
                soft: skillsManager.getAddedSkills('soft')
            },
            removedSkills: {
                technical: skillsManager.getRemovedSkills('technical'),
                soft: skillsManager.getRemovedSkills('soft')
            }
        });

        const finalSkills = skillsManager.getFinalSkills();
        console.log('Current JSON format for DB:', finalSkills);

        // Force re-render and clear selected skill
        setSelectedSkill(null);
        forceUpdate({});
    };

    const handleSave = async () => {
        try {
            const finalSkills = skillsManager.getFinalSkills();
            console.log('Saving skills:', finalSkills);
            
            await updateSection(resumeId, 'skills', finalSkills);
            onClose();
        } catch (error) {
            console.error('Error saving skills:', error);
        }
    };

    // Render existing technical skills
    const renderExistingSkills = (type) => {
        const currentSkills = skillsManager.getCurrentSkills(type);
        const addedSkills = skillsManager.getAddedSkills(type);
        const removedSkills = skillsManager.getRemovedSkills(type);

        console.log(`Rendering ${type} skills:`, { currentSkills, addedSkills, removedSkills });

        return (
            <div className="flex flex-wrap gap-2">
                {/* Existing Skills (blue or red if marked for removal) */}
                {currentSkills.map((skill, index) => {
                    const isRemoved = skillsManager.isSkillRemoved(skill, type);
                    console.log(`Checking if ${skill} is removed:`, isRemoved);
                    
                    return (
                        <span 
                            key={`existing-${type}-${index}`}
                            onClick={() => handleSkillClick(skill, 'existing')}
                            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                                isRemoved ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}
                        >
                            {skill}
                            {isRemoved && 
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveSkill(skill, type, true);
                                    }}
                                    className="ml-2 text-xs"
                                >
                                    ×
                                </button>
                            }
                        </span>
                    );
                })}

                {/* Added Skills (green) */}
                {addedSkills.map((skillData, index) => (
                    <span 
                        key={`added-${type}-${index}`}
                        onClick={() => handleSkillClick(skillData.skill, 'added')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm cursor-pointer"
                    >
                        {skillData.skill}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSkill(skillData.skill, type, false);
                            }}
                            className="ml-2 text-xs"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Analysis Results</h2>

                {/* Legend */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-full bg-blue-100"></span>
                            <span className="text-gray-600">Existing Skills</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-full bg-green-100"></span>
                            <span className="text-gray-600">AI Suggested Additions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-full bg-red-100"></span>
                            <span className="text-gray-600">AI Suggested Removals</span>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h3>
                    {renderExistingSkills('technical')}

                    <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Soft Skills</h3>
                    {renderExistingSkills('soft')}
                </div>

                {/* Skill Details Panel */}
                {selectedSkill && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">{selectedSkill.skill}</h4>
                        {selectedSkill.type === 'added' ? (
                            <div className="text-sm text-gray-600">
                                {/* <p><span className="font-medium">Job Requirement:</span> {selectedSkill.details.jd_requirement}</p> */}
                                <p><span className="font-medium">Experience Reference:</span> {selectedSkill.details.experience_reference}</p>
                                {/* <p><span className="font-medium">Reason:</span> {selectedSkill.details.reason}</p> */}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600">
                                <p><span className="font-medium">Reason for Removal:</span> {selectedSkill.details.reason}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Missing Skills Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Development Opportunities</h3>
                    <div className="space-y-4">
                        {analysisResults?.missing_skills?.technical_skills?.map((skill, index) => (
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

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onGenerateNew}
                        className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-md hover:bg-green-100"
                    >
                        Generate New
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </Modal>
    );
} 