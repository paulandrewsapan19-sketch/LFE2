import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
    const { isLoggedIn, logout, userName } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <header>
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo">Roamr</div>
                        <p className="tagline">Discover. Share. Explore.</p>
                    </div>
                    {isLoggedIn && (
                        <div className="header-user">
                            <span className="header-username">👤 {userName || 'Roamr User'}</span>
                            <button onClick={handleLogout} className="header-logout-btn">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <nav>
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                    Home
                </NavLink>
                <NavLink to="/spots" className={({ isActive }) => isActive ? 'active' : ''}>
                    Spots
                </NavLink>
                <NavLink to="/trips" className={({ isActive }) => isActive ? 'active' : ''}>
                    Trips
                </NavLink>
            </nav>

            <Outlet />

            <footer>
                <p>&copy; 2025 Roamr. All rights reserved.</p>
                <p>Made for travelers everywhere.</p>
            </footer>
        </>
    );
}

export default Layout;