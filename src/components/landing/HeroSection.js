'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion' // You'll need to install framer-motion

export default function HeroSection() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-white to-cyan-50">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-200 to-cyan-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
            Write Quality Resumes in Minutes
          </h1>
          <h2 className="text-2xl font-semibold text-cyan-600 mb-6">
            Powered by AI, Crafted for Success
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Transform your job search with AI-powered resume optimization, 
            personalized cover letters, and intelligent job application tracking.
          </p>
          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/auth"
              className="rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 inline" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 