import { useState } from 'react';
import { addResult, updateResult, getResult } from '../../api/blockchain';
import type { ResultData, Result } from '../../api/blockchain';

const AdminPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'update' | 'search'>('add');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchResult, setSearchResult] = useState<Result | null>(null);

  // Form states
  const [addForm, setAddForm] = useState<ResultData>({
    studentId: '',
    courseCode: '',
    grade: '',
    semester: ''
  });

  const [updateForm, setUpdateForm] = useState({
    studentId: '',
    courseCode: '',
    semester: '',
    newGrade: ''
  });

  const [searchForm, setSearchForm] = useState({
    studentId: '',
    courseCode: '',
    semester: ''
  });

  const grades = ['A', 'B', 'C', 'D', 'E', 'F'];

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Demo password
      setIsAuthenticated(true);
      showNotification('success', 'Successfully logged in to Admin Portal');
    } else {
      showNotification('error', 'Invalid password');
    }
    setPassword('');
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.studentId || !addForm.courseCode || !addForm.grade || !addForm.semester) {
      showNotification('error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await addResult(addForm);
      showNotification('success', 'Result added successfully to blockchain!');
      setAddForm({ studentId: '', courseCode: '', grade: '', semester: '' });
    } catch (error) {
      showNotification('error', 'Failed to add result. Please try again.');
      console.error('Add result error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateForm.studentId || !updateForm.courseCode || !updateForm.semester || !updateForm.newGrade) {
      showNotification('error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await updateResult(updateForm.studentId, updateForm.courseCode, updateForm.semester, updateForm.newGrade);
      showNotification('success', 'Result updated successfully on blockchain!');
      setUpdateForm({ studentId: '', courseCode: '', semester: '', newGrade: '' });
    } catch (error) {
      showNotification('error', 'Failed to update result. Please try again.');
      console.error('Update result error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchForm.studentId || !searchForm.courseCode || !searchForm.semester) {
      showNotification('error', 'Please fill in all search fields');
      return;
    }

    setLoading(true);
    try {
      const response = await getResult(searchForm.studentId, searchForm.courseCode, searchForm.semester);
      setSearchResult(response.data || response);
      showNotification('success', 'Result found!');
    } catch (error) {
      showNotification('error', 'Result not found or error occurred');
      setSearchResult(null);
      console.error('Search result error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A') return 'bg-green-100 text-green-800';
    if (grade === 'B') return 'bg-blue-100 text-blue-800';
    if (grade === 'C') return 'bg-yellow-100 text-yellow-800';
    if (grade === 'D') return 'bg-orange-100 text-orange-800';
    if (grade === 'E') return 'bg-red-100 text-red-800';
    if (grade === 'F') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Administration Portal</h1>
            <p className="text-gray-600">Please enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Sign In
            </button>
          </form>

          {notification && (
            <div className={`mt-4 p-3 rounded-md border ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {notification.message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Student Records Management</h1>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'add' as const, label: 'Add Record' },
              { id: 'update' as const, label: 'Update Grade' },
              { id: 'search' as const, label: 'Search Records' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-md border ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'add' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Add Student Record</h2>
              <p className="text-sm text-gray-500 mt-1">Enter student information and academic results</p>
            </div>
            <div className="px-6 py-4">
              <form onSubmit={handleAddResult} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number</label>
                  <input
                    type="text"
                    value={addForm.studentId}
                    onChange={(e) => setAddForm({ ...addForm, studentId: e.target.value })}
                    placeholder="e.g., U2020/5570001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={addForm.courseCode}
                    onChange={(e) => setAddForm({ ...addForm, courseCode: e.target.value })}
                    placeholder="e.g., CSC 491.2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <select
                    value={addForm.grade}
                    onChange={(e) => setAddForm({ ...addForm, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    disabled={loading}
                    required
                  >
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={addForm.semester}
                    onChange={(e) => setAddForm({ ...addForm, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    disabled={loading}
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Adding Record...' : 'Add Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'update' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Update Student Grade</h2>
              <p className="text-sm text-gray-500 mt-1">Modify existing academic records</p>
            </div>
            <div className="px-6 py-4">
              <form onSubmit={handleUpdateResult} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number</label>
                  <input
                    type="text"
                    value={updateForm.studentId}
                    onChange={(e) => setUpdateForm({ ...updateForm, studentId: e.target.value })}
                    placeholder="e.g., U2020/5570001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={updateForm.courseCode}
                    onChange={(e) => setUpdateForm({ ...updateForm, courseCode: e.target.value })}
                    placeholder="e.g., CSC 491.2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={updateForm.semester}
                    onChange={(e) => setUpdateForm({ ...updateForm, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    disabled={loading}
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Grade</label>
                  <select
                    value={updateForm.newGrade}
                    onChange={(e) => setUpdateForm({ ...updateForm, newGrade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    disabled={loading}
                    required
                  >
                    <option value="">Select New Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Updating Grade...' : 'Update Grade'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Search Student Records</h2>
                <p className="text-sm text-gray-500 mt-1">Find and view existing academic records</p>
              </div>
              <div className="px-6 py-4">
                <form onSubmit={handleSearchResult} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number</label>
                    <input
                      type="text"
                      value={searchForm.studentId}
                      onChange={(e) => setSearchForm({ ...searchForm, studentId: e.target.value })}
                      placeholder="e.g., U2020/5570001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                    <input
                      type="text"
                      value={searchForm.courseCode}
                      onChange={(e) => setSearchForm({ ...searchForm, courseCode: e.target.value })}
                      placeholder="e.g., CSC 491.2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select
                      value={searchForm.semester}
                      onChange={(e) => setSearchForm({ ...searchForm, semester: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      disabled={loading}
                      required
                    >
                      <option value="">Select Semester</option>
                      <option value="1st Semester">1st Semester</option>
                      <option value="2nd Semester">2nd Semester</option>
                    </select>
                  </div>

                  <div className="md:col-span-3 flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Searching...' : 'Search Records'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {searchResult && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-medium">{searchResult.studentId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Course Code</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-medium">{searchResult.courseCode}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Grade</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(searchResult.grade)}`}>
                          {searchResult.grade}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Semester</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-medium">{searchResult.semester}</dd>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPortal;
