export function renderSection(sectionData, styles, modalHandlers, isEditable) {
  switch (sectionData.type) {
    case 'header':
      return renderHeader(sectionData.content, styles)
    case 'summary':
      return renderSummary(sectionData.content, styles, isEditable)
    case 'experience':
      return renderExperience(sectionData.entries, styles, modalHandlers, isEditable)
    case 'skills':
      return renderSkills(sectionData.content, styles)
    case 'education':
      return renderEducation(sectionData.entries, styles)
    case 'certificates':
      return renderCertificates(sectionData.entries, styles)
    case 'projects':
      return renderProjects(sectionData.entries, styles)
    case 'additional':
      return renderAdditional(sectionData.entries, styles)
    default:
      return null
  }
}

function renderHeader(content, styles) {
  return (
    <div className={styles?.content}>
      <h1 className={styles?.name}>{content.name}</h1>
      <div className={styles?.contactInfo}>
        <span>{content.email}</span>
        <span>{content.phone}</span>
        <span>{content.location}</span>
      </div>
      {content.residency && (
        <div className={styles?.residency}>{content.residency}</div>
      )}
    </div>
  )
}

function renderSectionTitle(title, styles) {
  return (
    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-300">
      {title}
    </h2>
  )
}

function renderSummary(content, styles, isEditable) {
  if (!content) return null;
  
  return (
    <div className={styles?.content}>
      {renderSectionTitle('Executive Summary', styles)}
      {content}
    </div>
  )
}

function renderExperience(entries, styles, modalHandlers, isEditable) {
  if (!entries?.length) return null;

  return (
    <div className={styles?.content}>
      <div className="mb-4">
        {renderSectionTitle('Professional Experience', styles)}
      </div>
      
      {entries.map((exp, index) => (
        <div 
          key={exp.id || index}
          className={`
            ${styles?.entry} 
            relative 
            transition-all 
            duration-200
            ${exp.is_improved 
              ? 'hover:bg-green-50 border-green-500 bg-green-25' 
              : 'hover:bg-blue-50 border-blue-500 bg-blue-25'}
          `}
          onClick={(e) => {
            if (!isEditable) return;
            e.stopPropagation();
            const urlParams = new URLSearchParams(window.location.search);
            const resumeId = urlParams.get('id');
            modalHandlers?.handleExperienceClick?.(resumeId, exp.id);
          }}
        >
          {isEditable && (
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className={`text-xs px-2 py-1 rounded-md ${
                exp.is_improved 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {exp.is_improved ? 'Analysed with AI' : 'Edit entry'}
              </span>
            </div>
          )}
          
          <div className="py-2">
            <h3 className={styles?.role}>{exp.role}</h3>
            <div className="flex items-center gap-2">
              <span className={styles?.organization}>{exp.organization}</span>
              <span>-</span>
              <span className={styles?.duration}>{exp.duration}</span>
            </div>
            {exp.description && (
              <p className={styles?.description}>{exp.description}</p>
            )}
            <ul className={styles?.points}>
              {exp.points.map((point, i) => (
                <li key={i} className={styles?.point}>
                  {point.text || point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

function renderSkills(content, styles) {
  if (!content) return null;

  const { technical_skills, soft_skills } = content;

  const renderSkillsList = (skillsString) => {
    if (!skillsString) return null;
    
    // Split by commas and clean up each skill
    const skills = skillsString.split(',')
      .map(skill => skill.trim())
      .filter(Boolean);
    
    return (
      <div className="flex flex-wrap items-start gap-x-4 gap-y-1">
        {skills.map((skill, idx) => (
          <div key={idx} className="flex items-center whitespace-nowrap">
            <span className="mr-2">•</span>
            <span className="text-gray-600 text-sm">{skill}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles?.content}>
      {renderSectionTitle('Skills', styles)}
      <div className="space-y-4">
        {technical_skills && (
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-1">Technical Skills:</h3>
            {renderSkillsList(technical_skills)}
          </div>
        )}
        {soft_skills && (
          <div className="mt-3">
            <h3 className="font-medium text-sm text-gray-700 mb-1">Soft Skills:</h3>
            {renderSkillsList(soft_skills)}
          </div>
        )}
      </div>
    </div>
  );
}

function renderEducation(entries, styles) {
    if (!entries?.length) return null;
  
    return (
      <div className={styles?.content}>
        {renderSectionTitle('Education', styles)}
        <div className="space-y-4">
          {entries.map((edu, index) => (
            <div key={index} className={styles?.entry}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{edu.institution}</h3>
                  <p className="text-gray-600">{edu.degree}</p>
                  {edu.grade && <p className="text-gray-600">{edu.grade}</p>}
                </div>
                <span className="text-gray-600">{edu.duration}</span>
              </div>
              
              {edu.relevant_courses && edu.relevant_courses.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-sm text-gray-700 mb-1">Relevant Courses:</p>
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-1">
                    {edu.relevant_courses.map((course, idx) => (
                      <div key={idx} className="flex items-center whitespace-nowrap">
                        <span className="mr-2">•</span>
                        <span className="text-gray-600 text-sm">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

function renderCertificates(entries, styles) {
  if (!entries?.length) return null;
  return (
    <div className={styles?.content}>
      {renderSectionTitle('Certifications', styles)}
      {entries.map((cert, index) => (
        <div key={index} className={styles?.entry}>
          <span className={styles?.name}>{cert.name}</span>
          {cert.issuer && <span className={styles?.issuer}>{cert.issuer}</span>}
          {cert.date_acquired && (
            <span className={styles?.date}>{cert.date_acquired}</span>
          )}
        </div>
      ))}
    </div>
  )
}

function renderProjects(entries, styles) {
  if (!entries?.length) return null;

  return (
    <div className={styles?.content}>
      {renderSectionTitle('Personal Projects', styles)}
      {entries.map((project, index) => (
        <div key={index} className={styles?.entry}>
          <div className={styles?.header}>
            <h3 className={styles?.projectName}>
              {project.project_name}
              {project.github_link && (
                <a 
                  href={project.github_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles?.githubLink}
                >
                  GitHub
                </a>
              )}
            </h3>
          </div>
          
          {project.project_description && (
            <p className={styles?.description}>
              {project.project_description}
            </p>
          )}

          {project.project_experience?.length > 0 && (
            <ul className={styles?.points}>
              {project.project_experience.map((point, i) => (
                <li key={i} className={styles?.point}>
                  {point}
                </li>
              ))}
            </ul>
          )}

          {project.technologies_used?.length > 0 && (
            <div className={styles?.technologies}>
              <span className={styles?.techLabel}>Technologies: </span>
              {project.technologies_used.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function renderAdditional(entries, styles) {
  if (!entries?.length) return null;
  return (
    <div className={styles?.content}>
      {renderSectionTitle('Additional Information', styles)}
      {entries.map((item, index) => (
        <div key={index} className={styles?.entry}>
          <span className={styles?.label}>{item.label}: </span>
          <span className={styles?.value}>{item.value}</span>
        </div>
      ))}
    </div>
  )
} 