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
}

function Trips() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const { token } = useAuth();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/trips', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTrips(response.data.data);
            } catch (err: any) {
                setError('Failed to load trips. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [token]);

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
                    <button
                        className={filter === 'all' ? 'btn-primary' : 'btn-outline'}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={filter === 'public' ? 'btn-primary' : 'btn-outline'}
                        onClick={() => setFilter('public')}
                    >
                        Public
                    </button>
                    <button
                        className={filter === 'private' ? 'btn-primary' : 'btn-outline'}
                        onClick={() => setFilter('private')}
                    >
                        Private
                    </button>
                </div>
            </section>

            {/* Loading state */}
            {loading && <p style={{ textAlign: 'center' }}>Loading trips...</p>}

            {/* Error state */}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            <section className="trips-list">
                {!loading && filteredTrips.length === 0 ? (
                    <p>No trips found.</p>
                ) : (
                    filteredTrips.map((trip) => (
                        <div key={trip._id} className="card trip-card">
                            <h2>{trip.title}</h2>
                            <p className="trip-meta">
                                {trip.spot_id && `Spot: ${trip.spot_id.name} | `}
                                {trip.is_public ? 'Public' : 'Private'}
                                {trip.start_date && ` | ${trip.start_date}`}
                                {trip.end_date && ` → ${trip.end_date}`}
                            </p>
                            <p>{trip.description}</p>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}

export default Trips;