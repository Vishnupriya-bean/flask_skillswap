import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { requestsAPI } from '../api';
import './requests.css';

function MyRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await requestsAPI.getMyRequests();
            setRequests(response.requests || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#ffc107';
            case 'accepted':
                return '#28a745';
            case 'rejected':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    if (loading) {
        return <div className="loading">Loading requests...</div>;
    }

    return (
        <div className="requests-container">
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

            <div className="requests-content">
                <h1>My Skill Requests</h1>

                {requests.length === 0 ? (
                    <div className="no-requests">
                        <p>You haven't requested any skills yet.</p>
                        <Link to="/skills" className="btn-primary">
                            Browse Skills
                        </Link>
                    </div>
                ) : (
                    <div className="requests-list">
                        {requests.map((req) => (
                            <div key={req.id} className="request-card">
                                <div className="request-header">
                                    <h3>{req.skill_title}</h3>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(req.status) }}
                                    >
                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                    </span>
                                </div>
                                <p className="request-meta">
                                    Requested from: <strong>{req.requester_name}</strong>
                                </p>
                                <p className="request-date">
                                    {new Date(req.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyRequests;
