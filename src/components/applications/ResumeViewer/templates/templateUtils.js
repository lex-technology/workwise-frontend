export function evaluateTemplateSpecificTips(template, sections) {
  
  if (!template.tips?.show) return [];

  const evaluators = {
    A: evaluateProfessionalTips,
    B: evaluateStudentTips
  };

  const templateEvaluator = evaluators[template.name] || (() => []);
  const results = templateEvaluator(template.tips.messages, sections);
  
  return results;
}

function evaluateProfessionalTips(messages, sections) {
  return messages.filter(tip => {
    // Professional template specific conditions
    switch (tip.condition) {
      case 'skills.length < 5':
        return sections.skills?.content?.technical_skills?.split(',').length < 5;
      case '!summary.includes_years':
        return !sections.summary?.content?.toLowerCase().includes('years');
      default:
        return false;
    }
  });
}

function evaluateStudentTips(messages, sections) {
  return messages.filter(tip => {
    // Student template specific conditions
    switch (tip.condition) {
      case 'experience.length > 0':
        return sections.experience?.entries?.length > 0;
      case 'projects.length < 2':
        return sections.projects?.entries?.length < 2;
      case '!skills.technical_skills':
        return !sections.skills?.content?.technical_skills;
      default:
        return false;
    }
  });
}