import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, contactName, deleting }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal modal-open"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
    >
      <div className="modal-box max-w-sm bg-base-100 p-6 border border-base-200 shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between border-b border-base-200 pb-3 mb-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
            <h2 id="delete-modal-title" className="font-extrabold text-base text-neutral">
              Delete Contact
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

        <p id="delete-modal-desc" className="text-sm text-base-content/90 mb-5 leading-relaxed">
          Are you sure you want to delete <strong className="text-neutral font-bold">"{contactName}"</strong>? This action cannot be undone.
        </p>

        <div className="modal-action flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="btn btn-ghost btn-sm h-10 px-4 font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="btn bg-red-600 hover:bg-red-700 text-white font-bold border-red-700 btn-sm min-w-24 h-10 px-4 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-hidden"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} aria-hidden="true"></div>
    </div>
  );
}
