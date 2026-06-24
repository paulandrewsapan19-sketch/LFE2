import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

interface RelatedTrip {
    _id: string;
    title: string;
    description: string;
}

function SpotDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [spot, setSpot] = useState<Spot | null>(null);
    const [locationPosts, setLocationPosts] = useState<Spot[]>([]);
    const [locationPostsLoading, setLocationPostsLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>('');
    const [editLocation, setEditLocation] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');
    const [editPhotoUrl, setEditPhotoUrl] = useState<string>('');
    const [editError, setEditError] = useState<string>('');
    const [editLoading, setEditLoading] = useState<boolean>(false);
    const [relatedTrips, setRelatedTrips] = useState<RelatedTrip[]>([]);
    const [tripsLoading, setTripsLoading] = useState<boolean>(true);

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

        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUserId(res.data._id);
            } catch {}
        };
        if (token) fetchUser();

        const fetchRelatedTrips = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/trips/spot/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRelatedTrips(res.data);
            } catch {} finally {
                setTripsLoading(false);
            }
        };
        fetchRelatedTrips();
    }, [id, token]);

    useEffect(() => {
        if (!spot?.location) return;
        const fetchLocationPosts = async () => {
            setLocationPostsLoading(true);
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/spots/tag/${encodeURIComponent(spot.location)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLocationPosts(res.data.filter((s: Spot) => s._id !== id));
            } catch {} finally {
                setLocationPostsLoading(false);
            }
        };
        fetchLocationPosts();
    }, [spot?.location, id, token]);

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

    const getOwnerId = (s: Spot) => {
        return typeof s.user_id === 'object' && s.user_id !== null
            ? s.user_id._id
            : s.user_id;
    };

    const isOwner = spot ? getOwnerId(spot) === currentUserId : false;

    const startEdit = () => {
        if (!spot) return;
        setEditName(spot.name);
        setEditLocation(spot.location);
        setEditDescription(spot.description);
        setEditPhotoUrl(spot.photo_url);
        setEditError('');
        setEditMode(true);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError('');
        setEditLoading(true);
        try {
            const response = await axios.put(`http://localhost:3000/api/spots/${id}`, {
                name: editName,
                location: editLocation,
                description: editDescription,
                photo_url: editPhotoUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSpot(response.data);
            setEditMode(false);
        } catch (err: any) {
            setEditError(err.response?.data?.error || 'Failed to update spot.');
        } finally {
            setEditLoading(false);
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
            <div className="three-column-layout">
                <aside className="sidebar-left">
                    <ProfileCard />
                </aside>

                <div className="main-content">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link to="/spots" className="trip-link">&larr; Back to Feed</Link>
                    </div>

                    <div className="post">
                        <div className="post-header">
                            <div className="avatar">{getAuthorName(spot).charAt(0).toUpperCase()}</div>
                            <div>
                                <p className="username">{getAuthorName(spot)}</p>
                                <p className="location-text">{spot.location}</p>
                            </div>
                        </div>

                        <img src={spot.photo_url} alt={spot.name} className="post-image" />

                        <div className="post-body">
                            {editMode ? (
                                <div>
                                    {editError && <div className="auth-error">{editError}</div>}
                                    <form onSubmit={handleEdit}>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Location</label>
                                            <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Caption</label>
                                            <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Image URL</label>
                                            <input type="url" value={editPhotoUrl} onChange={(e) => setEditPhotoUrl(e.target.value)} required />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button type="submit" className="btn-primary" disabled={editLoading}>
                                                {editLoading ? 'Saving...' : 'Save'}
                                            </button>
                                            <button type="button" className="btn-outline" onClick={() => setEditMode(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <p><span className="username">{getAuthorName(spot)}</span> <strong>{spot.name}</strong></p>
                                    <p>{spot.description}</p>
                                    {spot.createdAt && (
                                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                            {new Date(spot.createdAt).toDateString()}
                                        </p>
                                    )}
                                    {isOwner && (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                            <button className="btn-outline" onClick={startEdit}>Edit</button>
                                            <button className="delete-btn" onClick={handleDelete}>Delete</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Trips featuring this spot</h3>
                        {tripsLoading ? (
                            <p style={{ textAlign: 'center' }}>Loading trips...</p>
                        ) : relatedTrips.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                No trips feature this spot yet. Be the first to add it to a trip!
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {relatedTrips.map((trip) => (
                                    <Link key={trip._id} to={`/trips/${trip._id}`} className="related-trip-card">
                                        <h3>{trip.title}</h3>
                                        <p>{trip.description}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Other posts from this location</h3>
                        {locationPostsLoading ? (
                            <p style={{ textAlign: 'center' }}>Loading...</p>
                        ) : locationPosts.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                No one else has posted from this location yet. Share the tag so others can contribute!
                            </p>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {locationPosts.map((lp) => {
                                    const authorName = typeof lp.user_id === 'object' && lp.user_id !== null
                                        ? (lp.user_id.username || lp.user_id.name)
                                        : 'roamr_user';
                                    return (
                                        <Link key={lp._id} to={`/spots/${lp._id}`} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0, width: '120px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div className="avatar" style={{ margin: '0 auto 0.4rem', width: '28px', height: '28px', fontSize: '0.75rem' }}>
                                                    {authorName.charAt(0).toUpperCase()}
                                                </div>
                                                <img
                                                    src={lp.photo_url}
                                                    alt={lp.name}
                                                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '0.4rem' }}
                                                />
                                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {lp.description}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
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

export default SpotDetail;