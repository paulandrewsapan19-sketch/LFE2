// TypeScript interface defines the shape of props
interface NavProps {
    currentPage: string;
}

function Nav({ currentPage }: NavProps) {
    return (
        <nav>
            <a href="/" className={currentPage === 'home' ? 'active' : ''}>Home</a>
            <a href="/spots" className={currentPage === 'spots' ? 'active' : ''}>Spots</a>
            <a href="/trips" className={currentPage === 'trips' ? 'active' : ''}>Trips</a>
        </nav>
    );
}

export default Nav;