'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api/config';

export default function ApiTestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        setStatus('loading');
        setMessage('Testing API connection...');
        
        // Try to connect to the API health check endpoint
        console.log('Connecting to API:', API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/up`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        setStatus('success');
        setMessage(`API connection successful! Response: ${JSON.stringify(data)}`);
        setError(null);
      } catch (err) {
        setStatus('error');
        setMessage('API connection failed');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    testApiConnection();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Environment Configuration</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        <div className={`p-4 rounded ${status === 'loading' ? 'bg-yellow-100' : 
          status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className="font-medium">
            Status: {status === 'loading' ? '⏳ Loading...' : 
              status === 'success' ? '✅ Connected' : '❌ Failed'}
          </p>
          <p>{message}</p>
          {error && (
            <div className="mt-2 text-red-600">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
        <ul className="list-disc pl-5">
          <li>Check that your backend server is running</li>
          <li>Verify that CORS is properly configured on the backend</li>
          <li>Ensure the API URL is correct in your environment variables</li>
          <li>Check network tab in browser dev tools for more details</li>
        </ul>
      </div>
    </div>
  );
}