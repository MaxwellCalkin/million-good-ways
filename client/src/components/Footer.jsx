import { Link } from 'react-router-dom';
import { RocketIcon } from '@radix-ui/react-icons';

const Footer = () => (
  <footer className="app-footer">
    <div className="footer-inner">
      <div className="footer-blurb">
        <RocketIcon width={18} height={18} />
        <span>
          Crafted to help humanity rehearse flourishing futures with benevolent super intelligence.
        </span>
      </div>
      <div className="footer-links">
        <Link to="/">Aurora Feed</Link>
        <Link to="/create">Share Vision</Link>
        <a href="https://www.lesswrong.com/tag/artificial-general-intelligence" target="_blank" rel="noreferrer">
          Learn about AGI safety
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
