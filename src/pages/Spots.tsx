import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Spot {
    _id: string;
    name: string;
    location: string;
    description: string;
    photo_url?: string;
}

function Spots() {
    const [spots, setSpots] = useState<Spot[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const { token } = useAuth();

    useEffect(() => {
        const fetchSpots = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/spots', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSpots(response.data.data);
            } catch (err: any) {
                setError('Failed to load spots. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchSpots();
    }, [token]);

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

            {/* Loading state */}
            {loading && <p style={{ textAlign: 'center' }}>Loading spots...</p>}

            {/* Error state */}
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
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}

export default Spots;