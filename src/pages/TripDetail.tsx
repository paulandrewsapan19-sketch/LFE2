import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface SpotData {
    _id: string;
    name: string;
    location: string;
    description: string;
    photo_url: string;
}

interface Trip {
    _id: string;
    title: string;
    description: string;
    is_public: boolean;
    start_date?: string;
    end_date?: string;
    spot_id?: SpotData;
    user_id?: string;
}

function TripDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editTitle, setEditTitle] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');
    const [editIsPublic, setEditIsPublic] = useState<boolean>(true);
    const [editError, setEditError] = useState<string>('');
    const [editLoading, setEditLoading] = useState<boolean>(false);

    const { token } = useAuth();

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/trips/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrip(response.data);
            } catch (err: any) {
                setError('Trip not found.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();

        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUserId(res.data._id);
            } catch {}
        };
        if (token) fetchUser();
    }, [id, token]);

    const isOwner = trip ? trip.user_id === currentUserId : false;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this trip?')) return;
        try {
            await axios.delete(`http://localhost:3000/api/trips/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/trips');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete trip.');
        }
    };

    const startEdit = () => {
        if (!trip) return;
        setEditTitle(trip.title);
        setEditDescription(trip.description);
        setEditIsPublic(trip.is_public);
        setEditError('');
        setEditMode(true);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError('');
        setEditLoading(true);
        try {
            await axios.put(`http://localhost:3000/api/trips/${id}`, {
                title: editTitle,
                description: editDescription,
                is_public: editIsPublic,
                spot_id: trip?.spot_id?._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const refreshed = await axios.get(`http://localhost:3000/api/trips/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrip(refreshed.data);
            setEditMode(false);
        } catch (err: any) {
            setEditError(err.response?.data?.error || 'Failed to update trip.');
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) {
        return <main><p style={{ textAlign: 'center' }}>Loading trip...</p></main>;
    }

    if (error || !trip) {
        return (
            <main>
                <section className="page-header error-page">
                    <h1>Trip Not Found</h1>
                    <p>{error || 'This trip does not exist.'}</p>
                    <Link to="/trips" className="btn-primary">Back to Trips</Link>
                </section>
            </main>
        );
    }

    return (
        <main>
            <div style={{ marginBottom: '1.5rem' }}>
                <Link to="/trips" className="trip-link">&larr; Back to Trips</Link>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {editMode ? (
                    <div>
                        <h2>Edit Trip</h2>
                        {editError && <div className="auth-error">{editError}</div>}
                        <form onSubmit={handleEdit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />
                            </div>
                            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" checked={editIsPublic} onChange={(e) => setEditIsPublic(e.target.checked)} style={{ width: 'auto' }} />
                                <label style={{ margin: 0 }}>Public trip</label>
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
                        <h2>{trip.title}</h2>
                        <p className="trip-meta">
                            <span className="badge">{trip.is_public ? 'Public' : 'Private'}</span>
                            {trip.start_date && ` ${trip.start_date.split('T')[0]}`}
                            {trip.end_date && ` → ${trip.end_date.split('T')[0]}`}
                        </p>
                        <p>{trip.description}</p>

                        {isOwner && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                <button className="btn-outline" onClick={startEdit}>Edit</button>
                                <button className="delete-btn" onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {trip.spot_id && (
                <div style={{ maxWidth: '600px', margin: '2rem auto 0' }}>
                    <h3 className="section-title">Linked Spot</h3>
                    <Link to={`/spots/${trip.spot_id._id}`} className="trip-spot-card">
                        <img src={trip.spot_id.photo_url} alt={trip.spot_id.name} className="trip-spot-image" />
                        <div className="trip-spot-info">
                            <h3>{trip.spot_id.name}</h3>
                            <p className="featured-location">{trip.spot_id.location}</p>
                            <p>{trip.spot_id.description}</p>
                        </div>
                    </Link>
                </div>
            )}
        </main>
    );
}

export default TripDetail;
