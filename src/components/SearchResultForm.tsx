import { useState } from 'react';
import type { Result } from '../api/blockchain';

interface SearchResultFormProps {
  onSearch: (studentId: string, courseCode: string, semester: string) => Promise<Result | null>;
}

const SearchResultForm = ({ onSearch }: SearchResultFormProps) => {
  const [searchData, setSearchData] = useState({
    studentId: '',
    courseCode: '',
    semester: ''
  });
  
  const [result, setResult] = useState<Result | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchData.studentId || !searchData.courseCode || !searchData.semester) {
      alert('Please fill in all search fields');
      return;
    }
    
    setIsSearching(true);
    setError(null);
    try {
      const foundResult = await onSearch(searchData.studentId, searchData.courseCode, searchData.semester);
      setResult(foundResult);
    } catch (error) {
      setError('Result not found or error occurred');
      setResult(null);
      console.error('Error searching result:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A') return 'text-green-600 bg-green-100';
    if (grade === 'B') return 'text-blue-600 bg-blue-100';
    if (grade === 'C') return 'text-yellow-600 bg-yellow-100';
    if (grade === 'D') return 'text-orange-600 bg-orange-100';
    if (grade === 'E') return 'text-red-500 bg-red-50';
    if (grade === 'F') return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Search Result</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="search-studentId" className="block text-sm font-medium text-gray-700 mb-1">
            Student ID
          </label>
          <input
            type="text"
            id="search-studentId"
            name="studentId"
            value={searchData.studentId}
            onChange={handleChange}
            placeholder="e.g., STU001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isSearching}
          />
        </div>

        <div>
          <label htmlFor="search-courseCode" className="block text-sm font-medium text-gray-700 mb-1">
            Course Code
          </label>
          <input
            type="text"
            id="search-courseCode"
            name="courseCode"
            value={searchData.courseCode}
            onChange={handleChange}
            placeholder="e.g., CS101"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isSearching}
          />
        </div>

        <div>
          <label htmlFor="search-semester" className="block text-sm font-medium text-gray-700 mb-1">
            Semester
          </label>
          <select
            id="search-semester"
            name="semester"
            value={searchData.semester}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isSearching}
          >
            <option value="">Select Semester</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <button 
            type="submit" 
            disabled={isSearching}
            className="w-full md:w-auto px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search Result'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-700 mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-50 rounded-md border">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Result Found</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="block text-sm font-medium text-gray-600">Student ID</span>
              <span className="text-lg font-semibold text-gray-900">{result.studentId}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Course Code</span>
              <span className="text-lg font-semibold text-gray-900">{result.courseCode}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Grade</span>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(result.grade)}`}>
                {result.grade}
              </span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Semester</span>
              <span className="text-lg font-semibold text-gray-900">{result.semester}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultForm;
