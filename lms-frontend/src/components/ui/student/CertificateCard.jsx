import { motion } from 'framer-motion';
import { Award, Download, Calendar, CheckCircle, ExternalLink } from 'lucide-react';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import Card from '../../common/Card';

const CertificateCard = ({ certificate, onDownload, onView }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-xl transition-shadow duration-300">
        <div className="p-6">
          {/* Header with Icon */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {certificate.courseTitle}
                </h3>
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </Badge>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Issued on {formatDate(certificate.issuedAt)}</span>
            </div>
            
            {certificate.id && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Certificate ID</p>
                <p className="font-mono text-sm font-semibold text-gray-900">
                  {certificate.id}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => onDownload(certificate)}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onView(certificate)}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CertificateCard;
