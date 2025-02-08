'use client'

export function generateContent(resumeData) {
  // Extract data from resumeData with default values
  const {
    contact_information = {},
    executive_summary = '',
    professional_experience = [],
    education = [],
    skills = [],
    certificates = [],
    miscellaneous = [],
    personal_projects = [],
    ai_improved_sections = {}
  } = resumeData || {}

  // Generate base sections with standard formatting
  const sections = {
    header: generateHeaderSection(contact_information),
    summary: generateSummarySection(executive_summary, ai_improved_sections),
    experience: generateExperienceSection(professional_experience),
    skills: generateSkillsSection(skills, ai_improved_sections),
    education: generateEducationSection(education, ai_improved_sections),
    certificates: generateCertificatesSection(certificates, ai_improved_sections),
    projects: generateProjectsSection(personal_projects, ai_improved_sections),
    additional: generateAdditionalSection(miscellaneous, ai_improved_sections)
  }

  return { sections }
}

// Helper functions to generate each section with base styling
function generateHeaderSection(contact) {
  return {
    type: 'header',
    content: {
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      location: contact.location || '',
      linkedin: contact.linkedin || '',
      residency: contact.residency_status || ''
    }
  }
}

function generateSummarySection(summary, aiImproved) {
  return {
    type: 'summary',
    content: summary,
    ai_improved_section: aiImproved?.executive_summary || false
  }
}

function generateExperienceSection(experience) {
  return {
    type: 'experience',
    entries: experience.map(exp => ({
      id: exp.id,
      organization: exp.organization,
      role: exp.role,
      duration: exp.duration,
      location: exp.location,
      description: exp.organization_description,
      points: exp.points || [],
      is_improved: exp.is_improved || false
    }))
  }
}

function generateSkillsSection(skills, aiImproved) {
  return {
    type: 'skills',
    content: Array.isArray(skills) && skills.length > 0 ? skills[0] : { technical_skills: '', soft_skills: '' },
    ai_improved_section: aiImproved?.skills || false
  }
}

function generateEducationSection(education, aiImproved) {

  return {
    type: 'education',
    entries: education.map(edu => {
      return {
        institution: edu.institution,
        degree: edu.degree,
        duration: edu.duration,
        grade: edu.grade,
        relevant_courses: Array.isArray(edu.relevant_courses) ? edu.relevant_courses : []
      };
    }),
    ai_improved_section: aiImproved?.education || false
  };
}

function generateCertificatesSection(certificates, aiImproved) {
  return {
    type: 'certificates',
    entries: certificates,
    ai_improved_section: aiImproved?.certificates || false
  }
}

function generateProjectsSection(projects, aiImproved) {
  return {
    type: 'projects',
    entries: projects.map(project => ({
      project_name: project.project_name || '',
      project_description: project.project_description || '',
      project_experience: project.project_experience || [],
      technologies_used: project.technologies_used || [],
      github_link: project.github_link || ''
    })),
    ai_improved_section: aiImproved?.personal_projects || false
  }
}

function generateAdditionalSection(miscellaneous, aiImproved) {
  return {
    type: 'additional',
    entries: miscellaneous,
    ai_improved_section: aiImproved?.miscellaneous || false
  }
} 