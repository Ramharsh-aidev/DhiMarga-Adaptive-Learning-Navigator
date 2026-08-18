import { useState, useEffect } from 'react';
import { Award, Search, Filter } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/ui/student/EmptyState';
import CertificateCard from '../../components/ui/student/CertificateCard';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { getMyCertificates, downloadCertificate } from '../../services/certificateService';

const Certificates = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyCertificates();
      setCertificates(data || []);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError(err.response?.data?.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId) => {
    try {
      setError(null);
      await downloadCertificate(certificateId);
      setSuccess('Certificate downloaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error downloading certificate:', err);
      setError(err.response?.data?.message || 'Failed to download certificate');
    }
  };

  const handleView = (certificate) => {
    setSelectedCertificate(certificate);
    setViewModal(true);
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <PageLoader text="Loading certificates..." />;

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Alerts */}
        {error && (
          <Alert
            variant="danger"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}
        
        {success && (
          <Alert
            variant="success"
            title="Success"
            message={success}
            onClose={() => setSuccess(null)}
            className="mb-6"
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              My Certificates
            </h1>
            <p className="text-gray-600">
              {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
            </p>
          </div>
        </div>

        {/* Search Bar */}
        {certificates.length > 0 && (
          <div className="mb-6">
            <Input
              icon={Search}
              placeholder="Search certificates by course name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Certificates Grid */}
        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onDownload={handleDownload}
                onView={handleView}
              />
            ))}
          </div>
        ) : certificates.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No certificates match your search.</p>
          </div>
        ) : (
          <EmptyState
            icon={Award}
            title="No Certificates Yet"
            message="Complete courses to earn certificates and showcase your achievements!"
          />
        )}

        {/* Certificate View Modal */}
        <Modal
          isOpen={viewModal}
          onClose={() => setViewModal(false)}
          title="Certificate Preview"
        >
          {selectedCertificate && (
            <div className="p-6 text-center bg-linear-to-br from-yellow-50 to-orange-50 rounded-lg">
              <div className="w-24 h-24 mx-auto rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Certificate of Completion
              </h2>
              <p className="text-gray-600 mb-4">This certifies that</p>
              <p className="text-xl font-semibold text-gray-900 mb-4">
                {selectedCertificate.studentName}
              </p>
              <p className="text-gray-600 mb-2">has successfully completed</p>
              <p className="text-lg font-bold text-gray-900 mb-6">
                {selectedCertificate.courseName}
              </p>
              {selectedCertificate.certificateCode && (
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-1">Certificate ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {selectedCertificate.certificateCode}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default Certificates;
