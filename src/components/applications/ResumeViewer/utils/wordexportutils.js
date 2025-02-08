// wordExportUtils.js
import { saveAs } from 'file-saver';
import { generateContent } from './generateContent';

// Generate Word-specific styles
const generateWordStyles = () => `
  /* Base styles */
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 40px;
    color: #333;
  }

  /* Section headers */
  .section-header {
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1px solid #333;
    margin-bottom: 12px;
    padding-bottom: 4px;
    color: #2c3e50;
  }

  /* Header section */
  .resume-header {
    text-align: center;
    margin-bottom: 20px;
  }
  .resume-header h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  .contact-info {
    font-size: 12px;
    margin-bottom: 4px;
  }

  /* Summary section */
  .summary {
    text-align: justify;
    margin-bottom: 20px;
  }

  /* Experience section */
  .experience-entry {
    margin-bottom: 16px;
  }
  .role-title {
    font-weight: bold;
    font-size: 14px;
  }
  .organization-info {
    font-style: italic;
    font-size: 13px;
  }
  .experience-points {
    margin-left: 20px;
    padding-left: 0;
  }
  .experience-point {
    margin-bottom: 4px;
    font-size: 13px;
  }

  /* Skills section */
  .skills-section {
    margin-bottom: 16px;
  }
  .skills-category {
    font-weight: bold;
    font-size: 13px;
    margin-bottom: 4px;
  }
  .skills-list {
    font-size: 13px;
  }

  /* Education section */
  .education-entry {
    margin-bottom: 12px;
  }
  .institution {
    font-weight: bold;
    font-size: 14px;
  }
  .degree-info {
    font-size: 13px;
  }

  /* Projects section */
  .project-entry {
    margin-bottom: 16px;
  }
  .project-title {
    font-weight: bold;
    font-size: 14px;
  }
  .project-description {
    font-size: 13px;
    margin-bottom: 8px;
  }
  .technologies {
    font-size: 12px;
    font-style: italic;
  }

  /* Certificates section */
  .certificate-entry {
    margin-bottom: 8px;
    font-size: 13px;
  }
`;

// Helper function to generate section HTML
const generateSectionHTML = (title, content) => `
  <div class="resume-section">
    <div class="section-header">${title}</div>
    ${content}
  </div>
`;

// Generate header section HTML
const generateHeaderHTML = (header) => `
  <div class="resume-header">
    <h1>${header.name}</h1>
    <div class="contact-info">
      ${header.email} | ${header.phone} | ${header.location}
      ${header.linkedin ? `| <a href="${header.linkedin}">LinkedIn</a>` : ''}
    </div>
    ${header.residency ? `<div class="contact-info">${header.residency}</div>` : ''}
  </div>
`;

// Generate experience section HTML
const generateExperienceHTML = (experiences) => {
  return experiences.map(exp => `
    <div class="experience-entry">
      <div class="role-title">${exp.role}</div>
      <div class="organization-info">${exp.organization} | ${exp.duration}</div>
      ${exp.description ? `<div class="experience-description">${exp.description}</div>` : ''}
      <ul class="experience-points">
        ${exp.points.map(point => `<li class="experience-point">${point.text || point}</li>`).join('')}
      </ul>
    </div>
  `).join('');
};

// Generate skills section HTML
const generateSkillsHTML = (skills) => {
  const { technical_skills, soft_skills } = skills;
  return `
    <div class="skills-section">
      ${technical_skills ? `
        <div class="skills-category">Technical Skills</div>
        <div class="skills-list">${technical_skills}</div>
      ` : ''}
      ${soft_skills ? `
        <div class="skills-category">Soft Skills</div>
        <div class="skills-list">${soft_skills}</div>
      ` : ''}
    </div>
  `;
};

// Main export function
export const exportToWord = async (resumeData, filename = 'resume.doc') => {
  // Generate content using existing logic
  const { sections } = generateContent(resumeData);
  
  // Generate complete HTML document
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${generateWordStyles()}</style>
      </head>
      <body>
        ${sections.header ? generateHeaderHTML(sections.header.content) : ''}
        
        ${sections.summary ? generateSectionHTML(
          'Executive Summary',
          `<div class="summary">${sections.summary.content}</div>`
        ) : ''}
        
        ${sections.experience ? generateSectionHTML(
          'Professional Experience',
          generateExperienceHTML(sections.experience.entries)
        ) : ''}
        
        ${sections.skills ? generateSectionHTML(
          'Skills',
          generateSkillsHTML(sections.skills.content)
        ) : ''}
        
        ${sections.education ? generateSectionHTML(
          'Education',
          sections.education.entries.map(edu => `
            <div class="education-entry">
              <div class="institution">${edu.institution}</div>
              <div class="degree-info">${edu.degree} | ${edu.duration}</div>
              ${edu.grade ? `<div class="degree-info">Grade: ${edu.grade}</div>` : ''}
            </div>
          `).join('')
        ) : ''}
        
        ${sections.projects ? generateSectionHTML(
          'Projects',
          sections.projects.entries.map(project => `
            <div class="project-entry">
              <div class="project-title">${project.project_name}</div>
              <div class="project-description">${project.project_description}</div>
              ${project.technologies_used.length ? `
                <div class="technologies">Technologies: ${project.technologies_used.join(', ')}</div>
              ` : ''}
            </div>
          `).join('')
        ) : ''}
        
        ${sections.certificates ? generateSectionHTML(
          'Certifications',
          sections.certificates.entries.map(cert => `
            <div class="certificate-entry">
              ${cert.name} ${cert.issuer ? `- ${cert.issuer}` : ''} 
              ${cert.date_acquired ? `(${cert.date_acquired})` : ''}
            </div>
          `).join('')
        ) : ''}
      </body>
    </html>
  `;

  // Create and save the file
  const blob = new Blob([htmlContent], { type: 'application/msword' });
  saveAs(blob, filename);
};