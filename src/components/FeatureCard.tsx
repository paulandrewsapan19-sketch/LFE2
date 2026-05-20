// TypeScript interface for props
interface FeatureCardProps {
    title: string;
    description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
    return (
        <div className="card feature-card">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}

export default FeatureCard;