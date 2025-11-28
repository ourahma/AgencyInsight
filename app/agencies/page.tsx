// app/agencies/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { AgencyWithDetails } from "../types";
import Papa from "papaparse";

export default function AgenciesPage() {
  const { userId } = useAuth();
  const [agencies, setAgencies] = useState<AgencyWithDetails[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<AgencyWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedAgency, setSelectedAgency] =
    useState<AgencyWithDetails | null>(null);

  useEffect(() => {
    const loadAgencies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/agencies_agency_rows.csv");

        if (!response.ok) {
          throw new Error("Impossible de charger le fichier agencies.csv");
        }

        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            const parsedAgencies: AgencyWithDetails[] = results.data
              .map((row: any) => ({
                id: row.id || "",
                name: row.name?.trim() || "",
                city: row.state?.trim() || "",
                address: (
                  row.physical_address ||
                  row.mailing_address ||
                  ""
                )?.trim(),
                phone: row.phone?.trim() || "",
                state_code: row.state_code?.trim() || "",
                type: row.type?.trim() || "",
                population: row.population || null,
                website: row.website?.trim() || "",
                county: row.county?.trim() || "",
                created_at: row.created_at || "",
                updated_at: row.updated_at || "",
              }))
              .filter((agency) => agency.name && agency.id);

            setAgencies(parsedAgencies);
            setFilteredAgencies(parsedAgencies);
            setLoading(false);
          },
          error: (error) => {
            console.error("Erreur lors du parsing CSV:", error);
            setError("Erreur lors de la lecture du fichier CSV");
            setLoading(false);
          },
        });
      } catch (err) {
        console.error("Erreur lors du chargement des agences:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    loadAgencies();
  }, []);

  useEffect(() => {
    let result = agencies;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (agency) =>
          agency.name.toLowerCase().includes(lowerSearch) ||
          agency.city.toLowerCase().includes(lowerSearch) ||
          agency.address?.toLowerCase().includes(lowerSearch) ||
          agency.phone?.toLowerCase().includes(lowerSearch) ||
          agency.type?.toLowerCase().includes(lowerSearch) ||
          agency.county?.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedState !== "all") {
      result = result.filter((agency) => agency.state_code === selectedState);
    }

    if (selectedType !== "all") {
      result = result.filter((agency) => agency.type === selectedType);
    }

    setFilteredAgencies(result);
  }, [searchTerm, selectedState, selectedType, agencies]);

  const uniqueStates = Array.from(new Set(agencies.map((a) => a.state_code)))
    .filter(Boolean)
    .sort();

  const uniqueTypes = Array.from(new Set(agencies.map((a) => a.type)))
    .filter(Boolean)
    .sort();

  const formatPopulation = (pop: number | null | undefined) => {
    if (!pop) return "N/A";
    return new Intl.NumberFormat("fr-FR").format(pop);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-white/60 rounded-lg w-1/4 mb-8"></div>
            <div className="bg-white/60 rounded-lg p-6 mb-6">
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-white/60 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 shadow-lg">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-red-600 mt-0.5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-1">
                  Erreur de chargement
                </h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-8">
      <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Liste des Agences
          </h1>
          <p className="text-gray-600">
            Gérez et consultez toutes vos agences avec détails complets
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
              >
                <option value="all">Tous les états</option>
                {uniqueStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
              >
                <option value="all">Tous les types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              <span className="font-semibold text-indigo-600">
                {filteredAgencies.length}
              </span>{" "}
              agence{filteredAgencies.length > 1 ? "s" : ""} trouvée
              {filteredAgencies.length > 1 ? "s" : ""}
              {searchTerm || selectedState !== "all" || selectedType !== "all"
                ? ` sur ${agencies.length} au total`
                : ""}
            </span>
            {(searchTerm ||
              selectedState !== "all" ||
              selectedType !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedState("all");
                  setSelectedType("all");
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {filteredAgencies.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-white/20">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune agence trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgencies.map((agency, index) => (
              <div
                key={agency.id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 overflow-hidden group cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedAgency(agency)}
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-shrink-0 h-12 w-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {agency.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {agency.type && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-lg rounded-full text-xs font-semibold text-white">
                        {agency.type}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-yellow-200 transition-colors">
                    {agency.name}
                  </h3>
                  <p className="text-indigo-100 text-sm">{agency.city}</p>
                </div>

                <div className="p-6 space-y-3">
                  {agency.state_code && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-indigo-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium">
                        {agency.state_code}
                      </span>
                    </div>
                  )}

                  {agency.county && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-indigo-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <span className="text-gray-600 text-sm">
                        {agency.county}
                      </span>
                    </div>
                  )}

                  {agency.population && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-indigo-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-gray-600 text-sm">
                        {formatPopulation(agency.population)} habitants
                      </span>
                    </div>
                  )}

                  {agency.website && (
                    <div className="pt-2">
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Visiter le site
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </main>
      {/* Modal de détails */}
      {selectedAgency && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedAgency(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedAgency.name}
                  </h2>
                  <p className="text-indigo-100">
                    {selectedAgency.city}, {selectedAgency.state_code}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAgency(null)}
                  className="text-white/80 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {selectedAgency.type && (
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full text-sm font-semibold">
                  {selectedAgency.type}
                </span>
              )}
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedAgency.county && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                      Comté
                    </h4>
                    <p className="text-gray-900">{selectedAgency.county}</p>
                  </div>
                )}

                {selectedAgency.population && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                      Population
                    </h4>
                    <p className="text-gray-900">
                      {formatPopulation(selectedAgency.population)} habitants
                    </p>
                  </div>
                )}

                {selectedAgency.address && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                      Adresse
                    </h4>
                    <p className="text-gray-900">{selectedAgency.address}</p>
                  </div>
                )}

                {selectedAgency.phone && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                      Téléphone
                    </h4>
                    <a
                      href={`tel:${selectedAgency.phone}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {selectedAgency.phone}
                    </a>
                  </div>
                )}

                {selectedAgency.website && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                      Site Web
                    </h4>
                    <a
                      href={selectedAgency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-medium break-all"
                    >
                      {selectedAgency.website}
                    </a>
                  </div>
                )}
              </div>

              {(selectedAgency.created_at || selectedAgency.updated_at) && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                    {selectedAgency.created_at && (
                      <div>
                        <span className="font-semibold">Créé le:</span>{" "}
                        {new Date(selectedAgency.created_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </div>
                    )}
                    {selectedAgency.updated_at && (
                      <div>
                        <span className="font-semibold">Mis à jour le:</span>{" "}
                        {new Date(selectedAgency.updated_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
