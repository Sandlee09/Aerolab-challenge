import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-dark-700">404</h1>
          <h2 className="text-2xl font-bold text-theme mb-4">Game Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The game you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-lg hover:from-primary-600 hover:to-secondary-700 transition-all transform hover:scale-105"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Try searching for a different game or browse your collection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
