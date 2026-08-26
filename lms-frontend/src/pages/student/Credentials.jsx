import { useState, useEffect } from 'react';
import { Award, Search, Filter } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/ui/student/EmptyState';
import CertificateCard from '../../components/ui/student/CertificateCard';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { getMyCertificates, getMyBadges, downloadCertificate } from '../../services/certificateService';

const Credentials = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [badges, setBadges] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, certificates, badges
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch both simultaneously
      const [certData, badgeData] = await Promise.all([
        getMyCertificates().catch(() => []),
        getMyBadges().catch(() => [])
      ]);
      setCertificates(certData || []);
      setBadges(badgeData || []);
    } catch (err) {
      console.error('Error fetching credentials:', err);
      setError('Failed to load some credentials. Please try again later.');
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
  
  const filteredBadges = badges.filter(badge => 
    badge.badgeName?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              My Credentials
            </h1>
            <p className="text-gray-600">
              {certificates.length} Certificate{certificates.length !== 1 ? 's' : ''} &bull; {badges.length} Badge{badges.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'certificates' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Certificates
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'badges' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Badges
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {(certificates.length > 0 || badges.length > 0) && (
          <div className="mb-6">
            <Input
              icon={Search}
              placeholder="Search credentials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render Certificates */}
          {(activeTab === 'all' || activeTab === 'certificates') && filteredCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onDownload={handleDownload}
              onView={handleView}
            />
          ))}

          {/* Render Badges */}
          {(activeTab === 'all' || activeTab === 'badges') && filteredBadges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-4 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 border border-slate-100 shadow-inner">
                <img src={badge.imageUrl || "/images/certificate_stamp.jpg"} alt={badge.badgeName} className="w-full h-full object-contain" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-1">{badge.badgeName}</h3>
              <p className="text-sm text-slate-500 mb-4">{badge.badgeDescription}</p>
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                Earned: {new Date(badge.earnedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>

        {filteredCertificates.length === 0 && filteredBadges.length === 0 && (certificates.length > 0 || badges.length > 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No credentials match your search.</p>
          </div>
        )}
        
        {certificates.length === 0 && badges.length === 0 && (
          <EmptyState
            icon={Award}
            title="No Credentials Yet"
            message="Complete courses and learning paths to earn certificates and badges!"
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

export default Credentials;
