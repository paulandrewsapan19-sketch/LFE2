import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Spot {
    _id: string;
    name: string;
    location: string;
}

interface Trip {
    _id: string;
    title: string;
    description: string;
    is_public: boolean;
    start_date?: string;
    end_date?: string;
    spot_id?: Spot;
    user_id?: string;
}

function Trips() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [spots, setSpots] = useState<Spot[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // Create form state
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formTitle, setFormTitle] = useState<string>('');
    const [formDescription, setFormDescription] = useState<string>('');
    const [formSpotId, setFormSpotId] = useState<string>('');
    const [formIsPublic, setFormIsPublic] = useState<boolean>(true);
    const [formStartDate, setFormStartDate] = useState<string>('');
    const [formEndDate, setFormEndDate] = useState<string>('');
    const [formError, setFormError] = useState<string>('');
    const [formLoading, setFormLoading] = useState<boolean>(false);

    // Edit form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');
    const [editIsPublic, setEditIsPublic] = useState<boolean>(true);
    const [editError, setEditError] = useState<string>('');
    const [editLoading, setEditLoading] = useState<boolean>(false);

    const { token } = useAuth();

    const fetchTrips = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/trips', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrips(response.data.data);
        } catch (err: any) {
            setError('Failed to load trips. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch spots so the create form can link a trip to a spot
    const fetchSpots = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/spots', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSpots(response.data.data);
        } catch (err: any) {
            // silently fail - spots dropdown will just be empty
        }
    };

    useEffect(() => {
        fetchTrips();
        fetchSpots();
    }, [token]);

    // Handle create trip
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            await axios.post('http://localhost:3000/api/trips', {
                title: formTitle,
                description: formDescription,
                spot_id: formSpotId,
                is_public: formIsPublic,
                start_date: formStartDate || undefined,
                end_date: formEndDate || undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFormTitle('');
            setFormDescription('');
            setFormSpotId('');
            setFormIsPublic(true);
            setFormStartDate('');
            setFormEndDate('');
            setShowForm(false);
            fetchTrips();
        } catch (err: any) {
            setFormError(err.response?.data?.error || 'Failed to create trip.');
        } finally {
            setFormLoading(false);
        }
    };

    // Handle delete trip
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this trip?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/trips/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrips(trips.filter((trip) => trip._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete trip.');
        }
    };

    const startEdit = (trip: Trip) => {
        setEditingId(trip._id);
        setEditTitle(trip.title);
        setEditDescription(trip.description);
        setEditIsPublic(trip.is_public);
        setEditError('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditError('');
    };

    // Handle update trip
    const handleUpdate = async (e: React.FormEvent, trip: Trip) => {
        e.preventDefault();
        setEditError('');
        setEditLoading(true);

        try {
            const response = await axios.put(`http://localhost:3000/api/trips/${trip._id}`, {
                title: editTitle,
                description: editDescription,
                spot_id: trip.spot_id?._id,
                is_public: editIsPublic
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTrips(trips.map((t) => (t._id === trip._id ? response.data : t)));
            setEditingId(null);
        } catch (err: any) {
            setEditError(err.response?.data?.error || 'Failed to update trip. You may not be the owner.');
        } finally {
            setEditLoading(false);
        }
    };

    const filteredTrips = trips.filter((trip) => {
        if (filter === 'public') return trip.is_public;
        if (filter === 'private') return !trip.is_public;
        return true;
    });

    return (
        <main>
            <section className="page-header">
                <h1>Browse Trips</h1>
                <p>Explore curated collections of spots organized into unforgettable trips.</p>

                <div className="filter-buttons">
                    <button className={filter === 'all' ? 'btn-primary' : 'btn-outline'} onClick={() => setFilter('all')}>All</button>
                    <button className={filter === 'public' ? 'btn-primary' : 'btn-outline'} onClick={() => setFilter('public')}>Public</button>
                    <button className={filter === 'private' ? 'btn-primary' : 'btn-outline'} onClick={() => setFilter('private')}>Private</button>
                </div>
            </section>

            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Trip'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2>Add a New Trip</h2>
                    {formError && <div className="auth-error">{formError}</div>}
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Trip title" required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Describe this trip" required />
                        </div>
                        <div className="form-group">
                            <label>Spot</label>
                            <select value={formSpotId} onChange={(e) => setFormSpotId(e.target.value)} required className="search-input" style={{ margin: 0 }}>
                                <option value="">Select a spot</option>
                                {spots.map((spot) => (
                                    <option key={spot._id} value={spot._id}>{spot.name} — {spot.location}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" checked={formIsPublic} onChange={(e) => setFormIsPublic(e.target.checked)} style={{ width: 'auto' }} />
                            <label style={{ margin: 0 }}>Public trip</label>
                        </div>
                        <button type="submit" className="btn-primary" disabled={formLoading}>
                            {formLoading ? 'Adding...' : 'Add Trip'}
                        </button>
                    </form>
                </div>
            )}

            {loading && <p style={{ textAlign: 'center' }}>Loading trips...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            <section className="trips-list">
                {!loading && filteredTrips.length === 0 ? (
                    <p>No trips found.</p>
                ) : (
                    filteredTrips.map((trip) => (
                        <div key={trip._id} className="card trip-card">
                            {editingId === trip._id ? (
                                <form onSubmit={(e) => handleUpdate(e, trip)}>
                                    {editError && <div className="auth-error">{editError}</div>}
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
                                        <button type="button" className="btn-outline" onClick={cancelEdit}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h2>{trip.title}</h2>
                                    <p className="trip-meta">
                                        {trip.spot_id && `Spot: ${trip.spot_id.name} | `}
                                        {trip.is_public ? 'Public' : 'Private'}
                                        {trip.start_date && ` | ${trip.start_date.split('T')[0]}`}
                                        {trip.end_date && ` → ${trip.end_date.split('T')[0]}`}
                                    </p>
                                    <p>{trip.description}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                        <button onClick={() => startEdit(trip)} className="btn-outline">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(trip._id)} className="delete-btn">
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}

export default Trips;