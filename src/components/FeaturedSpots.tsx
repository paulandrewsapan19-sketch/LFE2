import { Spot } from '../types';

// TypeScript interface for props
interface FeaturedSpotsProps {
    spots: Spot[];
}

function FeaturedSpots({ spots }: FeaturedSpotsProps) {
    return (
        <section className="featured-spots">
            <h2 className="section-title">Featured Spots</h2>
            <div className="spots-grid">
                {spots.slice(0, 3).map((spot) => (
                    <div key={spot.id} className="card">
                        <span className="badge">{spot.badge}</span>
                        <h3>{spot.name}</h3>
                        <p className="featured-location">{spot.location}</p>
                        <p>{spot.description}</p>
                    </div>
                ))}
            </div>
            <div className="view-all-wrapper">
                <a href="/spots" className="btn-outline">View All Spots</a>
            </div>
        </section>
    );
}

export default FeaturedSpots;