import { Star, Award, Crown, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuthStore } from '../stores/authStore';

const REWARDS_TIERS = [
  {
    name: 'Bronze Host',
    icon: Award,
    requirements: '3 successful rentals',
    benefits: [
      'Basic listing visibility',
      '24/7 support',
      'Standard insurance coverage'
    ]
  },
  {
    name: 'Silver Host',
    icon: Star,
    requirements: '10 successful rentals + 4.5★ rating',
    benefits: [
      'Priority search placement',
      'Featured host badge',
      'Premium insurance coverage',
      '10% bonus earnings'
    ]
  },
  {
    name: 'Gold Host',
    icon: Award,
    requirements: '25 successful rentals + 4.8★ rating',
    benefits: [
      'Top search placement',
      'Verified Gold Host badge',
      'Premium insurance + damage protection',
      '20% bonus earnings',
      'Early access to new features'
    ]
  },
  {
    name: 'Elite Host',
    icon: Crown,
    requirements: '50 successful rentals + 4.9★ rating',
    benefits: [
      'Elite search placement',
      'Elite Host badge',
      'Maximum insurance coverage',
      '30% bonus earnings',
      'Dedicated account manager',
      'Custom listing features'
    ]
  }
];

export default function RewardsSection() {
  const { user } = useAuthStore();

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Earn More as a Top Host
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join our rewards program and unlock exclusive benefits. The more you host, 
            the more you earn. Climb the ranks and become an Elite Host!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REWARDS_TIERS.map((tier) => (
            <div
              key={tier.name}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
                <tier.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {tier.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {tier.requirements}
              </p>
              
              <div className="space-y-2">
                {tier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to={user ? "/list-car" : "/signup"}>
            <Button variant="yellow" size="lg">
              {user ? "Start Hosting Today" : "Sign Up to Start Hosting"}
            </Button>
          </Link>
          {!user && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:text-primary-dark">
                Sign in
              </Link>
              {' '}to start listing your cars
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
