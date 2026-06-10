import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Spot {
    _id: string;
    name: string;
    location: string;
    description: string;
    photo_url?: string;
    user_id?: string;
}

function Spots() {
    const [spots, setSpots] = useState<Spot[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // Form state
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formName, setFormName] = useState<string>('');
    const [formLocation, setFormLocation] = useState<string>('');
    const [formDescription, setFormDescription] = useState<string>('');
    const [formError, setFormError] = useState<string>('');
    const [formLoading, setFormLoading] = useState<boolean>(false);

    const { token } = useAuth();

    const fetchSpots = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/spots', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSpots(response.data.data);
        } catch (err: any) {
            setError('Failed to load spots. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpots();
    }, [token]);

    // Handle create spot
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            await axios.post('http://localhost:3000/api/spots', {
                name: formName,
                location: formLocation,
                description: formDescription
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Reset form and refresh spots
            setFormName('');
            setFormLocation('');
            setFormDescription('');
            setShowForm(false);
            fetchSpots();
        } catch (err: any) {
            setFormError(err.response?.data?.error || 'Failed to create spot.');
        } finally {
            setFormLoading(false);
        }
    };

    // Handle delete spot
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this spot?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/spots/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove deleted spot from state
            setSpots(spots.filter((spot) => spot._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete spot.');
        }
    };

    const filteredSpots = spots.filter((spot) =>
        spot.name.toLowerCase().includes(search.toLowerCase()) ||
        spot.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main>
            <section className="page-header">
                <h1>Explore Spots</h1>
                <p>Browse locations discovered and shared by travelers around the world.</p>
                <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </section>

            {/* Add Spot Button */}
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Add Spot'}
                </button>
            </div>

            {/* Create Spot Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2>Add a New Spot</h2>
                    {formError && <div className="auth-error">{formError}</div>}
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Spot name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={formLocation}
                                onChange={(e) => setFormLocation(e.target.value)}
                                placeholder="City, Country"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input
                                type="text"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                placeholder="Describe this spot"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={formLoading}>
                            {formLoading ? 'Adding...' : 'Add Spot'}
                        </button>
                    </form>
                </div>
            )}

            {/* Loading and error states */}
            {loading && <p style={{ textAlign: 'center' }}>Loading spots...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            <section className="spots-grid">
                {!loading && filteredSpots.length === 0 ? (
                    <p>No spots found.</p>
                ) : (
                    filteredSpots.map((spot) => (
                        <div key={spot._id} className="card spot-card">
                            <h2>{spot.name}</h2>
                            <p className="spot-location">{spot.location}</p>
                            <p>{spot.description}</p>
                            {spot.photo_url && (
                                <img src={spot.photo_url} alt={spot.name} />
                            )}
                            {/* Delete button */}
                            <button
                                onClick={() => handleDelete(spot._id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}

export default Spots;