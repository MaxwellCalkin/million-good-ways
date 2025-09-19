import { formatDistanceToNowStrict, format } from 'date-fns';

export const formatRelativeTime = (value) => {
  if (!value) return 'just now';
  try {
    return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
  } catch {
    return 'recently';
  }
};

export const formatDateTime = (value) => {
  if (!value) return '';
  try {
    return format(new Date(value), 'PPP p');
  } catch {
    return value;
  }
};

export const splitTags = (tags = []) => {
  if (!tags || !tags.length) return [];
  return tags.filter(Boolean);
};
