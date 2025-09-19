const dayjs = require('dayjs');

const EPOCH = dayjs('2023-01-01T00:00:00Z');

const calculateHotScore = (createdAt, score) => {
  const baseScore = score || 0;
  const order = Math.log10(Math.max(Math.abs(baseScore), 1));
  const sign = baseScore > 0 ? 1 : baseScore < 0 ? -1 : 0;
  const seconds = dayjs(createdAt).diff(EPOCH, 'second');
  return Number((sign * order + seconds / 45000).toFixed(7));
};

module.exports = { calculateHotScore };
