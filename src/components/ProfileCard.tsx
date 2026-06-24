import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface User {
    _id: string;
    name: string;
    username: string;
}

function ProfileCard() {
    const { token } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [spotCount, setSpotCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                const [userRes, spotsRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/users/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:3000/api/spots?limit=100', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                const userData = userRes.data;
                setUser(userData);
                const mySpots = spotsRes.data.data.filter((s: any) => {
                    const sid = typeof s.user_id === 'object' && s.user_id !== null
                        ? s.user_id._id : s.user_id;
                    return sid === userData._id;
                });
                setSpotCount(mySpots.length);
            } catch {} finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    if (loading) {
        return (
            <div className="card sidebar-panel">
                <div className="skeleton-avatar" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="card sidebar-panel" style={{ textAlign: 'center' }}>
            <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '1.4rem', margin: '0 auto 0.75rem' }}>
                {user.name.charAt(0).toUpperCase()}
            </div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.15rem' }}>{user.username}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '0 0 0.75rem' }}>{user.name}</p>
            <p style={{ fontSize: '0.85rem', margin: '0 0 1rem' }}>
                <strong>{spotCount}</strong> <span style={{ color: 'var(--color-text-muted)' }}>spots</span>
            </p>
            <Link to="/profile" className="btn-outline" style={{ fontSize: '0.82rem', padding: '0.35rem 1rem' }}>
                View Profile
            </Link>
        </div>
    );
}

export default ProfileCard;
