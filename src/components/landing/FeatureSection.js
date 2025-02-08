'use client'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

const features = [
  {
    icon: 'Brain',
    title: "AI-Powered Resume Optimization",
    description: "Our AI analyzes your resume against job descriptions, providing real-time suggestions for improvement and optimization.",
    color: "bg-cyan-600"
  },
  {
    icon: 'BarChart2',
    title: "Smart Job Description Analysis",
    description: "Get instant insights into job requirements and automatically identify key skills and qualifications needed.",
    color: "bg-cyan-700"
  },
  {
    icon: 'PenTool',
    title: "Personalized Cover Letters",
    description: "Generate tailored cover letters that highlight your relevant experience and match the company's tone.",
    color: "bg-cyan-800"
  },
  {
    icon: 'FileText',
    title: "Application Tracking",
    description: "Keep track of all your job applications and customized resumes in one organized dashboard.",
    color: "bg-cyan-600"
  },
  {
    icon: 'Layout',
    title: "Professional Templates",
    description: "Access a wide range of ATS-friendly resume templates designed by industry experts.",
    color: "bg-cyan-700"
  },
  {
    icon: 'UserPlus',
    title: "Career Coach Access",
    description: "Get professional guidance and feedback from experienced career coaches.",
    color: "bg-cyan-800"
  }
]

export default function FeatureSection() {
  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl lg:text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-cyan-600">
            Comprehensive Solution
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need for a Successful Job Search
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = Icons[feature.icon]
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className={`rounded-lg ${feature.color} p-2`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </motion.div>
              )
            })}
          </dl>
        </div>
      </div>
    </div>
  )
} 