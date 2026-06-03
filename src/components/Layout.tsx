import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ AuthContext';

function Layout() {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <header>
                <div className="logo">Roamr</div>
                <p className="tagline">Discover. Share. Explore.</p>
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

                {/* Conditional rendering based on login state */}
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="nav-btn">
                        Logout
                    </button>
                ) : (
                    <>
                        <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
                            Login
                        </NavLink>
                        <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>
                            Register
                        </NavLink>
                    </>
                )}
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