import PropTypes from 'prop-types';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="search-bar">
    <MagnifyingGlassIcon width={18} height={18} />
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder || 'Search shimmering futures'}
      aria-label="Search visions"
    />
  </div>
);

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
