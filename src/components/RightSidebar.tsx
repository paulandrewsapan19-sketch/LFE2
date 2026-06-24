import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface LocationCount {
    location: string;
    count: number;
}

interface Trip {
    _id: string;
    title: string;
    spot_id?: {
        _id: string;
        name: string;
        photo_url: string;
    };
}

function RightSidebar() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [locations, setLocations] = useState<LocationCount[]>([]);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [tripsLoading, setTripsLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchLocations = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/spots?limit=100', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const counts: Record<string, number> = {};
                for (const spot of res.data.data) {
                    counts[spot.location] = (counts[spot.location] || 0) + 1;
                }
                const sorted = Object.entries(counts)
                    .map(([location, count]) => ({ location, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6);
                setLocations(sorted);
            } catch {} finally {
                setLocationsLoading(false);
            }
        };

        const fetchTrips = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/trips?limit=3', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(res.data.data);
            } catch {} finally {
                setTripsLoading(false);
            }
        };

        fetchLocations();
        fetchTrips();
    }, [token]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card sidebar-panel">
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Popular Locations</h3>
                {locationsLoading ? (
                    <div className="skeleton-line" />
                ) : locations.length === 0 ? (
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        No locations yet.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {locations.map((loc) => (
                            <button
                                key={loc.location}
                                onClick={() => navigate(`/spots?location=${encodeURIComponent(loc.location)}`)}
                                className="location-chip"
                            >
                                {loc.location} &middot; {loc.count}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="card sidebar-panel">
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Recent Trips</h3>
                {tripsLoading ? (
                    <div className="skeleton-line" />
                ) : trips.length === 0 ? (
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        No trips yet. Plan your first adventure!
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {trips.map((trip) => (
                            <Link key={trip._id} to={`/trips/${trip._id}`} className="sidebar-trip-item">
                                {trip.spot_id?.photo_url && (
                                    <img
                                        src={trip.spot_id.photo_url}
                                        alt={trip.spot_id.name}
                                        className="sidebar-trip-thumb"
                                    />
                                )}
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{trip.title}</p>
                                    {trip.spot_id && (
                                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
                                            {trip.spot_id.name}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RightSidebar;
