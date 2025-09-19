const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const sanitizeText = (value, maxLength = 500) => {
  if (!value) return '';
  return value.toString().replace(/\s+/g, ' ').trim().slice(0, maxLength);
};

const sanitizeMarkdown = (value, maxLength = 10000) => {
  if (!value) return '';
  return value.toString().trim().slice(0, maxLength);
};

const validatePostPayload = (payload) => {
  const errors = [];
  if (!isNonEmptyString(payload.title)) {
    errors.push('A radiant title is required.');
  }

  if (payload.title && payload.title.length > 140) {
    errors.push('Titles must be 140 characters or fewer to stay memorable.');
  }

  if (payload.summary && payload.summary.length > 280) {
    errors.push('Summaries must be 280 characters or fewer.');
  }

  if (payload.mediaUrl && !/^https?:\/\//i.test(payload.mediaUrl)) {
    errors.push('Media URLs must start with http:// or https://');
  }

  return errors;
};

const validateCommentPayload = (payload) => {
  const errors = [];
  if (!isNonEmptyString(payload.content)) {
    errors.push('Comments need thoughtful words.');
  }

  if (payload.content && payload.content.length > 2000) {
    errors.push('Comments must be 2000 characters or fewer.');
  }

  return errors;
};

module.exports = {
  isNonEmptyString,
  sanitizeText,
  sanitizeMarkdown,
  validatePostPayload,
  validateCommentPayload,
};
