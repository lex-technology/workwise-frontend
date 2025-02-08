'use client'
import { motion } from 'framer-motion'

const testimonials = [
  {
    content: "WorkWise helped me create a standout resume that landed me interviews at top tech companies. The AI suggestions were spot-on!",
    author: "Sarah Chen",
    role: "Software Engineer",
    // image: "/path/to/image.jpg" // TODO: Add testimonial author images
  },
  {
    content: "The cover letter generator saved me hours of work. Each letter was perfectly tailored to the job description.",
    author: "Michael Rodriguez",
    role: "Marketing Manager",
    // image: "/path/to/image.jpg"
  },
  {
    content: "The career coaching feature provided invaluable feedback that helped me improve my interview performance.",
    author: "Emily Thompson",
    role: "Product Manager",
    // image: "/path/to/image.jpg"
  },
]

export default function TestimonialSection() {
  return (
    <div className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-cyan-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Hear from Our Successful Users
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col justify-between bg-white p-8 shadow-sm rounded-2xl hover:shadow-md transition-all duration-200"
              >
                <blockquote className="text-gray-700">{testimonial.content}</blockquote>
                <div className="mt-8 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200">
                    {/* TODO: Add image */}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 