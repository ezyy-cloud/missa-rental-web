import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Renter',
    image: `https://ui-avatars.com/api/?name=Sarah+Johnson&background=random`,
    text: 'MissaRental made my vacation perfect! The Tesla Model 3 I rented was immaculate, and the host was incredibly helpful. The whole process was smooth and hassle-free.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Car Owner',
    image: `https://ui-avatars.com/api/?name=Michael+Chen&background=random`,
    text: 'As a car owner, I have earned over $2,000/month sharing my BMW on MissaRental. The platform handles everything - insurance, payments, and screening. It has been amazing!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Renter',
    image: `https://ui-avatars.com/api/?name=Emily+Rodriguez&background=random`,
    text: 'Found the perfect car for my wedding day! The app made it easy to filter by style and color. The host even added special decorations. Unforgettable experience!',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            What Our Community Says
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Join thousands of happy renters and car owners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-dark-lighter p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-gray-200 dark:ring-gray-700"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
