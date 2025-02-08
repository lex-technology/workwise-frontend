'use client'
import { motion } from 'framer-motion'

const stats = [
  { id: 1, name: 'Users Landed Jobs', value: '2,000+' },
  { id: 2, name: 'Resume Templates', value: '50+' },
  { id: 3, name: 'Success Rate', value: '75%' },
  { id: 4, name: 'Time Saved per Application', value: '2 Hours' },
]

export default function StatisticsSection() {
  return (
    <div className="bg-cyan-600 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl lg:max-w-none"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trusted by Job Seekers Worldwide
            </h2>
            <p className="mt-4 text-lg leading-8 text-cyan-100">
              Our platform has helped thousands of professionals land their dream jobs
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col bg-white/5 p-8 backdrop-blur-sm"
              >
                <dt className="text-sm font-semibold leading-6 text-cyan-100">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">{stat.value}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  )
} 