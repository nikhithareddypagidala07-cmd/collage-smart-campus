// Utility helper functions for Smart Campus Issue Resolution System

export const generateTrackingId = () => {
  const prefix = 'CMP';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomNum}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatShortDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return formatShortDate(dateString);
};

export const isOverdue = (complaint) => {
  if (complaint.status === 'Resolved' || complaint.status === 'Rejected') {
    return false;
  }
  if (!complaint.targetResolutionDate) return false;
  const target = new Date(complaint.targetResolutionDate);
  const now = new Date();
  return now > target;
};

// Privacy Data Masking Helpers
export const maskPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  const clean = String(phone).trim();
  // e.g. "+91 98761 00001" -> "+91 98761 *****"
  if (clean.length > 5) {
    const visiblePrefix = clean.slice(0, clean.length - 5);
    return `${visiblePrefix}*****`;
  }
  return '*****';
};

export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return 'N/A';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user}***@${domain}`;
  const visible = user.slice(0, 2);
  return `${visible}****@${domain}`;
};
