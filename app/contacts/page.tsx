// app/contacts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ContactWithDetails } from "../types";
import Papa from "papaparse";
import  Navbar  from "../components/Navbar";
export default function ContactsPage() {
  const { userId } = useAuth();
  const [contacts, setContacts] = useState<ContactWithDetails[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<
    ContactWithDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedContact, setSelectedContact] =
    useState<ContactWithDetails | null>(null);
  const [viewedContacts, setViewedContacts] = useState<Set<string>>(new Set());
  const DAILY_LIMIT = Number(process.env.NEXT_PUBLIC_DAILY_LIMIT) || 50;

  // Charger les contacts consultés depuis localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const storageKey = `viewed_contacts_${userId}_${today}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const data = JSON.parse(stored);
        setViewedContacts(new Set(data.contacts));
      } catch (e) {
        console.error("Erreur:", e);
      }
    }
  }, [userId]);

  const saveViewedContacts = (contactIds: Set<string>) => {
    const today = new Date().toDateString();
    const storageKey = `viewed_contacts_${userId}_${today}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        contacts: Array.from(contactIds),
        date: today,
      })
    );
  };

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/contacts_contact_rows.csv");
        if (!response.ok) throw new Error("Impossible de charger le fichier");
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            const parsed: ContactWithDetails[] = results.data
              .map((row: any) => ({
                id: row.id || "",
                firstName: row.first_name?.trim() || "",
                lastName: row.last_name?.trim() || "",
                email: row.email?.trim() || "",
                phone: row.phone?.trim() || "",
                title: row.title?.trim() || "",
                agencyId: row.agency_id?.trim() || "",
                department: row.department?.trim() || "",
                email_type: row.email_type?.trim() || "",
                contact_form_url: row.contact_form_url?.trim() || "",
                firm_id: row.firm_id?.trim() || "",
                created_at: row.created_at || "",
                updated_at: row.updated_at || "",
              }))
              .filter((c) => c.firstName && c.lastName && c.id);
            setContacts(parsed);
            setFilteredContacts(parsed);
            setLoading(false);
          },
          error: () => {
            setError("Erreur lors de la lecture du CSV");
            setLoading(false);
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };
    loadContacts();
  }, []);

  useEffect(() => {
    let result = contacts;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.firstName.toLowerCase().includes(lower) ||
          c.lastName.toLowerCase().includes(lower) ||
          c.email.toLowerCase().includes(lower) ||
          c.phone?.toLowerCase().includes(lower) ||
          c.title?.toLowerCase().includes(lower) ||
          c.department?.toLowerCase().includes(lower)
      );
    }
    if (selectedDepartment !== "all") {
      result = result.filter((c) => c.department === selectedDepartment);
    }
    setFilteredContacts(result);
  }, [searchTerm, selectedDepartment, contacts]);

  const handleContactClick = (contact: ContactWithDetails) => {
    if (viewedContacts.size >= DAILY_LIMIT && !viewedContacts.has(contact.id))
      return;
    const newViewed = new Set(viewedContacts);
    newViewed.add(contact.id);
    setViewedContacts(newViewed);
    saveViewedContacts(newViewed);
    setSelectedContact(contact);
  };

  const uniqueDepartments = Array.from(
    new Set(contacts.map((c) => c.department))
  )
    .filter(Boolean)
    .sort();
  const remainingViews = Math.max(0, DAILY_LIMIT - viewedContacts.size);
  const isLimitReached = viewedContacts.size >= DAILY_LIMIT;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-10 bg-white/60 rounded-lg w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/60 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="max-w-7xl mx-auto bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800">{error}</h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="min-h-screen">
        <div className="  p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Liste des Contacts
                </h1>
                <p className="text-gray-600">
                  Gérez et consultez vos contacts professionnels
                </p>
              </div>
              <div
                className={`px-6 py-4 rounded-2xl shadow-lg ${
                  isLimitReached
                    ? "bg-red-50"
                    : "bg-gradient-to-r from-indigo-50 to-purple-50"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      isLimitReached ? "text-red-600" : "text-indigo-600"
                    }`}
                  >
                    {remainingViews}
                  </div>
                  <div className="text-sm text-gray-600">
                    restante{remainingViews > 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    {viewedContacts.size}/{DAILY_LIMIT}
                  </div>
                </div>
              </div>
            </div>

            {isLimitReached && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8 mb-6">
                <div className="flex items-start">
                  <svg
                    className="w-12 h-12 text-red-600 mr-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">
                      Limite quotidienne atteinte
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Vous avez consulté {DAILY_LIMIT} contacts aujourd'hui.
                    </p>
                    <div className="bg-white/70 rounded-xl p-6 mb-4">
                      <h4 className="font-semibold mb-3">✨ Version Premium</h4>
                      <ul className="space-y-2">
                        <li>✅ Consultations illimitées</li>
                        <li>✅ Export CSV</li>
                        <li>✅ Support prioritaire</li>
                      </ul>
                    </div>
                    <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg">
                      Passer à Premium
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="pl-10 pr-4 py-3 border rounded-lg"
                >
                  <option value="all">Tous les départements</option>
                  {uniqueDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact, i) => {
                const isViewed = viewedContacts.has(contact.id);
                const canView = isViewed || !isLimitReached;
                return (
                  <div
                    key={contact.id}
                    className={`bg-white/80 rounded-2xl shadow-lg overflow-hidden ${
                      canView ? "cursor-pointer" : "opacity-60"
                    }`}
                    onClick={() => canView && handleContactClick(contact)}
                  >
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 relative">
                      {!canView && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="flex items-center">
                        <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {contact.firstName[0]}
                            {contact.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-white">
                            {contact.firstName} {contact.lastName}
                          </h3>
                          {contact.title && (
                            <p className="text-indigo-100 text-sm">
                              {contact.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm truncate">
                        {canView ? contact.email : "••••@••••.com"}
                      </p>
                      {contact.department && (
                        <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                          {contact.department}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedContact && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedContact(null)}
            >
              <div
                className="bg-white rounded-2xl max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                  <h2 className="text-3xl font-bold">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h2>
                  {selectedContact.title && (
                    <p className="text-indigo-100">{selectedContact.title}</p>
                  )}
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-500 text-sm uppercase mb-2">
                        Email
                      </h4>
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="text-indigo-600"
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                    {selectedContact.phone && (
                      <div>
                        <h4 className="font-semibold text-gray-500 text-sm uppercase mb-2">
                          Téléphone
                        </h4>
                        <a
                          href={`tel:${selectedContact.phone}`}
                          className="text-indigo-600"
                        >
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                    {selectedContact.department && (
                      <div>
                        <h4 className="font-semibold text-gray-500 text-sm uppercase mb-2">
                          Département
                        </h4>
                        <p>{selectedContact.department}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
