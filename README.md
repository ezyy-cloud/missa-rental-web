# Missa Car Rental Platform

A modern car rental platform built with React, TypeScript, and Supabase.

## Features

### For Renters
- Browse and search available cars
- Filter by location, price, and car features
- Book cars for specific dates
- Manage bookings and view history
- Leave reviews for cars and owners
- Identity verification
- Secure payment processing
- Real-time messaging with car owners

### For Car Owners
- List cars with detailed information
- Set availability and pricing
- Manage bookings and rentals
- Communicate with renters
- View earnings and statistics
- Receive secure payments
- Identity and document verification

## Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - TailwindCSS
  - React Query
  - Zustand
  - React Router
  - Lucide Icons
  - React Hook Form
  - Zod

- **Backend**:
  - Supabase
  - PostgreSQL
  - Row Level Security
  - Real-time subscriptions
  - Storage for images

- **Authentication**:
  - Supabase Auth
  - Social login providers
  - Email verification
  - Password recovery

- **Payment Processing**:
  - Stripe integration
  - Secure payment handling
  - Automated payouts

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/missa-rental.git
   cd missa-rental
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase and Stripe credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### Code Structure
- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/stores` - State management
- `/src/hooks` - Custom React hooks
- `/src/types` - TypeScript types and interfaces
- `/src/utils` - Utility functions
- `/src/lib` - Third-party library configurations
- `/src/api` - API client and endpoints

### Testing
Run the test suite:
```bash
npm test
```

### Database Migrations
Apply Supabase migrations:
```bash
supabase db reset
```

## Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy to your hosting platform of choice (Vercel recommended).

3. Set up environment variables in your hosting platform.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@missarental.com or join our Slack channel.
