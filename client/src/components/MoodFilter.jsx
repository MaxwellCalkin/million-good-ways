import PropTypes from 'prop-types';
import clsx from 'clsx';

const moods = ['All', 'Uplifting', 'Dreamy', 'Celebratory', 'Curious', 'Serene'];

const MoodFilter = ({ value, onChange }) => (
  <div className="mood-filter" role="group" aria-label="Filter by mood">
    {moods.map((mood) => {
      const normalized = mood === 'All' ? '' : mood;
      const isActive = value === normalized;
      return (
        <button
          key={mood}
          type="button"
          className={clsx('mood-chip-filter', isActive && 'active')}
          onClick={() => onChange(normalized)}
        >
          {mood}
        </button>
      );
    })}
  </div>
);

MoodFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MoodFilter;
