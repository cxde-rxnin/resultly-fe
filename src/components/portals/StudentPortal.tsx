import { useState } from 'react';
import { getResult } from '../../api/blockchain';
import { config } from '../../config/env';
import type { Result } from '../../api/blockchain';
import ResultModal from '../modals/ResultModal';

const StudentPortal = () => {
  const [studentId, setStudentId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError('Please enter your Student ID');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Call the API with just studentId to get all results for this student
      const response = await getResult(studentId.trim(), '', '');
      
      if (response.data) {
        // If API returns an array of results, store all of them
        const allResults = Array.isArray(response.data) ? response.data : [response.data];
        setResults(allResults);
        setShowModal(true);
      } else {
        setError('No results found for this Student ID. Please check your ID and try again.');
      }
    } catch (error) {
      setError('No results found for this Student ID. Please check your ID and try again.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-blue-400 tracking-wide">{config.app.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-16">
          <h1 className="text-5xl font-semibold mb-4 tracking-tight">
            Welcome to <span className="text-blue-400">{config.app.name}</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">A feature-rich student result explorer and analytics platform for academic institutions</p>
          {/* Main Search Bar */}
          <div className="max-w-2xl mx-auto mt-12">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Search anything on Student Results"
                className="w-full px-6 py-4 text-lg bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-lg"
                disabled={isSearching}
              />
              <button type="submit" disabled={isSearching} className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
              </button>
              {isSearching && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              )}
            </form>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <span className="block">{error}</span>
              </div>
            )}
           
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-xl p-8">
              <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Blockchain Verified</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                All academic results are cryptographically secured and verified on the SUI blockchain for authenticity
              </p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-xl p-8">
              <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Instant Access</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Search and access your academic results instantly with just your Student ID number
              </p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-xl p-8">
              <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Official Transcripts</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Download blockchain-verified official transcripts in PDF format for your records
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 mt-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <span className="font-semibold text-blue-400 tracking-wide">{config.app.name}</span>
              </div>
              <p className="text-gray-400 text-sm">
                A feature-rich student result explorer and analytics platform for academic institutions
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white tracking-wide">Explorer</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400">Search Results</a></li>
                <li><a href="#" className="hover:text-blue-400">Student Directory</a></li>
                <li><a href="#" className="hover:text-blue-400">Academic Reports</a></li>
                <li><a href="#" className="hover:text-blue-400">Transcripts</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white tracking-wide">Developers</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400">API Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400">Integration Guide</a></li>
                <li><a href="#" className="hover:text-blue-400">SUI Blockchain</a></li>
                <li><a href="#" className="hover:text-blue-400">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white tracking-wide">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>Powered by SUI Blockchain Technology</p>
            <p className="mt-1">© 2025 {config.app.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Result Modal */}
      {showModal && results.length > 0 && (
        <ResultModal
          results={results}
          onClose={() => {
            setShowModal(false);
            setResults([]);
          }}
        />
      )}
    </div>
  );
};

export default StudentPortal;
