import { useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Pencil2Icon } from '@radix-ui/react-icons';
import logo from '../assets/logo.svg';

const navItems = [
  { to: '/', label: 'Aurora Feed' },
  { to: '/create', label: 'Compose Vision' },
];

const Header = () => {
  const location = useLocation();

  const isCreatePage = useMemo(() => location.pathname.startsWith('/create'), [location.pathname]);

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-logo">
            <img src={logo} alt="Million Good Ways logo" />
          </span>
          <span className="brand-text">
            <strong>Million Good Ways</strong>
            <small>Art for thriving super intelligence</small>
          </span>
        </Link>
        <nav className="header-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                ['nav-item', isActive ? 'nav-item-active' : ''].join(' ').trim()
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/create"
          className={`header-cta ${isCreatePage ? 'active' : ''}`}
          aria-label="Share a new ASI-positive artwork"
        >
          <Pencil2Icon width={18} height={18} />
          <span>Share a Vision</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
