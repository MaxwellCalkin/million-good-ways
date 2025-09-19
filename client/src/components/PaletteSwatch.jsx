import PropTypes from 'prop-types';

const PaletteSwatch = ({ colors }) => {
  if (!colors?.length) return null;

  return (
    <div className="palette-swatch" aria-label="Color palette for this artwork">
      {colors.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className="palette-color"
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
};

PaletteSwatch.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
};

export default PaletteSwatch;
