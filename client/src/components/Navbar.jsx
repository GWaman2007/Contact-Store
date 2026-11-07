import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookUser, Lock, Unlock, LogOut, Plus } from 'lucide-react';

export default function Navbar({ onOpenAddModal, secretCode, onOpenSecretModal, onClearSecretCode }) {
  const { user, logout } = useAuth();

  return (
    <header
      role="banner"
      className="navbar min-h-16 bg-base-100 shadow-sm border-b border-base-300 px-4 sm:px-8 sticky top-0 z-30 flex items-center justify-between"
    >
      {/* Brand logo & title */}
      <div className="flex-1 flex items-center gap-3">
        <div
          aria-hidden="true"
          className="p-2.5 bg-teal-100 text-teal-800 rounded-xl shrink-0 flex items-center justify-center shadow-xs"
        >
          <BookUser className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-neutral">
            Contact<span className="text-teal-700">Store</span>
          </span>
          <span
            className="badge badge-neutral badge-sm text-[11px] font-bold px-2 py-0.5"
            aria-label="Built on MERN stack"
          >
            MERN
          </span>
        </div>
      </div>

      {/* Right actions */}
      <nav aria-label="User actions" className="flex-none flex items-center gap-2 sm:gap-3">
        {/* Secret Code Mode indicator & toggle */}
        {secretCode ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 bg-amber-100 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300 text-xs sm:text-sm font-semibold h-10 shadow-xs"
          >
            <Unlock className="w-4 h-4 text-amber-800 shrink-0 stroke-[2.5]" aria-hidden="true" />
            <span className="hidden md:inline">Unlocked Code:</span>
            <span className="font-mono font-bold tracking-wider text-amber-900 bg-amber-200/70 px-1.5 py-0.5 rounded">
              {secretCode}
            </span>
            <button
              onClick={onClearSecretCode}
              aria-label="Lock secret contacts and return to public mode"
              className="btn btn-ghost btn-xs text-red-700 hover:bg-red-100 ml-1 h-7 px-2 font-bold focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-hidden"
              title="Lock secret contacts"
            >
              Lock
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenSecretModal}
            aria-label="Unlock secret contacts mode"
            className="btn btn-outline border-purple-800 text-purple-950 hover:bg-purple-100 btn-sm gap-2 h-10 min-h-10 px-3 font-semibold focus-visible:ring-2 focus-visible:ring-purple-700 focus-visible:outline-hidden"
            title="Unlock hidden contacts with your secret code"
          >
            <Lock className="w-4 h-4 text-purple-800 shrink-0 stroke-[2.2]" aria-hidden="true" />
            <span className="hidden sm:inline">Secret Mode</span>
          </button>
        )}

        {/* Add Contact Button */}
        <button
          onClick={onOpenAddModal}
          aria-label="Add new contact"
          className="btn btn-primary btn-sm gap-2 h-10 min-h-10 px-4 font-bold text-slate-900 shadow-xs focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:outline-hidden"
        >
          <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" aria-hidden="true" />
          <span className="hidden sm:inline">Add Contact</span>
        </button>

        {/* User Profile & Logout */}
        {user && (
          <div className="dropdown dropdown-end dropdown-bottom">
            <button
              tabIndex={0}
              aria-label={`User account menu for ${user.name}`}
              aria-haspopup="true"
              className="btn btn-ghost btn-sm btn-circle avatar placeholder border border-base-300 w-10 h-10 min-h-10 hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
            >
              <div className="bg-neutral text-neutral-content rounded-full w-9 h-9 flex items-center justify-center text-sm font-bold shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>
            <ul
              tabIndex={0}
              role="menu"
              aria-label="User options"
              className="dropdown-content menu menu-sm z-50 p-3 shadow-xl bg-base-100 rounded-2xl w-60 border border-base-200 mt-2 right-0"
            >
              <li className="menu-title px-2 py-1.5" role="presentation">
                <span className="font-bold text-sm text-neutral">{user.name}</span>
                <span className="text-xs font-semibold text-neutral/90 truncate">{user.email}</span>
              </li>
              <div className="divider my-1" role="separator"></div>
              <li role="none">
                <button
                  role="menuitem"
                  onClick={logout}
                  className="text-red-700 hover:text-red-800 hover:bg-red-50 flex items-center gap-2.5 font-bold py-2.5 rounded-xl focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-hidden"
                >
                  <LogOut className="w-4 h-4 stroke-[2.2]" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
