import React from 'react';
import { Phone, Mail, Building2, Briefcase, Lock, Pencil, Trash2 } from 'lucide-react';

export default function ContactCard({ contact, onEdit, onDelete }) {
  const {
    name,
    ph_no,
    email,
    company_name,
    relation_profession,
    image_url,
    is_hidden,
    hide_code
  } = contact;

  const avatarSrc =
    image_url && image_url.trim()
      ? image_url
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f472b6&color=fff&size=128&bold=true`;

  return (
    <article
      aria-label={`Contact details for ${name}`}
      className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-200 h-full flex flex-col justify-between"
    >
      <div className="card-body p-4 sm:p-5 flex flex-col justify-between h-full">
        <div>
          {/* Top row: Avatar & Identity */}
          <div className="flex items-start gap-3.5">
            <div className="avatar shrink-0">
              <div className="w-12 h-12 rounded-xl ring-2 ring-primary/20 overflow-hidden bg-base-200 flex items-center justify-center">
                <img
                  src={avatarSrc}
                  alt={`Profile avatar for ${name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f472b6&color=fff`;
                  }}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-neutral truncate leading-snug">
                  {name}
                </h3>
                {is_hidden && (
                  <span
                    className="badge badge-warning badge-sm gap-1 font-mono font-bold text-xs shrink-0 text-amber-950 border-amber-300"
                    aria-label={hide_code ? `Secret contact with code ${hide_code}` : 'Secret hidden contact'}
                  >
                    <Lock className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
                    {hide_code ? `Code: ${hide_code}` : 'Secret'}
                  </span>
                )}
              </div>

              {relation_profession && (
                <p className="text-xs text-base-content/80 flex items-center gap-1.5 mt-0.5 truncate font-medium">
                  <Briefcase className="w-3.5 h-3.5 shrink-0 text-neutral/70" aria-hidden="true" />
                  <span className="truncate">{relation_profession}</span>
                </p>
              )}
            </div>
          </div>

          {/* Info Rows */}
          <div className="mt-4 space-y-2.5 text-xs sm:text-sm text-base-content">
            <div className="flex items-center gap-2.5 truncate">
              <Phone className="w-4 h-4 text-teal-800 shrink-0 stroke-[2.2]" aria-hidden="true" />
              <a
                href={`tel:${ph_no}`}
                aria-label={`Call ${name} at ${ph_no}`}
                className="hover:text-teal-800 hover:underline font-semibold text-neutral transition-colors truncate focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:outline-hidden rounded"
              >
                {ph_no}
              </a>
            </div>

            {email && (
              <div className="flex items-center gap-2.5 truncate">
                <Mail className="w-4 h-4 text-purple-800 shrink-0 stroke-[2.2]" aria-hidden="true" />
                <a
                  href={`mailto:${email}`}
                  aria-label={`Send email to ${name} at ${email}`}
                  className="hover:text-purple-800 hover:underline transition-colors truncate focus-visible:ring-2 focus-visible:ring-purple-700 focus-visible:outline-hidden rounded text-base-content/90 font-medium"
                >
                  {email}
                </a>
              </div>
            )}

            {company_name && (
              <div className="flex items-center gap-2.5 truncate text-base-content/80">
                <Building2 className="w-4 h-4 text-amber-800 shrink-0 stroke-[2.2]" aria-hidden="true" />
                <span className="truncate font-medium">{company_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="card-actions justify-end mt-4 pt-3 border-t border-base-200 gap-2 flex items-center">
          <button
            onClick={() => onEdit(contact)}
            aria-label={`Edit contact ${name}`}
            className="btn btn-ghost btn-sm text-neutral hover:bg-base-200 gap-1.5 h-8 min-h-8 px-2.5 font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
          >
            <Pencil className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(contact)}
            aria-label={`Delete contact ${name}`}
            className="btn btn-ghost btn-sm text-red-700 hover:text-red-800 hover:bg-red-50 gap-1.5 h-8 min-h-8 px-2.5 font-bold focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-hidden"
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}
