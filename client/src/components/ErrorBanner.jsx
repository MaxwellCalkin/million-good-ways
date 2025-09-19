import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const ErrorBanner = ({ message, onRetry }) => (
  <div className="error-banner surface-soft" role="alert">
    <ExclamationTriangleIcon width={18} height={18} />
    <span>{message}</span>
    {onRetry ? (
      <button type="button" className="secondary" onClick={onRetry}>
        Try again
      </button>
    ) : null}
  </div>
);

ErrorBanner.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

export default ErrorBanner;
