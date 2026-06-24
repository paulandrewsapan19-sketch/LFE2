import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import RightSidebar from '../components/RightSidebar';

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
    const [searchParams, setSearchParams] = useSearchParams();
    const locationFilter = searchParams.get('location') || '';

    // Create form state
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formName, setFormName] = useState<string>('');
    const [formLocation, setFormLocation] = useState<string>('');
    const [formDescription, setFormDescription] = useState<string>('');
    const [formPhotoUrl, setFormPhotoUrl] = useState<string>('');
    const [formError, setFormError] = useState<string>('');
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const [imageError, setImageError] = useState<boolean>(false);

    const { token } = useAuth();

    const updateLocationFilter = (tag: string) => {
        if (tag) {
            setSearchParams({ location: tag });
        } else {
            setSearchParams({});
        }
    };

    const fetchSpots = async () => {
        try {
            const params: Record<string, string> = {};
            if (locationFilter) {
                params.location = locationFilter;
            }
            const response = await axios.get('http://localhost:3000/api/spots', {
                params,
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
    }, [token, locationFilter]);

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
            setImageError(false);
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
                                onChange={(e) => { setFormPhotoUrl(e.target.value); setImageError(false); }}
                                placeholder="https://example.com/photo.jpg"
                                required
                            />
                        </div>
                        {formPhotoUrl && !imageError && (
                            <img src={formPhotoUrl} alt="Preview" className="preview-image" onError={() => setImageError(true)} />
                        )}
                        {formPhotoUrl && imageError && (
                            <p className="image-error">Image failed to load</p>
                        )}
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Spot name" required />
                        </div>
                        <div className="form-group">
                            <label>Location Tag</label>
                            <input type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="e.g. Lanikai Beach, Hawaii" required />
                            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                Use a consistent name so others can tag the same place.
                            </span>
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

            <div className="three-column-layout">
                <aside className="sidebar-left">
                    <ProfileCard />
                </aside>

                <div className="main-content">
                    {loading && <p style={{ textAlign: 'center' }}>Loading feed...</p>}
                    {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

                    {locationFilter && (
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                Filtered by: <strong style={{ color: 'var(--color-primary)' }}>{locationFilter}</strong>
                            </span>
                            {' '}
                            <button onClick={() => updateLocationFilter('')} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                                Clear
                            </button>
                        </div>
                    )}

                    {/* Grid feed */}
                    <div className="spots-feed-grid">
                        {!loading && spots.length === 0 ? (
                            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No spots yet. Be the first to share one!</p>
                        ) : (
                            spots.map((spot) => (
                                <div key={spot._id} className="spots-feed-grid-item" style={{ position: 'relative' }}>
                                    <Link to={`/spots/${spot._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                                        <img src={spot.photo_url} alt={spot.name} />
                                        <div className="spot-overlay">
                                            <p>{spot.name}</p>
                                            <p className="spot-overlay-location">{spot.location}</p>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateLocationFilter(spot.location); }}
                                        className="location-tag-btn"
                                    >
                                        {spot.location}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <aside className="sidebar-right">
                    <RightSidebar />
                </aside>
            </div>
        </main>
    );
}

export default Spots;