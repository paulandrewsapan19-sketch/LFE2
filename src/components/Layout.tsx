import { Outlet, NavLink } from 'react-router-dom';

function Layout() {
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