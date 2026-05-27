import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <main>
            <section className="page-header error-page">
                <h1>404 - Page Not Found</h1>
                <p>Looks like this destination does not exist on our map.</p>
                <Link to="/" className="btn-primary">Back to Home</Link>
            </section>
        </main>
    );
}

export default NotFound;