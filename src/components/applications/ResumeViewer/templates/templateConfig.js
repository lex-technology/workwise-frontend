import { editableConfig } from '../config/editableConfig'

export const templateConfig = {
  A: {
    name: 'A',
    sectionOrder: [
      'header',
      'summary',
      'experience',
      'skills',
      'education',
      'projects',
      'certificates',
      'additional'
    ],
    editableConfig,
    styles: {
      container: 'max-w-[800px] mx-auto p-8 font-sans space-y-4',
      header: {
        container: 'mb-6',
        content: 'space-y-1',
        name: 'text-2xl font-bold',
        contactInfo: 'flex justify-between items-center text-sm',
        residency: 'text-sm',
        email: 'text-blue-600 hover:underline'
      },
      summary: {
        container: 'mb-6',
        content: 'text-sm leading-relaxed text-justify'
      },
      experience: {
        container: 'mb-6 p-4 rounded-lg transition-colors duration-200',
        content: 'space-y-4',
        entry: 'p-3 rounded-md transition-colors duration-200',
        header: 'space-y-1',
        role: 'font-bold text-sm',
        organization: 'text-sm italic',
        duration: 'text-sm text-right',
        description: 'text-sm italic text-gray-600',
        points: 'list-disc pl-4 space-y-1',
        point: 'text-sm text-justify'
      },
      skills: {
        container: 'mb-6',
        content: 'space-y-3',
        section: 'space-y-1',
        subheading: 'font-bold text-sm',
        skillList: 'text-sm'
      },
      education: {
        container: 'mb-6',
        content: 'space-y-3',
        entry: 'space-y-1',
        institution: 'font-bold text-sm',
        degree: 'text-sm',
        duration: 'text-sm',
        grade: 'text-sm'
      },
      projects: {
        container: 'mb-6',
        content: 'space-y-4',
        entry: 'space-y-2',
        header: 'flex justify-between items-center',
        projectName: 'font-bold text-sm',
        description: 'text-sm text-justify',
        points: 'list-disc pl-4 space-y-1',
        point: 'text-sm text-justify',
        technologies: 'text-sm',
        techLabel: 'font-medium',
        githubLink: 'text-blue-600 hover:underline text-sm ml-2'
      },
      certificates: {
        container: 'mb-6',
        content: 'space-y-2',
        entry: 'text-sm',
        name: 'font-medium',
        issuer: 'ml-2',
        date: 'text-gray-600 ml-2'
      },
      additional: {
        container: 'mb-6',
        content: 'space-y-2',
        entry: 'text-sm',
        label: 'font-medium',
        value: 'ml-1'
      }
    },
    validation: {
      required: ['summary', 'experience', 'skills'],
      optional: ['projects', 'certificates', 'additional'],
      messages: {
        summary: 'A professional summary helps showcase your expertise and career objectives.',
        experience: 'Work experience is crucial for a professional resume.',
        skills: 'List your relevant professional skills.',
      }
    },
    tips: {
      show: true,
      messages: [
        {
          condition: 'skills.length < 5',
          message: 'Consider adding more specific technical skills to showcase your expertise.'
        },
        {
          condition: '!summary.includes_years',
          message: 'Include your years of experience in the executive summary.'
        }
      ]
    }
  },
  B: {
    name: 'B',
    sectionOrder: [
      'header',
      'summary',
      'education',
      'projects',
      'experience',
      'skills',
      'certificates',
      'additional'
    ],
    editableConfig,
    styles: {
      container: 'max-w-[800px] mx-auto p-8 font-serif',
      header: {
        container: 'mb-6',
        content: 'space-y-1',
        name: 'text-2xl font-bold',
        contactInfo: 'flex justify-between items-center text-sm',
        residency: 'text-sm',
        email: 'text-blue-600 hover:underline'
      },
      summary: {
        container: 'mb-6',
        content: 'text-sm leading-relaxed text-justify'
      },
      experience: {
        container: 'mb-6',
        content: 'space-y-4',
        entry: 'space-y-2',
        header: 'space-y-1',
        role: 'font-bold text-sm',
        organization: 'text-sm italic',
        duration: 'text-sm text-right',
        description: 'text-sm italic text-gray-600',
        points: 'list-disc pl-4 space-y-1',
        point: 'text-sm text-justify'
      },
      skills: {
        container: 'mb-6',
        content: 'space-y-3',
        section: 'space-y-1',
        subheading: 'font-bold text-sm',
        skillList: 'text-sm'
      },
      education: {
        container: 'mb-6',
        content: 'space-y-3',
        entry: 'space-y-1',
        institution: 'font-bold text-sm',
        degree: 'text-sm',
        duration: 'text-sm',
        grade: 'text-sm'
      },
      projects: {
        container: 'mb-6',
        content: 'space-y-4',
        entry: 'space-y-2',
        header: 'flex justify-between items-center',
        projectName: 'font-bold text-sm',
        description: 'text-sm text-justify',
        points: 'list-disc pl-4 space-y-1',
        point: 'text-sm text-justify',
        technologies: 'text-sm',
        techLabel: 'font-medium',
        githubLink: 'text-blue-600 hover:underline text-sm ml-2'
      },
      certificates: {
        container: 'mb-6',
        content: 'space-y-2',
        entry: 'text-sm',
        name: 'font-medium',
        issuer: 'ml-2',
        date: 'text-gray-600 ml-2'
      },
      additional: {
        container: 'mb-6',
        content: 'space-y-2',
        entry: 'text-sm',
        label: 'font-medium',
        value: 'ml-1'
      }
    },
    validation: {
      required: ['summary', 'education', 'projects', 'skills'],
      optional: ['experience', 'certificates', 'additional'],
      messages: {
        summary: 'An executive summary helps outline your career goals.',
        education: 'Educational background is crucial for a student resume.',
        projects: 'Personal projects demonstrate practical skills and initiative.',
        skills: 'List your technical and soft skills.',
      }
    },
    tips: {
      show: true,
      messages: [
        {
          condition: 'experience.length > 0',
          message: 'Consider moving Professional Experience section above Projects if you have relevant internships.'
        },
        {
          condition: 'projects.length < 2',
          message: 'Try to showcase at least 2-3 significant projects that demonstrate your technical skills.'
        },
        {
          condition: '!skills.technical_skills',
          message: 'Include specific technical skills relevant to your field of study.'
        }
      ]
    }
  }
} 