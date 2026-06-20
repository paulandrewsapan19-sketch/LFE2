import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Spot {
    _id: string;
    name: string;
    location: string;
    description: string;
    photo_url: string;
    user_id?: { _id: string; name: string; username: string } | string;
    createdAt?: string;
}

function SpotDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [spot, setSpot] = useState<Spot | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const { token } = useAuth();

    useEffect(() => {
        const fetchSpot = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/spots/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSpot(response.data);
            } catch (err: any) {
                setError('Spot not found.');
            } finally {
                setLoading(false);
            }
        };

        fetchSpot();
    }, [id, token]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this spot?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/spots/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/spots');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete spot.');
        }
    };

    const getAuthorName = (s: Spot) => {
        if (typeof s.user_id === 'object' && s.user_id !== null) {
            return s.user_id.username || s.user_id.name;
        }
        return 'roamr_user';
    };

    if (loading) {
        return <main><p style={{ textAlign: 'center' }}>Loading spot...</p></main>;
    }

    if (error || !spot) {
        return (
            <main>
                <section className="page-header error-page">
                    <h1>Spot Not Found</h1>
                    <p>{error || 'This spot does not exist.'}</p>
                    <Link to="/spots" className="btn-primary">Back to Spots</Link>
                </section>
            </main>
        );
    }

    return (
        <main>
            <div style={{ marginBottom: '1.5rem', maxWidth: '470px', margin: '0 auto 1.5rem' }}>
                <Link to="/spots" className="trip-link">&larr; Back to Feed</Link>
            </div>

            <div className="insta-post" style={{ maxWidth: '470px', margin: '0 auto' }}>
                <div className="insta-post-header">
                    <div className="insta-avatar">{getAuthorName(spot).charAt(0).toUpperCase()}</div>
                    <div>
                        <p className="insta-username">{getAuthorName(spot)}</p>
                        <p className="insta-location">{spot.location}</p>
                    </div>
                </div>

                <img src={spot.photo_url} alt={spot.name} className="insta-post-image" />

                <div className="insta-post-body">
                    <p><span className="insta-username">{getAuthorName(spot)}</span> <strong>{spot.name}</strong></p>
                    <p>{spot.description}</p>
                    {spot.createdAt && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                            {new Date(spot.createdAt).toDateString()}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button onClick={handleDelete} className="delete-btn">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SpotDetail;