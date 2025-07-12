import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching history...');
        const res = await axios.get('https://excel-analytics-dg30.onrender.com/api/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('History data received:', res.data);
        setHistory(res.data.data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err.response?.data?.error || err.message || 'Error fetching history');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [refreshCount]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshCount(prev => prev + 1);
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Loading history...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p style={{ color: 'red' }}>{error}</p>
      <button 
        onClick={handleRefresh}
        style={buttonStyle}
      >
        Retry
      </button>
      <button 
        onClick={() => navigate('/')}
        style={{ ...buttonStyle, marginLeft: '10px' }}
      >
        Back to Home
      </button>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button 
          onClick={() => navigate('/')} 
          style={buttonStyle}
        >
          ← Back to Home
        </button>
        <button
          onClick={handleRefresh}
          style={buttonStyle}
        >
          ↻ Refresh
        </button>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>📊 Upload History</h2>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No history found.</p>
          <button 
            onClick={() => navigate('/upload')}
            style={buttonStyle}
          >
            Upload New File
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={tableStyle}>
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>📁 File Name</th>
                <th style={thStyle}>📅 Uploaded At</th>
                <th style={thStyle}>📈 Chart Type</th>
                <th style={thStyle}>🅧 X Axis</th>
                <th style={thStyle}>🅨 Y Axis</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={item._id || i} style={i % 2 === 0 ? { backgroundColor: '#f9f9f9' } : {}}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>{item.fileName || 'Untitled'}</td>
                  <td style={tdStyle}>{new Date(item.createdAt).toLocaleString()}</td>
                  <td style={tdStyle}>{item.chartType}</td>
                  <td style={tdStyle}>{item.xAxis}</td>
                  <td style={tdStyle}>{item.yAxis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Styles
const buttonStyle = {
  padding: '8px 16px',
  background: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'background 0.3s',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '600px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  marginTop: '1rem',
};

const thStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#4CAF50',
  color: 'white',
  fontWeight: 'bold',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '10px',
};