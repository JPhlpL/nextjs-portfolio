// pages/certificates/index.jsx

import PagesMetaHead from '../../components/PagesMetaHead';
import CertificatesGrid from '../../components/certificates/CertificateGrid';

function CertificatesPage() {
  return (
    <div className="container mx-auto">
      <PagesMetaHead title="Certificates" />
      <CertificatesGrid />
    </div>
  );
}

export default CertificatesPage;
