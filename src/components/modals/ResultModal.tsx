import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import type { Result } from '../../api/blockchain';
import { getTxHashes } from '../../api/blockchain';

interface ResultModalProps {
  results: Result[];
  onClose: () => void;
}

const ResultModal = ({ results, onClose }: ResultModalProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [txHashes, setTxHashes] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Safety check - if results array is empty, don't render
  if (!results || results.length === 0) {
    return null;
  }

  // Calculate average grade
  const calculateAverageGrade = (results: Result[]) => {
    const gradePoints: { [key: string]: number } = {
      'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'E': 0.5, 'F': 0.0
    };
    
    const validGrades = results.filter(r => r.grade && gradePoints[r.grade] !== undefined);
    if (validGrades.length === 0) return 'N/A';
    
    const totalPoints = validGrades.reduce((sum, r) => sum + (gradePoints[r.grade] || 0), 0);
    const average = totalPoints / validGrades.length;
    return average.toFixed(2);
  };

  // Get student info from first result
  const studentInfo = results[0];
  const totalResults = results.length;
  const averageGrade = calculateAverageGrade(results);

  // Add safety checks for student properties
  const safeStudentInfo = {
    studentId: studentInfo?.studentId || 'N/A',
    timestamp: studentInfo?.timestamp,
    updatedAt: studentInfo?.updatedAt,
    txHash: studentInfo?.txHash || 'N/A', // Add txHash
  };

  useEffect(() => {
    async function fetchTxHashes() {
      if (studentInfo?.studentId) {
        try {
          const res = await getTxHashes(studentInfo.studentId);
          setTxHashes(res.txHashes || []);
        } catch (err) {
          setTxHashes([]);
        }
      }
    }
    fetchTxHashes();
  }, [studentInfo?.studentId]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Simulate PDF generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set up fonts and colors
      doc.setFont('helvetica');
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 139); // Dark blue
      doc.text('ACADEMIC TRANSCRIPT CERTIFICATE', 105, 25, { align: 'center' });
      
      // Institution name
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('University of Port Harcourt', 105, 35, { align: 'center' });
      
      // Verification badge
      doc.setFontSize(12);
      doc.setTextColor(0, 128, 0); // Green
      doc.text('✓ BLOCKCHAIN VERIFIED', 105, 45, { align: 'center' });
      
      // Student information section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text('STUDENT INFORMATION', 20, 65);
      
      doc.setFontSize(12);
      doc.text(`Matriculation Number: ${safeStudentInfo.studentId}`, 20, 75);
      doc.text(`Total Courses: ${totalResults}`, 20, 85);
      doc.text(`Average Grade (GPA): ${averageGrade}`, 20, 95);
      doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 105);
      
      // Academic results section
      doc.setFontSize(14);
      doc.text('ACADEMIC RESULTS', 20, 125);
      
      // Table headers
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Course Code', 20, 140);
      doc.text('Semester', 80, 140);
      doc.text('Grade', 140, 140);
      
      // Table line
      doc.line(20, 142, 180, 142);
      
      // Table data
      doc.setFont('helvetica', 'normal');
      let yPosition = 150;
      results.forEach((result) => {
        if (yPosition > 260) { // Start new page if needed
          doc.addPage();
          yPosition = 30;
        }
        
        doc.text(result.courseCode || 'N/A', 20, yPosition);
        doc.text(result.semester || 'N/A', 80, yPosition);
        doc.text(result.grade || 'N/A', 140, yPosition);
        yPosition += 10;
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Powered by SUI Blockchain Technology', 105, 285, { align: 'center' });
        doc.text(`Certificate ID: ${safeStudentInfo.studentId}-TRANSCRIPT-${Date.now()}`, 105, 290, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, 180, 295);
      }
      
      // Download the PDF
      doc.save(`transcript-${safeStudentInfo.studentId}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const gradeMap: { [key: string]: string } = {
      'A': 'text-green-400 bg-green-500/20 border border-green-500/30',
      'B': 'text-blue-400 bg-blue-500/20 border border-blue-500/30',
      'C': 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30',
      'D': 'text-orange-400 bg-orange-500/20 border border-orange-500/30',
      'E': 'text-red-400 bg-red-500/20 border border-red-500/30',
      'F': 'text-red-500 bg-red-600/20 border border-red-600/30'
    };
    return gradeMap[grade] || 'text-gray-400 bg-gray-500/20 border border-gray-500/30';
  };

  const handleCopy = (hash: string, idx: number) => {
    navigator.clipboard.writeText(hash);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600/90 backdrop-blur-sm border-b border-gray-700 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-white">Academic Transcript</h2>
              <p className="text-blue-200">Blockchain Verified Results</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl font-bold transition-colors hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-white">
          {/* Verification Badge */}
          <div className="mb-6 p-4 rounded-xl border border-green-500/30 bg-green-500/10">
            <div className="flex items-center justify-center">
              <div className="flex items-center text-green-400">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <span className="font-semibold text-lg">BLOCKCHAIN VERIFIED</span>
                  <p className="text-green-300/80 text-sm mt-1">
                    All {totalResults} results secured on SUI blockchain
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wide block mb-2">
                Student ID
              </label>
              <p className="text-xl font-bold text-blue-400">{safeStudentInfo.studentId}</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wide block mb-2">
                Total Courses
              </label>
              <p className="text-xl font-bold text-purple-400">{totalResults}</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wide block mb-2">
                Average GPA
              </label>
              <p className="text-xl font-bold text-green-400">{averageGrade}</p>
            </div>
          </div>

          {/* Academic Results Table */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="text-2xl mr-3">📊</span>
              Academic Results
            </h3>
            <div className="overflow-x-auto">
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Course Code</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Semester</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {results.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {result.courseCode || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {result.semester || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-semibold ${getGradeColor(result.grade || 'N/A')}`}>
                            {result.grade || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Blockchain Information */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-white mb-4 flex items-center">
              <span className="text-2xl mr-3">🔗</span>
              Blockchain Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Network:</span>
                <span className="text-blue-400 font-medium">SUI Testnet</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Status:</span>
                <span className="text-green-400 font-medium">Immutable</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-400 block mb-2">Transaction Hashes:</span>
                <div className="font-mono text-xs bg-gray-800/50 border border-gray-700 p-3 rounded-lg break-all text-gray-300">
                  {txHashes.length > 0 ? (
                    <ul>
                      {txHashes.map((hash, idx) => (
                        <li key={idx} className='p-2 bg-white/5 mb-2 rounded flex items-center justify-between'>
                          <span>{hash}</span>
                          <button
                            onClick={() => handleCopy(hash, idx)}
                            className='ml-2 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors flex items-center'
                            title='Copy hash'
                          >
                            {copiedIdx === idx ? 'Copied!' : 'Copy'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No hashes found.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center w-full shadow-lg hover:shadow-blue-500/25"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <span className="text-xl mr-3">📄</span>
                  Download PDF Transcript
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
