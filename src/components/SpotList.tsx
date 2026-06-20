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
            <ul className="spot-list">
                {/* Rendering list with .map() */}
                {spots.map((spot, index) => (
                    <li
                        key={spot.id}
                        className={'spot-list-item' + (selectedIndex === index ? ' spot-list-item-active' : '')}
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
                <p className="featured-location">
                    You selected: {spots[selectedIndex].name}
                </p>
            }
        </>
    );
}

export default SpotList;