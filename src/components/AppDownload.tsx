import { Phone, Shield, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { PhonePreview } from './icons/PhonePreview';
import { AppleLogo, GooglePlayLogo } from './icons/StoreLogos';

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

            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Button variant="outline" size="lg" className="flex items-center gap-3 dark:hover:text-white min-w-[220px]">
                <AppleLogo className="w-7 h-7" />
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="text-base font-semibold -mt-0.5">App Store</div>
                </div>
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-3 dark:hover:text-white min-w-[220px]">
                <GooglePlayLogo className="w-7 h-7" />
                <div className="text-left">
                  <div className="text-xs opacity-80">Get it on</div>
                  <div className="text-base font-semibold -mt-0.5">Google Play</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="relative w-24 md:w-32 lg:w-40 mx-auto">
            <PhonePreview className="w-full h-auto" />
            <div className="absolute -top-2 -right-2 bg-white dark:bg-black px-2 py-1 rounded-full font-semibold shadow-lg text-yellow-500 text-xs">
              4.9 ★ on App Store
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
