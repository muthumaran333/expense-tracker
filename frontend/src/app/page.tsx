'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

type User = {
  email: string;
};

type AuthResponse = {
  access_token: string;
  user: User;
};

const expenses = [
  { name: 'Grocery run', category: 'Food', amount: 84.2, date: 'Today' },
  { name: 'Metro pass', category: 'Transport', amount: 32, date: 'Yesterday' },
  { name: 'Workspace coffee', category: 'Lifestyle', amount: 8.5, date: 'Aug 28' },
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem('expense_tracker_token');
    if (!token) return;

    const loadUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) setUser(await response.json());
        else window.localStorage.removeItem('expense_tracker_token');
      } catch {
        window.localStorage.removeItem('expense_tracker_token');
      }
    };

    loadUser();
  }, []);

  const submitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/${isRegistering ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? 'Unable to authenticate');
      window.localStorage.setItem('expense_tracker_token', (data as AuthResponse).access_token);
      setUser((data as AuthResponse).user);
      setPassword('');
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    window.localStorage.removeItem('expense_tracker_token');
    setUser(null);
  };

  if (user) {
    return (
      <main className="shell dashboard-shell">
        <nav className="topbar">
          <div className="brand"><span className="brand-mark">ET</span><span>Expense Tracker</span></div>
          <div className="user-menu"><span>{user.email}</span><button className="button button-quiet" onClick={signOut}>Sign out</button></div>
        </nav>
        <section className="dashboard-intro">
          <div><p className="eyebrow">September overview</p><h1>Make every rupee count.</h1><p className="muted">A clear view of where your money is going this month.</p></div>
          <button className="button button-primary">+ Add expense</button>
        </section>
        <section className="summary-grid">
          <article className="summary-card summary-card-dark"><span>Spent this month</span><strong>₹ 1,284.70</strong><small>12% less than last month</small></article>
          <article className="summary-card"><span>Monthly budget</span><strong>₹ 4,000.00</strong><small>32% used</small></article>
          <article className="summary-card"><span>Remaining</span><strong>₹ 2,715.30</strong><small>On track for your goal</small></article>
        </section>
        <section className="content-grid">
          <article className="panel expenses-panel"><div className="panel-heading"><div><p className="eyebrow">Activity</p><h2>Recent expenses</h2></div><button className="text-button">View all</button></div>{expenses.map((expense) => <div className="expense-row" key={expense.name}><div className="expense-icon">{expense.name.charAt(0)}</div><div className="expense-detail"><strong>{expense.name}</strong><span>{expense.category} · {expense.date}</span></div><strong>₹ {expense.amount.toFixed(2)}</strong></div>)}</article>
          <article className="panel budget-panel"><p className="eyebrow">Budget health</p><h2>You are doing well.</h2><div className="progress-track"><div className="progress-value" /></div><div className="budget-labels"><span>₹ 1,284.70 spent</span><span>₹ 4,000.00 limit</span></div><p className="muted">You have room for ₹ 2,715.30 in the rest of the month.</p></article>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-layout">
      <section className="auth-visual"><div className="visual-top"><span className="brand-mark">ET</span><span>Expense Tracker</span></div><div className="visual-copy"><p className="eyebrow">A calmer way to spend</p><h1>Know your money. Keep your momentum.</h1><p>Simple tracking for the decisions that matter, with your whole month in view.</p></div><div className="visual-note"><span>MONTHLY SNAPSHOT</span><strong>32%</strong><small>of your budget used</small></div></section>
      <section className="auth-panel"><div className="auth-form-wrap"><p className="eyebrow">Welcome back</p><h2>{isRegistering ? 'Create your account' : 'Your money, in focus.'}</h2><p className="muted">{isRegistering ? 'Start with a secure account and build better habits.' : 'Sign in to see your spending at a glance.'}</p><form onSubmit={submitAuth}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isRegistering ? 'At least 8 characters' : 'Your password'} minLength={isRegistering ? 8 : 1} required /></label>{error && <p className="form-error">{error}</p>}<button className="button button-primary button-wide" disabled={isLoading}>{isLoading ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'}<span>→</span></button></form><p className="switch-copy">{isRegistering ? 'Already have an account?' : 'New to Expense Tracker?'} <button className="text-button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>{isRegistering ? 'Sign in' : 'Create an account'}</button></p><p className="secure-note">Passwords are protected with Argon2 hashing.</p></div></section>
    </main>
  );
}
