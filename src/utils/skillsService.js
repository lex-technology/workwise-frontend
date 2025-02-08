import { updateSection } from '../components/applications/ResumeViewer/utils/sectionHandlers';

export const formatSkillsArray = (skillsString) => {
    return skillsString ? skillsString.split(', ').filter(skill => skill.trim()) : [];
};

export const formatSkillsString = (skillsArray) => {
    return skillsArray.join(', ');
};

export class SkillsManager {
    constructor(initialSkills) {
        this.currentSkills = {
            soft_skills: formatSkillsArray(initialSkills?.[0]?.soft_skills || ''),
            technical_skills: formatSkillsArray(initialSkills?.[0]?.technical_skills || '')
        };
        
        this.addedSkills = {
            soft_skills: new Map(),
            technical_skills: new Map()
        };
        
        this.removedSkills = {
            soft_skills: new Map(),
            technical_skills: new Map()
        };

        this.confirmedRemovals = {
            soft_skills: new Set(),
            technical_skills: new Set()
        };

        console.log('SkillsManager initialized with:', {
            currentSkills: this.currentSkills,
            addedSkills: this.addedSkills,
            removedSkills: this.removedSkills,
            confirmedRemovals: this.confirmedRemovals
        });
    }

    // Add a new skill with its details
    addSkill(skillData, type) {
        const skillType = `${type}_skills`;
        this.addedSkills[skillType].set(skillData.skill, skillData);
    }

    // Remove an existing skill permanently
    confirmRemoval(skill, type) {
        const skillType = `${type}_skills`;
        // Add to confirmed removals
        this.confirmedRemovals[skillType].add(skill);
        // Remove from current skills
        this.currentSkills[skillType] = this.currentSkills[skillType]
            .filter(s => s !== skill);
        // Remove from removed skills map (since it's now confirmed)
        this.removedSkills[skillType].delete(skill);
    }

    // Remove a suggested (added) skill
    removeAddedSkill(skill, type) {
        const skillType = `${type}_skills`;
        this.addedSkills[skillType].delete(skill);
    }

    // Get all current skills (excluding confirmed removals)
    getCurrentSkills(type) {
        const skillType = `${type}_skills`;
        return this.currentSkills[skillType].filter(
            skill => !this.confirmedRemovals[skillType].has(skill)
        );
    }

    // Get all added skills
    getAddedSkills(type) {
        const skillType = `${type}_skills`;
        return Array.from(this.addedSkills[skillType].values());
    }

    // Get all removed skills
    getRemovedSkills(type) {
        const skillType = `${type}_skills`;
        return Array.from(this.removedSkills[skillType].values());
    }

    // Check if a skill is marked for removal
    isSkillRemoved(skill, type) {
        console.log('isSkillRemoved called with:', { skill, type });
        
        // Check both technical and soft skills maps
        for (const skillType of ['technical_skills', 'soft_skills']) {
            if (this.removedSkills[skillType]?.has(skill)) {
                return true;
            }
        }
        
        return false;
    }

    // Get details for a specific skill
    getSkillDetails(skill, type) {
        console.log('getSkillDetails called with:', { skill, type });
        
        // For added skills
        if (type === 'added') {
            // Check both technical and soft skills maps
            for (const skillType of ['technical_skills', 'soft_skills']) {
                if (this.addedSkills[skillType]?.has(skill)) {
                    const details = this.addedSkills[skillType].get(skill);
                    console.log('Found added skill details:', details);
                    return {
                        type: 'added',
                        details
                    };
                }
            }
        }
        
        // For removed skills
        if (type === 'existing') {
            // Check both technical and soft skills maps
            for (const skillType of ['technical_skills', 'soft_skills']) {
                if (this.removedSkills[skillType]?.has(skill)) {
                    const details = this.removedSkills[skillType].get(skill);
                    console.log('Found removed skill details:', details);
                    return {
                        type: 'removed',
                        details
                    };
                }
            }
        }
        
        console.log('No details found for skill');
        return null;
    }

    // Remove an existing skill
    removeExistingSkill(skill, type, reason) {
        const skillType = `${type}_skills`;
        // Only add to removedSkills if it was an existing skill
        if (this.currentSkills[skillType].includes(skill)) {
            this.removedSkills[skillType].set(skill, { skill, reason });
        }
    }

    // Initialize from analysis results
    initializeFromAnalysis(analysisResults) {
        // Add new skills
        analysisResults?.added_skills?.technical_skills?.forEach(skill => 
            this.addSkill(skill, 'technical'));
        analysisResults?.added_skills?.soft_skills?.forEach(skill => 
            this.addSkill(skill, 'soft'));
        
        // Mark skills for removal
        analysisResults?.removed_skills?.technical_skills?.forEach(skill => 
            this.removeExistingSkill(skill.skill, 'technical', skill.reason));
        analysisResults?.removed_skills?.soft_skills?.forEach(skill => 
            this.removeExistingSkill(skill.skill, 'soft', skill.reason));
    }

    // Get final skills for DB
    getFinalSkills() {
        const finalSkills = {
            technical_skills: this.currentSkills.technical_skills.filter(
                skill => !this.confirmedRemovals.technical_skills.has(skill)
            ),
            soft_skills: this.currentSkills.soft_skills.filter(
                skill => !this.confirmedRemovals.soft_skills.has(skill)
            )
        };
    
        // Add new skills from addedSkills maps
        const addedTechnical = this.getAddedSkills('technical').map(skill => skill.skill);
        const addedSoft = this.getAddedSkills('soft').map(skill => skill.skill);
    
        // Return an array with one object
        return [{
            technical_skills: formatSkillsString([...finalSkills.technical_skills, ...addedTechnical]),
            soft_skills: formatSkillsString([...finalSkills.soft_skills, ...addedSoft])
        }];
    }

    // Remove an existing skill from removed skills (undo removal)
    undoRemoveExistingSkill(skill, type) {
        const skillType = `${type}_skills`;
        this.removedSkills[skillType].delete(skill);
    }

    // Unified remove skill method
    removeSkill(skill, type, isExisting = false) {
        const skillType = type.replace('_skills', '');
        
        if (isExisting) {
            // If it's a removed skill (red badge), confirm removal
            if (this.isSkillRemoved(skill, skillType)) {
                console.log(`Confirming removal of ${skill}`);
                this.confirmRemoval(skill, skillType);
            }
        } else {
            this.removeAddedSkill(skill, skillType);
        }
    }
} 