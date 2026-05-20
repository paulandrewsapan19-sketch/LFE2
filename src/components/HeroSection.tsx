function HeroSection() {
    return (
        <section className="hero">
            <div className="hero-text">
                <h1>Welcome to Roamr</h1>
                <p>Your social platform for discovering and sharing amazing places around the world. Find hidden gems, create trip collections, and connect with fellow travelers.</p>
                <a href="/spots" className="btn-primary">Explore Spots</a>
            </div>
            <div className="hero-image-wrapper">
                <img
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800"
                    alt="Traveler looking out over a scenic mountain lake"
                    className="hero-image"
                />
            </div>
        </section>
    );
}

export default HeroSection;