import React, { useState } from 'react';
import { Lock, X, KeyRound } from 'lucide-react';

export default function SecretCodeModal({ isOpen, onClose, onApplyCode, currentCode }) {
  const [code, setCode] = useState(currentCode || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Please enter a secret code to unlock.');
      return;
    }
    onApplyCode(trimmed);
    onClose();
  };

  return (
    <div
      className="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="secret-modal-title"
    >
      <div className="modal-box max-w-sm bg-base-100 p-6 border border-base-200 shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between border-b border-base-200 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-xl" aria-hidden="true">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h2 id="secret-modal-title" className="font-extrabold text-base sm:text-lg text-neutral">
              Unlock Secret Contacts
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="btn btn-ghost btn-sm btn-circle text-neutral/70 hover:text-neutral focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
          >
            <X className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
          </button>
        </div>

        {error && (
          <div role="alert" className="alert alert-warning text-xs py-2.5 px-3 mb-3.5 rounded-xl font-bold text-amber-950">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-base-content/80 font-medium leading-relaxed">
            Enter your secret passcode to view and manage contacts protected under that code.
          </p>

          <div className="form-control">
            <label htmlFor="secret-passcode-input" className="sr-only">
              Secret Passcode
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 flex items-center text-neutral/60 pointer-events-none" aria-hidden="true">
                <KeyRound className="w-4 h-4 stroke-[2.2]" />
              </span>
              <input
                id="secret-passcode-input"
                type="text"
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="Enter secret code (e.g. 9876)"
                className="input input-bordered w-full pl-10 h-11 font-mono tracking-widest text-center text-sm font-bold bg-base-100 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="modal-action pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm h-10 px-4 font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold border-amber-500 btn-sm h-10 px-4 focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:outline-hidden"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} aria-hidden="true"></div>
    </div>
  );
}
