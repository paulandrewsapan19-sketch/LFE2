import { useState } from 'react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import FeaturedSpots from '../components/FeaturedSpots';
import SpotList from '../components/SpotList';
import { Spot, Feature } from '../types';

const features: Feature[] = [
    { id: 1, title: 'Discover Spots', description: 'Browse thousands of locations shared by travelers just like you. From hidden beaches to mountain peaks, find your next adventure.' },
    { id: 2, title: 'Build Trips', description: 'Organize your favorite spots into curated trip collections. Plan ahead or document places you have already been.' },
    { id: 3, title: 'Connect', description: 'Follow other explorers, like their spots, and share your own travel discoveries with a community of passionate roamers.' }
];

const spots: Spot[] = [
    { id: 1, name: 'Lanikai Beach', location: 'Kailua, Hawaii, USA', badge: 'Trending', description: 'A stunning stretch of white sand with calm turquoise waters.' },
    { id: 2, name: 'Hallstatt Village', location: 'Salzkammergut, Austria', badge: 'Top Rated', description: 'A picturesque lakeside village nestled between mountains.' },
    { id: 3, name: 'Antelope Canyon', location: 'Page, Arizona, USA', badge: 'Must See', description: 'A breathtaking slot canyon with flowing sandstone walls.' },
    { id: 4, name: 'Cinque Terre', location: 'Liguria, Italy', badge: 'Popular', description: 'Five colorful cliffside villages connected by scenic hiking trails.' },
    { id: 5, name: 'Ha Long Bay', location: 'Quang Ninh, Vietnam', badge: 'UNESCO', description: 'Thousands of limestone islands rising from emerald waters.' },
];

function Home() {
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(true);

    return (
        <main>
            {showAlert && (
                <div className="welcome-alert">
                    Welcome to Roamr! Discover and share your favorite travel spots.
                    <button className="welcome-alert-close" onClick={() => setShowAlert(false)}>&times;</button>
                </div>
            )}
            <div className="view-all-wrapper">
                <button className="btn-outline" onClick={() => setShowAlert(!showAlert)}>
                    {showAlert ? 'Hide Welcome Message' : 'Show Welcome Message'}
                </button>
            </div>

            <section className="hero">
                <div className="hero-text">
                    <h1>Welcome to Roamr</h1>
                    <p>Your social platform for discovering and sharing amazing places around the world. Find hidden gems, create trip collections, and connect with fellow travelers.</p>
                    <Link to="/spots" className="btn-primary">Explore Spots</Link>
                </div>

                <div className="hero-image-wrapper">
                    <img
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800"
                        alt="Traveler looking out over a scenic mountain lake"
                        className="hero-image"
                    />
                </div>
            </section>

            <section className="features">
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.id}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </section>

            <FeaturedSpots spots={spots} />

            <section className="featured-spots">
                <h2 className="section-title">All Spots</h2>
                <SpotList
                    spots={spots}
                    onSpotSelect={(spot: Spot) => setSelectedSpot(spot)}
                />
                {selectedSpot &&
                    <div className="card" style={{ marginTop: '1.5rem' }}>
                        <h3>{selectedSpot.name}</h3>
                        <p className="featured-location">{selectedSpot.location}</p>
                        <p>{selectedSpot.description}</p>
                    </div>
                }
            </section>
        </main>
    );
}

export default Home;