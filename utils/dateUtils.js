// utils/dateUtils.js

/**
 * Format date for datetime-local input
 */
export const formatDateForInput = (date = new Date()) => {
    return new Date(date).toISOString().slice(0, 16);
};

/**
 * Format date for display
 */
export const formatDateForDisplay = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format date for display (short version)
 */
export const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
        return 'Just now';
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
        return formatDateShort(date);
    }
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
};

/**
 * Check if date is this week
 */
export const isThisWeek = (date) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const checkDate = new Date(date);
    return checkDate >= weekAgo && checkDate <= now;
};