import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

function Spots() {
    const [spots, setSpots] = useState<Spot[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // Create form state
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formName, setFormName] = useState<string>('');
    const [formLocation, setFormLocation] = useState<string>('');
    const [formDescription, setFormDescription] = useState<string>('');
    const [formPhotoUrl, setFormPhotoUrl] = useState<string>('');
    const [formError, setFormError] = useState<string>('');
    const [formLoading, setFormLoading] = useState<boolean>(false);

    const { token } = useAuth();

    const fetchSpots = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/spots', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Newest first - Instagram style feed
            const sorted = response.data.data.sort((a: Spot, b: Spot) =>
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
            setSpots(sorted);
        } catch (err: any) {
            setError('Failed to load spots. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpots();
    }, [token]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            await axios.post('http://localhost:3000/api/spots', {
                name: formName,
                location: formLocation,
                description: formDescription,
                photo_url: formPhotoUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFormName('');
            setFormLocation('');
            setFormDescription('');
            setFormPhotoUrl('');
            setShowForm(false);
            fetchSpots();
        } catch (err: any) {
            setFormError(err.response?.data?.error || 'Failed to create spot.');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <main>
            <section className="page-header">
                <h1>Spots Feed</h1>
                <p>See where fellow travelers have been.</p>
            </section>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Share a Spot'}
                </button>
            </div>

            {showForm && (
                <div className="card create-card">
                    <h2>Share a New Spot</h2>
                    {formError && <div className="auth-error">{formError}</div>}
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="url"
                                value={formPhotoUrl}
                                onChange={(e) => setFormPhotoUrl(e.target.value)}
                                placeholder="https://example.com/photo.jpg"
                                required
                            />
                        </div>
                        {formPhotoUrl && (
                            <img src={formPhotoUrl} alt="Preview" className="preview-image" />
                        )}
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Spot name" required />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="City, Country" required />
                        </div>
                        <div className="form-group">
                            <label>Caption</label>
                            <input type="text" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Write a caption..." required />
                        </div>
                        <button type="submit" className="btn-primary" disabled={formLoading}>
                            {formLoading ? 'Posting...' : 'Post Spot'}
                        </button>
                    </form>
                </div>
            )}

            {loading && <p style={{ textAlign: 'center' }}>Loading feed...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            {/* Grid feed */}
            <div className="spots-feed-grid">
                {!loading && spots.length === 0 ? (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No spots yet. Be the first to share one!</p>
                ) : (
                    spots.map((spot) => (
                        <Link key={spot._id} to={`/spots/${spot._id}`} className="spots-feed-grid-item">
                            <img src={spot.photo_url} alt={spot.name} />
                            <div className="spot-overlay">
                                <p>{spot.name}</p>
                                <p className="spot-overlay-location">{spot.location}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </main>
    );
}

export default Spots;