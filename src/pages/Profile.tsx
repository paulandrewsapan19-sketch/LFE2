import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface UserData {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio?: string;
    role: string;
}

interface Spot {
    _id: string;
    name: string;
    photo_url: string;
    user_id?: { _id: string } | string;
}

function Profile() {
    const [user, setUser] = useState<UserData | null>(null);
    const [mySpots, setMySpots] = useState<Spot[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // Account update form
    const [editMode, setEditMode] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [formError, setFormError] = useState<string>('');
    const [formSuccess, setFormSuccess] = useState<string>('');
    const [formLoading, setFormLoading] = useState<boolean>(false);

    const { token } = useAuth();

    const fetchData = async () => {
        try {
            const userResponse = await axios.get('http://localhost:3000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userResponse.data);
            setName(userResponse.data.name);
            setUsername(userResponse.data.username);
            setEmail(userResponse.data.email);
            setBio(userResponse.data.bio || '');

            // Fetch all spots, then filter to only this user's own spots
            const spotsResponse = await axios.get('http://localhost:3000/api/spots?limit=100', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const filtered = spotsResponse.data.data.filter((spot: Spot) => {
                const ownerId = typeof spot.user_id === 'object' && spot.user_id !== null
                    ? spot.user_id._id
                    : spot.user_id;
                return ownerId === userResponse.data._id;
            });
            setMySpots(filtered);
        } catch (err: any) {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        setFormLoading(true);

        try {
            const payload: any = { name, username, email, bio, current_password: currentPassword };
            if (newPassword) payload.new_password = newPassword;

            const response = await axios.put('http://localhost:3000/api/users/me', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser(response.data);
            setFormSuccess('Profile updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setEditMode(false);
        } catch (err: any) {
            setFormError(err.response?.data?.error || 'Failed to update profile.');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return <main><p style={{ textAlign: 'center' }}>Loading profile...</p></main>;
    }

    if (error || !user) {
        return <main><p style={{ textAlign: 'center', color: 'red' }}>{error}</p></main>;
    }

    return (
        <main>
            {/* Profile header - avatar, name, stats */}
            <div className="insta-profile-header">
                <div className="insta-profile-avatar-lg">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>{user.username}</h2>
                    <p style={{ color: 'var(--color-text-muted)', margin: '0.2rem 0' }}>{user.name}</p>
                    {user.bio && <p style={{ margin: '0.4rem 0' }}>{user.bio}</p>}
                    {user.role === 'admin' && <span className="badge">Admin</span>}

                    <div className="insta-profile-stats">
                        <div className="insta-profile-stat">
                            <strong>{mySpots.length}</strong>
                            <span>Spots</span>
                        </div>
                    </div>

                    <button className="btn-outline" style={{ marginTop: '0.75rem' }} onClick={() => setEditMode(!editMode)}>
                        {editMode ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            {/* Edit account form */}
            {editMode && (
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
                    {formError && <div className="auth-error">{formError}</div>}
                    {formSuccess && (
                        <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                            {formSuccess}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself" />
                        </div>
                        <div className="form-group">
                            <label>New Password (leave blank to keep current)</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Current Password (required)</label>
                            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary" disabled={formLoading}>
                            {formLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {/* Grid of the user's own spots - Instagram profile style */}
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>My Spots</h3>
            {mySpots.length === 0 ? (
                <p style={{ textAlign: 'center' }}>You haven't shared any spots yet.</p>
            ) : (
                <div className="insta-profile-grid">
                    {mySpots.map((spot) => (
                        <Link key={spot._id} to={`/spots/${spot._id}`} className="insta-grid-item">
                            <img src={spot.photo_url} alt={spot.name} />
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Profile;