import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ChartVisualizer from '../components/ChartVisualizer';
import { FiUpload, FiFile, FiAlertCircle, FiCheckCircle, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [darkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Supported Excel MIME types
  const EXCEL_MIME_TYPES = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setMessage({ text: '', type: '' }); // Reset previous messages

    // Validate file type
    const isValidFile = EXCEL_MIME_TYPES.includes(selectedFile.type) || 
                       ['.xlsx', '.xls'].some(ext => 
                         selectedFile.name.toLowerCase().endsWith(ext));

    if (isValidFile) {
      setFile(selectedFile);
      setMessage({ text: `Selected: ${selectedFile.name}`, type: 'info' });
    } else {
      setFile(null);
      setMessage({ 
        text: 'Invalid file type. Please upload .xlsx or .xls files only.', 
        type: 'error' 
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ text: 'Please select a file first!', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: 'Processing your file...', type: 'info' });

    const formData = new FormData();
    formData.append('excelFile', file);  // Consistent field name with backend

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/upload/excel`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          timeout: 30000 // 30 second timeout
        }
      );

      if (!response.data?.data) {
        throw new Error('Invalid server response');
      }

      setData(response.data.data);
      setMessage({ 
        text: response.data.msg || 'File processed successfully!', 
        type: 'success' 
      });

    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      
      let errorMessage = 'Upload failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.msg || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server. Check your connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. The file might be too large.';
      }

      setMessage({ text: errorMessage, type: 'error' });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Navigation Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className={`mb-6 px-4 py-2 rounded-lg font-semibold shadow-md flex items-center gap-2 ${
            darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white transition-colors`}
        >
          <FiHome /> Go Back to Home
        </motion.button>

        {/* Upload Section */}
        <motion.div
          variants={itemVariants}
          className={`p-6 rounded-xl shadow-lg mb-8 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } transition-colors`}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FiFile className="mr-2" /> Upload Excel File
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label className="relative cursor-pointer w-full sm:w-auto">
              <div
                className={`px-4 py-2 rounded-lg border-2 border-dashed ${
                  darkMode ? 'border-indigo-500 hover:border-indigo-400' : 'border-indigo-600 hover:border-indigo-500'
                } transition-colors flex items-center`}
              >
                <FiUpload className="mr-2" />
                {file ? file.name : 'Choose file (.xlsx, .xls)'}
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
              </div>
            </label>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleUpload}
              disabled={isLoading || !file}
              className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                isLoading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } transition-colors min-w-[150px] justify-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                'Upload & Analyze'
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-3 rounded-lg flex items-start ${
                  message.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                } ${darkMode ? '!bg-opacity-20' : ''}`}
              >
                {message.type === 'error' ? (
                  <FiAlertCircle className="flex-shrink-0 mr-2 mt-0.5" />
                ) : (
                  <FiCheckCircle className="flex-shrink-0 mr-2 mt-0.5" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Data Display Section */}
        {data.length > 0 && (
          <>
            {/* Data Table Preview */}
            <motion.div
              variants={itemVariants}
              className={`p-6 rounded-xl shadow-lg mb-8 overflow-x-auto ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } transition-colors`}
            >
              <h3 className="text-xl font-semibold mb-4">Data Preview</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {Object.keys(data[0]).map((key) => (
                        <th
                          key={key}
                          className={`p-3 text-left ${
                            darkMode ? 'border-gray-600' : 'border-gray-300'
                          } border-b`}
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 10).map((row, i) => (
                      <tr
                        key={i}
                        className={`${
                          i % 2 === 0
                            ? darkMode
                              ? 'bg-gray-800'
                              : 'bg-white'
                            : darkMode
                            ? 'bg-gray-700'
                            : 'bg-gray-50'
                        }`}
                      >
                        {Object.values(row).map((val, j) => (
                          <td 
                            key={j} 
                            className={`p-3 ${
                              darkMode ? 'border-gray-600' : 'border-gray-200'
                            } border-b`}
                          >
                            {val?.toString()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 10 && (
                  <div className={`text-sm mt-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Showing 10 of {data.length} rows
                  </div>
                )}
              </div>
            </motion.div>

            {/* Chart Visualization */}
            <motion.div
              variants={itemVariants}
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } transition-colors`}
            >
              <h3 className="text-xl font-semibold mb-4">Data Visualization</h3>
              <ChartVisualizer
                data={data}
                defaultXKey={Object.keys(data[0])[0]}
                defaultYKey={Object.keys(data[0])[1]}
                darkMode={darkMode}
              />
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}