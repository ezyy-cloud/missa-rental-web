import React from 'react';
import { Car, Calendar, Key, DollarSign } from 'lucide-react';

const steps = [
  {
    icon: Car,
    title: 'List Your Car',
    description: 'Sign up and list your car with photos and details about its features.'
  },
  {
    icon: Calendar,
    title: 'Accept Bookings',
    description: 'Review and accept booking requests from verified renters.'
  },
  {
    icon: Key,
    title: 'Hand Over Keys',
    description: 'Meet the renter and hand over the keys after verification.'
  },
  {
    icon: DollarSign,
    title: 'Get Paid',
    description: 'Receive secure payments directly to your account.'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white dark:bg-black border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Earn money by sharing your car with verified renters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-gray-50 dark:bg-dark-lighter">
              <div className="w-16 h-16 mx-auto bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}