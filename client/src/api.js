import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://excel-analytics-dg30.onrender.com/api'
  : 'http://localhost:5000/api';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('excelFile', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload/excel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      timeout: 15000 // 15 second timeout
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'No response from server. Check your connection.'
    );
  }
};