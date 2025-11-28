// app/page.tsx
"use client";

import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import DashboardLayout from "./components/DashboardLayout";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EyeIcon, WaveIcon, StatsIcon, UsersIcon, BuildingIcon } from "./components/Icons";
import { StatsData } from "./types";
import { containerVariants, itemVariants, progressVariants } from "./variants";
// Types pour les données

export default function HomePage() {
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalAgencies, setTotalAgencies] = useState(0);
  const DAILY_LIMIT = Number(process.env.NEXT_PUBLIC_DAILY_LIMIT) || 50;
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<StatsData>({
    contactsViewed: 0,
    totalContacts: 0,
    totalAgencies: 0,
    dailyLimit: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      loadStats();
    }
  }, [isLoaded, user]);

  const loadStats = async () => {
    const today = new Date().toDateString();
    const storageKey = `viewed_contacts_${user?.id}_${today}`;
    const stored = localStorage.getItem(storageKey);
    const contactsViewed = stored ? JSON.parse(stored).contacts.length : 0;
    console.log("contacts viewed:", contactsViewed);

    const fetchCsvCount = async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erreur lors du fetch");
      const text = await res.text();
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      return lines.length - 1; // retirer header
    };

    try {
      const [contactsCount, agenciesCount] = await Promise.all([
        fetchCsvCount("/contacts_contact_rows.csv"),
        fetchCsvCount("/agencies_agency_rows.csv"),
      ]);

      setStats({
        contactsViewed,
        totalContacts: contactsCount,
        totalAgencies: agenciesCount,
        dailyLimit: DAILY_LIMIT,
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <SignedIn>
        <DashboardLayout>
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </SignedIn>
    );
  }

  return (
    <>
      <SignedIn>
        <DashboardLayout>
          <motion.div
            className="p-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* En-tête */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Bonjour, {user?.firstName} <WaveIcon/>
              </h1>
              <p className="text-gray-600 text-lg">
                Voici votre tableau de bord personnel
              </p>
            </motion.div>

            {/* Cartes de statistiques principales */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              variants={containerVariants}
            >
              {/* Contacts consultés aujourd'hui */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Consultés aujourd'hui
                  </h3>
                  <div className="text-2xl"><EyeIcon/></div>
                </div>
                <p className="text-3xl font-bold mb-2">
                  {stats.contactsViewed}
                </p>
                <div className="w-full bg-blue-400 rounded-full h-2">
                  <motion.div
                    className="bg-white rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (stats.contactsViewed / stats.dailyLimit) * 100
                      }%`,
                    }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  {stats.dailyLimit - stats.contactsViewed} restants
                </p>
              </motion.div>

              {/* Total des contacts */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Total Contacts</h3>
                  <div className="text-2xl"><UsersIcon/></div>
                </div>
                <p className="text-3xl font-bold">{stats.totalContacts}</p>
                <p className="text-green-100 text-sm mt-2">Dans la base</p>
              </motion.div>

              {/* Total des agences */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Total Agences</h3>
                  <div className="text-2xl"><BuildingIcon/></div>
                </div>
                <p className="text-3xl font-bold">{stats.totalAgencies}</p>
                <p className="text-purple-100 text-sm mt-2">Agences actives</p>
              </motion.div>
            </motion.div>

            {/* Graphiques et sections détaillées */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              variants={containerVariants}
            >
              {/* Graphique d'utilisation */}
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Utilisation quotidienne
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Contacts consultés</span>
                    <span className="font-semibold">
                      {stats.contactsViewed}/{stats.dailyLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <motion.div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (stats.contactsViewed / stats.dailyLimit) * 100
                        }%`,
                      }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <span>Limite: {stats.dailyLimit}</span>
                  </div>
                </div>
              </motion.div>

              {/* Répartition par type */}
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Répartition des données
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="font-medium">Contacts</span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {stats.totalContacts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <span className="font-medium">Agences</span>
                    </div>
                    <span className="font-bold text-purple-600">
                      {stats.totalAgencies}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="font-medium">
                        Consultations aujourd'hui
                      </span>
                    </div>
                    <span className="font-bold text-green-600">
                      {stats.contactsViewed}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              variants={itemVariants}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BuildingIcon/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Voir les agences
                </h3>
                <p className="text-gray-600">
                  Consultez la liste complète des agences
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gérer les contacts
                </h3>
                <p className="text-gray-600">
                  Accédez à tous vos contacts professionnels
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <StatsIcon/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Statistiques détaillées
                </h3>
                <p className="text-gray-600">
                  Analyses avancées de vos données
                </p>
              </motion.div>
            </motion.div>

            {/* Message de statut */}
            {stats.contactsViewed >= stats.dailyLimit ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">⚠️</div>
                  <div>
                    <h3 className="text-lg font-semibold">Limite atteinte !</h3>
                    <p>
                      Vous avez consulté tous vos contacts disponibles
                      aujourd'hui.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : stats.contactsViewed >= stats.dailyLimit * 0.8 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">🔔</div>
                  <div>
                    <h3 className="text-lg font-semibold">Limite proche</h3>
                    <p>
                      Vous approchez de votre limite quotidienne de
                      consultations.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        </DashboardLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
