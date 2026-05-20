import { useState } from 'react';
import { Spot } from '../types';

interface SpotListProps {
    spots: Spot[];
    onSpotSelect: (spot: Spot) => void;
}

function SpotList({ spots, onSpotSelect }: SpotListProps) {
    // useState with TypeScript - type inferred as number
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Conditional rendering - show message if list is empty
    if (spots.length === 0) {
        return <p>No spots found.</p>;
    }

    return (
        // Fragment - no extra DOM node
        <>
            <ul className="list-group">
                {/* Rendering list with .map() */}
                {spots.map((spot, index) => (
                    <li
                        key={spot.id}
                        className={'list-group-item ' + (selectedIndex === index ? 'active' : '')}
                        onClick={() => {
                            setSelectedIndex(index);
                            // Lifting state up to parent via function prop
                            onSpotSelect(spot);
                        }}
                    >
                        {spot.name} — {spot.location}
                    </li>
                ))}
            </ul>

            {/* Conditional rendering with && operator */}
            {selectedIndex >= 0 &&
                <p style={{ color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.75rem' }}>
                    You selected: {spots[selectedIndex].name}
                </p>
            }
        </>
    );
}

export default SpotList;