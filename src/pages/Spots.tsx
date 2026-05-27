import { useState } from 'react';
import { Spot } from '../types';

const allSpots: Spot[] = [
    { id: 1, name: 'Lanikai Beach', location: 'Kailua, Hawaii, USA', badge: 'Trending', description: 'A stunning stretch of white sand with calm turquoise waters, perfect for kayaking and sunrise views.' },
    { id: 2, name: 'Hallstatt Village', location: 'Salzkammergut, Austria', badge: 'Top Rated', description: 'A picturesque lakeside village nestled between mountains with charming alpine architecture.' },
    { id: 3, name: 'Antelope Canyon', location: 'Page, Arizona, USA', badge: 'Must See', description: 'A breathtaking slot canyon with flowing sandstone walls and beams of light filtering from above.' },
    { id: 4, name: 'Cinque Terre', location: 'Liguria, Italy', badge: 'Popular', description: 'Five colorful cliffside villages connected by scenic hiking trails overlooking the Mediterranean Sea.' },
    { id: 5, name: 'Ha Long Bay', location: 'Quang Ninh, Vietnam', badge: 'UNESCO', description: 'Thousands of limestone islands rising from emerald waters in this UNESCO World Heritage Site.' },
    { id: 6, name: 'Salar de Uyuni', location: 'Potosi, Bolivia', badge: 'Hidden Gem', description: 'The world largest salt flat creates a mirror-like reflection of the sky producing surreal photographs.' },
];

function Spots() {
    const [search, setSearch] = useState<string>('');

    const filteredSpots = allSpots.filter((spot) =>
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

            <section className="spots-grid">
                {filteredSpots.length === 0 ? (
                    <p>No spots found matching your search.</p>
                ) : (
                    filteredSpots.map((spot) => (
                        <div key={spot.id} className="card spot-card">
                            <span className="badge">{spot.badge}</span>
                            <h2>{spot.name}</h2>
                            <p className="spot-location">{spot.location}</p>
                            <p>{spot.description}</p>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}

export default Spots;