import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { skillsAPI, requestsAPI } from '../api';
import './skills.css';

function SkillsList() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await skillsAPI.listSkills();
            setSkills(response.skills || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestSkill = async (skillId) => {
        try {
            await requestsAPI.requestSkill(skillId);
            alert('Skill request sent successfully!');
            loadSkills();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div className="loading">Loading skills...</div>;
    }

    return (
        <div className="skills-container">
            <nav className="navbar">
                <div className="navbar-brand">SkillSwap</div>
                <div className="navbar-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/skills" className="active">
                        Skills
                    </Link>
                    <Link to="/create-skill">Create Skill</Link>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="skills-content">
                <h1>Available Skills</h1>
                {error && <div className="error-message">{error}</div>}

                {skills.length === 0 ? (
                    <div className="no-skills">
                        <p>No skills available yet. Be the first to create one!</p>
                        <Link to="/create-skill" className="btn-primary">
                            Create Skill
                        </Link>
                    </div>
                ) : (
                    <div className="skills-grid">
                        {skills.map((skill) => (
                            <div key={skill.id} className="skill-card">
                                <h3>{skill.title}</h3>
                                <p>{skill.description}</p>
                                <div className="skill-meta">
                                    <span className="creator">By {skill.creator_name}</span>
                                    <span className="date">
                                        {new Date(skill.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleRequestSkill(skill.id)}
                                    className="btn-request"
                                >
                                    Request Skill
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SkillsList;
