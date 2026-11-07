import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ searchQuery, onSearchChange, onClear, totalCount }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full" role="search">
      {/* DaisyUI native icon input wrapper */}
      <label className="input input-bordered flex items-center gap-2.5 w-full max-w-md h-11 bg-base-100 rounded-xl border-base-300 shadow-2xs focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20">
        <Search className="w-4 h-4 text-teal-800 shrink-0 stroke-[2.5]" aria-hidden="true" />
        <input
          id="contact-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, phone, email, or company..."
          className="grow text-sm text-neutral placeholder:text-stone-700 bg-transparent outline-hidden font-medium"
          aria-label="Search contacts by name, phone, email, or company"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search query"
            className="btn btn-ghost btn-xs btn-circle text-neutral hover:bg-base-200"
          >
            <X className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          </button>
        )}
      </label>

      <div
        className="text-xs sm:text-sm text-neutral self-end sm:self-center font-semibold shrink-0"
        role="status"
        aria-live="polite"
      >
        Total: <span className="font-bold text-neutral">{totalCount}</span> contact{totalCount === 1 ? '' : 's'}
      </div>
    </div>
  );
}
