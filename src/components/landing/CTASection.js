'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative isolate overflow-hidden bg-cyan-600 px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16"
        >
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start Your Job Search Journey Today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-cyan-100">
            Join thousands of successful job seekers who have transformed their career with WorkWise
          </p>
          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/auth"
              className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-cyan-600 shadow-sm hover:bg-cyan-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
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