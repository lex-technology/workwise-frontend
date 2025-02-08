import { useState } from 'react'

const PricingCards = ({ onPlanSelect }) => {
  const [billingInterval, setBillingInterval] = useState('monthly')
  
  const YEARLY_DISCOUNT = 0.2 // 20% discount for yearly plans

  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: '0',
      yearlyPrice: '0',
      description: 'Perfect for getting started',
      features: [
        'Feature 1',
        'Feature 2',
        'Feature 3',
      ],
      buttonText: 'Get Started',
      highlighted: false
    },
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: '29',
      yearlyPrice: '23', 
      description: 'Everything you need for job searching',
      features: [
        'All Free features',
        'Feature 4',
        'Feature 5',
        'Feature 6',
      ],
      buttonText: 'Start Basic',
      highlighted: true
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: '99',
      yearlyPrice: '79',
      description: 'Advanced features for serious job seekers',
      features: [
        'All Basic features',
        'Feature 7',
        'Feature 8',
        'Feature 9',
      ],
      buttonText: 'Start Premium',
      highlighted: false
    }
  ]

  return (
    <>
      {/* Billing Interval Toggle */}
      <div className="flex justify-center mt-8 space-x-4">
        <div className="relative flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingInterval('monthly')}
            className={`${
              billingInterval === 'monthly'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            } relative w-32 rounded-md py-2 text-sm font-medium transition-all duration-200`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('yearly')}
            className={`${
              billingInterval === 'yearly'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            } relative w-32 rounded-md py-2 text-sm font-medium transition-all duration-200`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl shadow-lg ${
              plan.highlighted
                ? 'ring-2 ring-indigo-600 scale-105'
                : ''
            } bg-white`}
          >
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
              
              <div className="mt-8 flex items-baseline gap-x-2">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${billingInterval === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="text-base font-medium text-gray-500">
                  /{billingInterval === 'monthly' ? 'month' : 'month'}
                </span>
              </div>

              {billingInterval === 'yearly' && plan.id !== 'free' && (
                <p className="mt-2 text-sm text-green-600">
                  Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2)} annually
                </p>
              )}

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-sm text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onPlanSelect(`${plan.id}-${billingInterval}`)}
                className={`mt-8 block w-full rounded-lg px-6 py-4 text-center text-sm font-semibold transition-all
                  ${
                    plan.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }
                `}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default PricingCards