import { Helmet } from 'react-helmet-async';
import { Trophy } from 'lucide-react';
import { ListCarForm } from '../components/forms/ListCarForm';

export default function ListCarPage() {
  return (
    <>
      <Helmet>
        <title>List Your Car - MissaRental</title>
        <meta
          name="description"
          content="List your car on MissaRental and start earning. Easy listing process, secure payments, and insurance coverage."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              List Your Car
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Share your car and start earning. It only takes a few minutes to create a listing.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-6">
              <Trophy className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                  Become a Top Host
                </h3>
                <p className="text-blue-600 dark:text-blue-200 text-sm">
                  List multiple cars and maintain a high rating to unlock exclusive benefits and earn more.
                </p>
              </div>
            </div>

            <ListCarForm />
          </div>
        </div>
      </div>
    </>
  );
}