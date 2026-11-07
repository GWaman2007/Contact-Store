import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookUser, User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(name, email, password);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 rounded-3xl">
        <div className="card-body p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-5">
            <div
              className="inline-flex p-3.5 bg-purple-100 text-purple-900 rounded-2xl mb-2.5 shadow-xs"
              aria-hidden="true"
            >
              <BookUser className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral">Create Account</h1>
            <p className="text-xs sm:text-sm text-base-content/80 mt-1 font-medium">
              Join ContactStore to organize your network
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div role="alert" className="alert alert-error text-xs py-2.5 px-3 rounded-xl mb-4 font-bold">
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label htmlFor="reg-name-input" className="label py-1">
                <span className="label-text font-bold text-xs text-neutral">Full Name *</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-neutral/60 pointer-events-none" aria-hidden="true">
                  <User className="w-4 h-4 stroke-[2.2]" />
                </span>
                <input
                  id="reg-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-10 h-11 text-sm bg-base-100 font-medium focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="reg-email-input" className="label py-1">
                <span className="label-text font-bold text-xs text-neutral">Email Address *</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-neutral/60 pointer-events-none" aria-hidden="true">
                  <Mail className="w-4 h-4 stroke-[2.2]" />
                </span>
                <input
                  id="reg-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="input input-bordered w-full pl-10 h-11 text-sm bg-base-100 font-medium focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="reg-password-input" className="label py-1">
                <span className="label-text font-bold text-xs text-neutral">Password *</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-neutral/60 pointer-events-none" aria-hidden="true">
                  <Lock className="w-4 h-4 stroke-[2.2]" />
                </span>
                <input
                  id="reg-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 h-11 text-sm bg-base-100 font-medium focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-secondary w-full h-11 min-h-11 mt-3 gap-2 font-bold text-slate-900 shadow-xs focus-visible:ring-2 focus-visible:ring-purple-700 focus-visible:outline-hidden"
            >
              <span>{loading ? 'Creating account...' : 'Sign Up'}</span>
              {!loading && <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />}
            </button>
          </form>

          {/* Footer toggle */}
          <div className="divider my-4 text-xs font-bold text-neutral" role="separator">
            OR
          </div>
          <p className="text-center text-xs sm:text-sm text-neutral font-medium">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="link text-purple-900 font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
