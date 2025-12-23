import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { paths } from '../config/path';

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Eagle Flooring Depot</title>
        <meta name="description" content="The page you're looking for doesn't exist. Browse our premium vinyl flooring products or contact us for assistance." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center px-6">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist. Let's get you back to exploring our premium flooring solutions.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              to={paths.home.path}
              className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </Link>
            
            <Link 
              to={paths.contactus.path}
              className="inline-block w-full text-blue-600 px-6 py-3 rounded-lg font-medium hover:text-blue-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
