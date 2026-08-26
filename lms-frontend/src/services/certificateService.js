import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Get all certificates for a student
export const getMyCertificates = async () => {
  const response = await api.get(API_ENDPOINTS.CERTIFICATES);
  return response.data;
};

// Get all badges for a student
export const getMyBadges = async () => {
  const response = await api.get('/api/badges/my');
  return response.data;
};

// Get certificate by ID
export const getCertificateById = async (certificateId) => {
  const response = await api.get(API_ENDPOINTS.CERTIFICATE_BY_ID(certificateId));
  return response.data;
};

// Generate certificate after course completion
export const generateCertificate = async (courseId) => {
  const response = await api.post(API_ENDPOINTS.GENERATE_CERTIFICATE(courseId));
  return response.data;
};

// Download certificate as PDF
export const downloadCertificate = async (certificateId) => {
  const response = await api.get(API_ENDPOINTS.DOWNLOAD_CERTIFICATE(certificateId), {
    responseType: 'blob',
  });
  
  // Create blob link to download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `certificate-${certificateId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  
  return true;
};

// Verify certificate authenticity
export const verifyCertificate = async (certificateCode) => {
  const response = await api.get(API_ENDPOINTS.VERIFY_CERTIFICATE(certificateCode));
  return response.data;
};
