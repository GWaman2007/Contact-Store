import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api/client';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ContactCard from '../components/ContactCard';
import ContactModal from '../components/ContactModal';
import SecretCodeModal from '../components/SecretCodeModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { Lock, Unlock, Plus, Users, SearchX, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Secret code state (for hidden contacts layer)
  const [secretCode, setSecretCode] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch contacts according to active secret code
  const fetchContacts = useCallback(async (code = '', query = '') => {
    try {
      setLoading(true);
      setError('');

      let res;
      if (query.trim()) {
        // Modern HTTP QUERY method: Safe, idempotent query directly on /api/contacts
        res = await api({
          method: 'QUERY',
          url: '/api/contacts',
          data: { q: query.trim(), ...(code ? { code } : {}) }
        });
      } else {
        const url = code ? `/api/contacts?code=${encodeURIComponent(code)}` : '/api/contacts';
        res = await api.get(url);
      }

      setContacts(res.data.contacts || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err.response?.data?.message || 'Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when secretCode changes
  useEffect(() => {
    fetchContacts(secretCode, searchQuery);
  }, [secretCode, fetchContacts]);

  // Handle Search Input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(secretCode, searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, secretCode, fetchContacts]);

  // Group contacts alphabetically by first letter of their name
  const groupedContacts = useMemo(() => {
    const groups = {};
    contacts.forEach((contact) => {
      const firstLetter = (contact.name?.charAt(0) || '#').toUpperCase();
      const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
      if (!groups[key]) groups[key] = [];
      groups[key].push(contact);
    });

    // Return sorted keys (A-Z, then #)
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((key) => ({
      letter: key,
      list: groups[key]
    }));
  }, [contacts]);

  // Add / Edit contact handler
  const handleSaveContact = async (formData, contactId) => {
    if (contactId) {
      // Update resource
      await api.put(`/api/contacts/${contactId}`, formData);
    } else {
      // Create resource
      await api.post('/api/contacts', formData);
    }
    // Refresh list
    await fetchContacts(secretCode, searchQuery);
  };

  // Delete contact handler
  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/api/contacts/${contactToDelete.c_id}`);
      setContactToDelete(null);
      await fetchContacts(secretCode, searchQuery);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete contact.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={() => {
          setContactToEdit(null);
          setIsContactModalOpen(true);
        }}
        secretCode={secretCode}
        onOpenSecretModal={() => setIsSecretModalOpen(true)}
        onClearSecretCode={() => setSecretCode('')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Secret Mode Banner if active */}
        {secretCode && (
          <div className="alert alert-warning shadow-sm flex items-center justify-between py-3 px-4 rounded-xl border border-warning/40">
            <div className="flex items-center gap-2 text-warning-content text-xs sm:text-sm">
              <Unlock className="w-5 h-5 shrink-0" />
              <span>
                <strong>Secret Mode Unlocked:</strong> Showing hidden contacts protected by passcode{' '}
                <code className="bg-warning/30 px-2 py-0.5 rounded font-mono font-bold">
                  {secretCode}
                </code>
              </span>
            </div>
            <button
              onClick={() => setSecretCode('')}
              className="btn btn-sm btn-ghost hover:bg-warning/30 text-warning-content"
            >
              Exit Secret Mode
            </button>
          </div>
        )}

        {/* Search & Stats Bar */}
        <div className="card bg-base-100 shadow-sm border border-base-300 p-4 rounded-2xl">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            totalCount={contacts.length}
          />
        </div>

        {/* Error notification */}
        {error && (
          <div className="alert alert-error text-sm py-2 px-4 rounded-xl shadow-sm">
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="text-sm font-bold text-neutral">Loading contacts...</span>
          </div>
        )}

        {/* Empty State: No Contacts */}
        {!loading && contacts.length === 0 && (
          <div className="card bg-base-100 shadow-sm border border-base-200 text-center py-16 px-4 rounded-2xl">
            <div className="max-w-md mx-auto space-y-3">
              <div className="inline-flex p-4 bg-teal-100 text-teal-800 rounded-full mb-1">
                {searchQuery ? <SearchX className="w-8 h-8 stroke-[2.2]" /> : <Users className="w-8 h-8 stroke-[2.2]" />}
              </div>
              <h3 className="text-lg font-extrabold text-neutral">
                {searchQuery
                  ? 'No matching contacts found'
                  : secretCode
                  ? 'No secret contacts under this code'
                  : 'Your contact book is empty'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral font-medium">
                {searchQuery
                  ? `No contacts match "${searchQuery}". Try a different search term or clear the filter.`
                  : secretCode
                  ? `No contacts have been saved with the secret code "${secretCode}". Click below to add one.`
                  : 'Start adding your friends, colleagues, and secret contacts to keep everything organized.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setContactToEdit(null);
                    setIsContactModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm gap-1.5 h-10 px-4 font-bold text-slate-900"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alphabetical Groups */}
        {!loading && contacts.length > 0 && (
          <div className="space-y-6">
            {groupedContacts.map(({ letter, list }) => (
              <section key={letter} className="space-y-3">
                {/* Alphabet Letter Header Badge */}
                <div className="flex items-center gap-3">
                  <div className="badge badge-primary font-bold text-sm px-3.5 py-3 rounded-lg shadow-xs text-slate-900">
                    {letter}
                  </div>
                  <div className="h-px bg-base-300 flex-1"></div>
                  <span className="text-xs font-bold text-neutral tracking-wide">
                    {list.length} contact{list.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Grid of contact cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map((contact) => (
                    <ContactCard
                      key={contact.c_id}
                      contact={contact}
                      onEdit={(c) => {
                        setContactToEdit(c);
                        setIsContactModalOpen(true);
                      }}
                      onDelete={(c) => setContactToDelete(c)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Contact Create / Edit Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setContactToEdit(null);
        }}
        onSave={handleSaveContact}
        contactToEdit={contactToEdit}
      />

      {/* Secret Code Unlock Modal */}
      <SecretCodeModal
        isOpen={isSecretModalOpen}
        onClose={() => setIsSecretModalOpen(false)}
        onApplyCode={(code) => setSecretCode(code)}
        currentCode={secretCode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(contactToDelete)}
        onClose={() => setContactToDelete(null)}
        onConfirm={handleConfirmDelete}
        contactName={contactToDelete?.name || ''}
        deleting={deleting}
      />
    </div>
  );
}
