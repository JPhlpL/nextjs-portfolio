// components/certificates/CertificateCard.jsx

function CertificateCard({ certificate, onClick }) {
  return (
    <div 
      className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl bg-secondary-light dark:bg-ternary-dark"
      onClick={onClick}
    >
      <img 
        src={certificate.image} 
        alt={certificate.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-4">
        <h3
          className={`font-general-medium text-lg ${
            certificate.highlight 
              ? 'text-yellow-500' 
              : 'text-ternary-dark dark:text-ternary-light'
          }`}
        >
          {certificate.title}
        </h3>
      </div>
    </div>
  );
}

export default CertificateCard;
