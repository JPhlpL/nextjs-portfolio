import { useState } from "react";
import CertificateCard from "./CertificateCard";
import { certificatesData } from "../../data/certificatesData";

function CertificatesGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showHighlightedOnly, setShowHighlightedOnly] = useState(false);

  let filteredCertificates = certificatesData.filter((cert) =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showHighlightedOnly) {
    filteredCertificates = filteredCertificates.filter(
      (cert) => cert.highlight
    );
  }

  const handleCardClick = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const closeModal = () => {
    setSelectedCertificate(null);
  };

  return (
    <section className="py-5 sm:py-10 mt-5 sm:mt-10">
      <div className="text-center mb-6">
        <h1 className="font-general-medium text-2xl sm:text-4xl text-ternary-dark dark:text-ternary-light">
          My Certificates
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Browse and search my certificates
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        {/* Search Input */}
        <input
          type="search"
          placeholder="Search certificates by title"
          className="pl-4 pr-4 py-2 border border-gray-200 dark:border-secondary-dark rounded-lg text-sm sm:text-md bg-secondary-light dark:bg-ternary-dark text-primary-dark dark:text-ternary-light focus:ring-2 focus:ring-primary-light dark:focus:ring-secondary-dark w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Highlighted-only checkbox */}
        <label className="flex items-center space-x-2 text-sm text-primary-dark dark:text-ternary-light">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={showHighlightedOnly}
            onChange={(e) => setShowHighlightedOnly(e.target.checked)}
          />
          <span>Only Highlighted</span>
        </label>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((cert) => (
          <CertificateCard
            key={cert.id}
            certificate={cert}
            onClick={() => handleCardClick(cert)}
          />
        ))}
      </div>

      {/* Modal to view certificate detail */}
      {selectedCertificate && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-ternary-dark p-4 rounded-lg shadow-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
              onClick={closeModal}
            >
              X
            </button>
            <img
              src={selectedCertificate.image}
              alt={selectedCertificate.title}
              className="w-full h-auto rounded-md"
            />
            <h2
              className={`mt-4 text-xl font-bold ${
                selectedCertificate.highlight
                  ? "text-yellow-500"
                  : "text-ternary-dark dark:text-ternary-light"
              }`}
            >
              {selectedCertificate.title}
            </h2>
            {selectedCertificate.skills &&
              selectedCertificate.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCertificate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 border border-gray-300 rounded-full text-xs text-gray-700 dark:text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}
    </section>
  );
}

export default CertificatesGrid;
