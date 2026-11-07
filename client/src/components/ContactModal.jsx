import React, { useState, useEffect } from 'react';
import { X, Lock, User, Phone, Mail, Building, Briefcase, Image } from 'lucide-react';

export default function ContactModal({ isOpen, onClose, onSave, contactToEdit }) {
  const isEditing = Boolean(contactToEdit);

  const [formData, setFormData] = useState({
    name: '',
    ph_no: '',
    email: '',
    company_name: '',
    relation_profession: '',
    image_url: '',
    hide_code: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        name: contactToEdit.name || '',
        ph_no: contactToEdit.ph_no || '',
        email: contactToEdit.email || '',
        company_name: contactToEdit.company_name || '',
        relation_profession: contactToEdit.relation_profession || '',
        image_url: contactToEdit.image_url || '',
        hide_code: contactToEdit.hide_code || ''
      });
    } else {
      setFormData({
        name: '',
        ph_no: '',
        email: '',
        company_name: '',
        relation_profession: '',
        image_url: '',
        hide_code: ''
      });
    }
    setError('');
  }, [contactToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.ph_no.trim()) {
      setError('Name and Phone Number are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSave(formData, contactToEdit?.c_id);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save contact.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="modal-box max-w-lg bg-base-100 p-6 border border-base-200 shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 pb-3 mb-4">
          <h2 id="contact-modal-title" className="font-extrabold text-lg text-neutral">
            {isEditing ? 'Edit Contact' : 'Add New Contact'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="btn btn-ghost btn-sm btn-circle text-neutral/70 hover:text-neutral focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
          >
            <X className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div role="alert" className="alert alert-error text-xs py-2.5 px-3 mb-4 rounded-xl font-medium">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name & Phone in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-control">
              <label htmlFor="modal-name-input" className="label py-1">
                <span className="label-text font-bold text-xs text-neutral flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-800" aria-hidden="true" /> Full Name *
                </span>
              </label>
              <input
                id="modal-name-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alice Smith"
                className="input input-bordered input-sm w-full h-10 font-medium"
                required
                aria-required="true"
              />
            </div>

            <div className="form-control">
              <label htmlFor="modal-phone-input" className="label py-1">
                <span className="label-text font-bold text-xs text-neutral flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-800" aria-hidden="true" /> Phone Number *
                </span>
              </label>
              <input
                id="modal-phone-input"
                type="tel"
                name="ph_no"
                value={formData.ph_no}
                onChange={handleChange}
                placeholder="e.g. +1 555-0199"
                className="input input-bordered input-sm w-full h-10 font-medium"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-control">
              <label htmlFor="modal-email-input" className="label py-1">
                <span className="label-text font-bold text-xs text-neutral flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-800" aria-hidden="true" /> Email
                </span>
              </label>
              <input
                id="modal-email-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alice@example.com"
                className="input input-bordered input-sm w-full h-10 font-medium"
              />
            </div>

            <div className="form-control">
              <label htmlFor="modal-company-input" className="label py-1">
                <span className="label-text font-bold text-xs text-neutral flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" /> Company
                </span>
              </label>
              <input
                id="modal-company-input"
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Acme Corp"
                className="input input-bordered input-sm w-full h-10 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-control">
              <label htmlFor="modal-profession-input" className="label py-1">
                <span className="label-text font-bold text-xs text-neutral flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-neutral/70" aria-hidden="true" /> Profession / Title
                </span>
              </label>
              <input
                id="modal-profession-input"
                type="text"
                name="relation_profession"
                value={formData.relation_profession}
                onChange={handleChange}
                placeholder="Lead Architect"
                className="input input-bordered input-sm w-full h-10 font-medium"
              />
            </div>

            <div className="form-control">
              <label htmlFor="modal-image-input" className="label py-1">
                <span className="label-text font-bold text-xs text-neutral flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-neutral/70" aria-hidden="true" /> Avatar Image URL
                </span>
              </label>
              <input
                id="modal-image-input"
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="input input-bordered input-sm w-full h-10 font-medium"
              />
            </div>
          </div>

          {/* Secret Hide Code section */}
          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 mt-2">
            <div className="form-control">
              <label htmlFor="modal-hidecode-input" className="label py-0.5">
                <span className="label-text font-bold text-xs flex items-center gap-1.5 text-amber-950">
                  <Lock className="w-3.5 h-3.5 text-amber-800 stroke-[2.5]" aria-hidden="true" /> Secret Hide Code (Optional)
                </span>
              </label>
              <input
                id="modal-hidecode-input"
                type="text"
                name="hide_code"
                value={formData.hide_code}
                onChange={handleChange}
                placeholder="e.g. 1234 (leave empty for public contact)"
                className="input input-bordered input-sm w-full font-mono mt-1 h-10 bg-white"
                aria-describedby="hidecode-helper-text"
              />
              <span id="hidecode-helper-text" className="text-[11px] text-amber-950/80 mt-1.5 font-medium leading-relaxed">
                If provided, this contact will stay hidden from the main list until unlocked with this exact passcode.
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action pt-3 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-ghost btn-sm h-10 px-4 font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-sm min-w-28 h-10 font-bold text-slate-900 shadow-xs focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:outline-hidden"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Contact' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} aria-hidden="true"></div>
    </div>
  );
}
