'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, { cache: 'no-store' });
        const data = await response.json();
        setBackendStatus(response.ok && data?.status === 'healthy' ? 'Healthy' : 'Unhealthy');
      } catch {
        setBackendStatus('Unhealthy');
      }
    };

    checkHealth();
  }, []);

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: '3rem', maxWidth: '720px', margin: '0 auto' }}>
      <h1>Expense Tracker</h1>
      <p>Backend Status: {backendStatus}</p>
      <p>API endpoint: {API_URL}/health</p>
    </main>
  );
}
