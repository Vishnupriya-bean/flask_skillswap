import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { skillsAPI } from '../api';
import './create-skill.css';

function CreateSkill() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            await skillsAPI.createSkill(formData.title, formData.description);

            alert('Skill created successfully!');
            navigate('/skills');
        } catch (err) {
            setError(err.message || 'Failed to create skill');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="create-skill-container">
            <nav className="navbar">
                <div className="navbar-brand">SkillSwap</div>
                <div className="navbar-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/skills">Skills</Link>
                    <Link to="/create-skill" className="active">
                        Create Skill
                    </Link>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="create-skill-content">
                <div className="form-container">
                    <h1>Create New Skill</h1>
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Skill Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter skill title (e.g., Python Programming)"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Describe your skill in detail..."
                                rows="6"
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={loading} className="btn-submit">
                                {loading ? 'Creating...' : 'Create Skill'}
                            </button>
                            <Link to="/skills" className="btn-cancel">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateSkill;
