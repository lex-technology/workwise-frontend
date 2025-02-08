'use client'
import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Toggle Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              isLogin
                ? 'bg-cyan-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              !isLogin
                ? 'bg-cyan-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLogin ? <LoginForm /> : <SignupForm />}
          
          {/* Toggle Link */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                className="text-cyan-600 hover:text-cyan-500 font-medium"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 