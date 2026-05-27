import { useState } from 'react';

interface Trip {
    id: number;
    title: string;
    description: string;
    spotName: string;
    isPublic: boolean;
    startDate: string;
    endDate: string;
}

const allTrips: Trip[] = [
    { id: 1, title: 'Hawaiian Island Hopping', description: 'A week across Oahu, Maui and the Big Island hitting the best beaches and hikes.', spotName: 'Lanikai Beach', isPublic: true, startDate: '2025-06-01', endDate: '2025-06-07' },
    { id: 2, title: 'Best of Central Europe', description: 'From Vienna to Prague, covering the most charming towns and hidden cafes.', spotName: 'Hallstatt Village', isPublic: true, startDate: '2025-07-10', endDate: '2025-07-20' },
    { id: 3, title: 'American Southwest Road Trip', description: 'Drive through Utah and Arizona hitting slot canyons and national parks.', spotName: 'Antelope Canyon', isPublic: false, startDate: '2025-08-01', endDate: '2025-08-10' },
    { id: 4, title: 'Southeast Asia Backpacker Route', description: 'A budget-friendly two weeks through Vietnam, Cambodia and Thailand.', spotName: 'Ha Long Bay', isPublic: true, startDate: '2025-09-01', endDate: '2025-09-14' },
];

function Trips() {
    const [filter, setFilter] = useState<string>('all');

    const filteredTrips = allTrips.filter((trip) => {
        if (filter === 'public') return trip.isPublic;
        if (filter === 'private') return !trip.isPublic;
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

            <section className="trips-list">
                {filteredTrips.length === 0 ? (
                    <p>No trips found.</p>
                ) : (
                    filteredTrips.map((trip) => (
                        <div key={trip.id} className="card trip-card">
                            <h2>{trip.title}</h2>
                            <p className="trip-meta">
                                Spot: {trip.spotName} | {trip.isPublic ? 'Public' : 'Private'} | {trip.startDate} → {trip.endDate}
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