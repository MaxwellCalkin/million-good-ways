import PropTypes from 'prop-types';
import { PlusIcon, Cross2Icon } from '@radix-ui/react-icons';

const ColorPaletteEditor = ({ palette, onChange }) => {
  const updateColor = (index, value) => {
    const next = [...palette];
    next[index] = value;
    onChange(next);
  };

  const addColor = () => {
    if (palette.length >= 6) return;
    onChange([...palette, '#ffffff']);
  };

  const removeColor = (index) => {
    if (palette.length <= 2) return;
    const next = palette.filter((_, idx) => idx !== index);
    onChange(next);
  };

  return (
    <div className="palette-editor">
      <div className="palette-editor-grid">
        {palette.map((color, index) => (
          <div key={`${color}-${index}`} className="palette-editor-item">
            <input
              type="color"
              value={color}
              aria-label={`Palette color ${index + 1}`}
              onChange={(event) => updateColor(index, event.target.value)}
            />
            <span>{color.toUpperCase()}</span>
            {palette.length > 2 && (
              <button
                type="button"
                className="remove-color"
                onClick={() => removeColor(index)}
                aria-label="Remove color"
              >
                <Cross2Icon width={14} height={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      {palette.length < 6 && (
        <button type="button" className="add-color" onClick={addColor}>
          <PlusIcon />
          Add colour
        </button>
      )}
    </div>
  );
};

ColorPaletteEditor.propTypes = {
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ColorPaletteEditor;
