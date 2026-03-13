import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usersAPI, skillsAPI, requestsAPI } from '../api';
import './dashboard.css';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        skills: 0,
        requests: 0,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const userStr = localStorage.getItem('user');
                if (userStr) {
                    setUser(JSON.parse(userStr));
                }

                // Load stats
                const skillsRes = await skillsAPI.listSkills();
                const requestsRes = await requestsAPI.getMyRequests();

                setStats({
                    skills: skillsRes.skills.length,
                    requests: requestsRes.requests.length,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <div className="navbar-brand">SkillSwap</div>
                <div className="navbar-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/skills">Skills</Link>
                    <Link to="/create-skill">Create Skill</Link>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1>Welcome, {user?.name}!</h1>
                    <p className="role-badge">{user?.role === 'admin' ? '👑 Admin' : '👤 Student'}</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Skills</h3>
                        <p className="stat-number">{stats.skills}</p>
                        <Link to="/skills" className="stat-link">
                            View All Skills →
                        </Link>
                    </div>

                    <div className="stat-card">
                        <h3>My Requests</h3>
                        <p className="stat-number">{stats.requests}</p>
                        <Link to="/my-requests" className="stat-link">
                            View Requests →
                        </Link>
                    </div>

                    {user?.role === 'admin' && (
                        <div className="stat-card">
                            <h3>Admin Panel</h3>
                            <p className="stat-number">⚙️</p>
                            <Link to="/admin/users" className="stat-link">
                                Manage Users →
                            </Link>
                        </div>
                    )}
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/create-skill" className="action-btn">
                            ➕ Create Skill
                        </Link>
                        <Link to="/skills" className="action-btn">
                            🔍 Browse Skills
                        </Link>
                        <Link to="/my-requests" className="action-btn">
                            📋 My Requests
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
