import { useState } from 'react';

interface UpdateVerifyFormProps {
  onUpdate: (studentId: string, courseCode: string, semester: string, newGrade: string) => Promise<void>;
  onVerify: (studentId: string, courseCode: string, semester: string) => Promise<void>;
}

const UpdateVerifyForm = ({ onUpdate, onVerify }: UpdateVerifyFormProps) => {
  const [updateData, setUpdateData] = useState({
    studentId: '',
    courseCode: '',
    semester: '',
    newGrade: ''
  });

  const [verifyData, setVerifyData] = useState({
    studentId: '',
    courseCode: '',
    semester: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const grades = ['A', 'B', 'C', 'D', 'E', 'F'];

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateData.studentId || !updateData.courseCode || !updateData.semester || !updateData.newGrade) {
      alert('Please fill in all update fields');
      return;
    }
    
    setIsUpdating(true);
    try {
      await onUpdate(updateData.studentId, updateData.courseCode, updateData.semester, updateData.newGrade);
      setUpdateData({ studentId: '', courseCode: '', semester: '', newGrade: '' });
      alert('Result updated successfully!');
    } catch (error) {
      console.error('Error updating result:', error);
      alert('Failed to update result');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyData.studentId || !verifyData.courseCode || !verifyData.semester) {
      alert('Please fill in all verify fields');
      return;
    }
    
    setIsVerifying(true);
    try {
      await onVerify(verifyData.studentId, verifyData.courseCode, verifyData.semester);
      setVerifyData({ studentId: '', courseCode: '', semester: '' });
      alert('Result verified successfully!');
    } catch (error) {
      console.error('Error verifying result:', error);
      alert('Failed to verify result');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value
    });
  };

  const handleVerifyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVerifyData({
      ...verifyData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Update Grade Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Update Grade</h2>
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div>
            <label htmlFor="update-studentId" className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              id="update-studentId"
              name="studentId"
              value={updateData.studentId}
              onChange={handleUpdateChange}
              placeholder="e.g., STU001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isUpdating}
            />
          </div>

          <div>
            <label htmlFor="update-courseCode" className="block text-sm font-medium text-gray-700 mb-1">
              Course Code
            </label>
            <input
              type="text"
              id="update-courseCode"
              name="courseCode"
              value={updateData.courseCode}
              onChange={handleUpdateChange}
              placeholder="e.g., CS101"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isUpdating}
            />
          </div>

          <div>
            <label htmlFor="update-semester" className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              id="update-semester"
              name="semester"
              value={updateData.semester}
              onChange={handleUpdateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isUpdating}
            >
              <option value="">Select Semester</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
            </select>
          </div>

          <div>
            <label htmlFor="update-newGrade" className="block text-sm font-medium text-gray-700 mb-1">
              New Grade
            </label>
            <select
              id="update-newGrade"
              name="newGrade"
              value={updateData.newGrade}
              onChange={handleUpdateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isUpdating}
            >
              <option value="">Select New Grade</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isUpdating}
            className="w-full px-4 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating ? 'Updating...' : 'Update Grade'}
          </button>
        </form>
      </div>

      {/* Verify Result Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Verify Result</h2>
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div>
            <label htmlFor="verify-studentId" className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              id="verify-studentId"
              name="studentId"
              value={verifyData.studentId}
              onChange={handleVerifyChange}
              placeholder="e.g., STU001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isVerifying}
            />
          </div>

          <div>
            <label htmlFor="verify-courseCode" className="block text-sm font-medium text-gray-700 mb-1">
              Course Code
            </label>
            <input
              type="text"
              id="verify-courseCode"
              name="courseCode"
              value={verifyData.courseCode}
              onChange={handleVerifyChange}
              placeholder="e.g., CS101"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isVerifying}
            />
          </div>

          <div>
            <label htmlFor="verify-semester" className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              id="verify-semester"
              name="semester"
              value={verifyData.semester}
              onChange={handleVerifyChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isVerifying}
            >
              <option value="">Select Semester</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isVerifying}
            className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isVerifying ? 'Verifying...' : 'Verify Result'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateVerifyForm;
