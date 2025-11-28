export default function UsageLimit() {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Limite quotidienne atteinte
        </h2>

        <p className="text-gray-600 mb-6">
          Vous avez consulté 50 contacts aujourd'hui. Pour continuer à accéder à
          tous les contacts, veuillez passer à notre version supérieure.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Version Supérieure
          </h3>
          <ul className="text-blue-800 text-left space-y-2 mb-4">
            <li>✓ Accès illimité aux contacts</li>
            <li>✓ Export des données</li>
            <li>✓ Statistiques avancées</li>
            <li>✓ Support prioritaire</li>
          </ul>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Passer à la version supérieure
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Votre limite sera réinitialisée à minuit.
        </p>
      </div>
    </div>
  );
}
