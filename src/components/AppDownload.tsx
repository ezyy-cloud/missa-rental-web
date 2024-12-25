import React from 'react';
import { Phone, Shield, Clock } from 'lucide-react';

export default function AppDownload() {
  return (
    <section className="py-16 bg-primary text-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Get the MissaRental App
            </h2>
            <p className="text-lg mb-8">
              Download our mobile app to unlock exclusive features and make car rental even easier.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start">
                <Shield className="w-8 h-8 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Secure Booking</h3>
                  <p className="text-gray-700">Protected payments and verified hosts</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-8 h-8 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">24/7 Support</h3>
                  <p className="text-gray-700">Help whenever you need it</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-8 h-8 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Instant Booking</h3>
                  <p className="text-gray-700">Book your car in minutes</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <img
                  src="/app-store.svg"
                  alt="Download on the App Store"
                  className="h-8"
                />
              </a>
              <a
                href="#"
                className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <img
                  src="/play-store.svg"
                  alt="Get it on Google Play"
                  className="h-8"
                />
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              src="/app-preview.png"
              alt="MissaRental Mobile App"
              className="w-full max-w-md mx-auto lg:max-w-none rounded-2xl shadow-2xl"
            />
            <div className="absolute -top-4 -right-4 bg-white text-primary px-6 py-2 rounded-full font-semibold shadow-lg">
              4.9 ★ on App Store
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
