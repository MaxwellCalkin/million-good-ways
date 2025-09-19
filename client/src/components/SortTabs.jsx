import PropTypes from 'prop-types';
import clsx from 'clsx';

const options = [
  { id: 'hot', label: 'Hot' },
  { id: 'top', label: 'Top' },
  { id: 'new', label: 'New' },
];

const SortTabs = ({ value, onChange }) => (
  <div className="sort-tabs" role="tablist" aria-label="Sort posts">
    {options.map((option) => (
      <button
        key={option.id}
        type="button"
        className={clsx('sort-tab', option.id === value && 'active')}
        onClick={() => onChange(option.id)}
        role="tab"
        aria-selected={option.id === value}
      >
        {option.label}
      </button>
    ))}
  </div>
);

SortTabs.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SortTabs;
