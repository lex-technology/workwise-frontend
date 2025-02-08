'use client'
import React from 'react'
import { Sparkles, Users, Star, Calendar, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function CareerCoach() {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-indigo-500" />,
      title: "Expert Career Coaches",
      description: "Connect with certified career coaches who have extensive experience in your industry."
    },
    {
      icon: <Calendar className="h-6 w-6 text-indigo-500" />,
      title: "Flexible Scheduling",
      description: "Book one-on-one sessions that fit your schedule, with coaches available across different time zones."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-indigo-500" />,
      title: "Personalized Guidance",
      description: "Get tailored advice on career transitions, interview preparation, and professional development."
    },
    {
      icon: <Star className="h-6 w-6 text-indigo-500" />,
      title: "Vetted Professionals",
      description: "All our coaches are thoroughly vetted with proven track records of career counseling success."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Sparkles className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Professional Career Coaching
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with experienced career coaches for personalized guidance
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full">
            <Sparkles className="h-5 w-5 mr-2" />
            <span className="font-medium">Coming Soon - Q2 2024</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="ml-3 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Want to be notified when coaching becomes available?
          </h2>
          <p className="text-gray-600 mb-6">
            Return to your dashboard and we'll notify you as soon as our career coaching platform launches.
          </p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
