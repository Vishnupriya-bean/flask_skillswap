// API service for communicating with Flask backend
const API_URL = 'http://localhost:5000/api';

// Helper function to get JWT token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to make API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (getToken()) {
        options.headers['Authorization'] = `Bearer ${getToken()}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || 'API request failed');
    }

    return responseData;
};

// Auth API
export const authAPI = {
    register: (name, email, password, role = 'student') =>
        apiCall('/auth/register', 'POST', { name, email, password, role }),

    login: (email, password) =>
        apiCall('/auth/login', 'POST', { email, password }),
};

// Users API
export const usersAPI = {
    getProfile: () => apiCall('/users/profile'),

    listUsers: () => apiCall('/users/list'),
};

// Skills API
export const skillsAPI = {
    createSkill: (title, description) =>
        apiCall('/skills/create', 'POST', { title, description }),

    listSkills: () => apiCall('/skills/list'),

    updateSkill: (skillId, title, description) =>
        apiCall(`/skills/${skillId}/update`, 'PUT', { title, description }),

    deleteSkill: (skillId) =>
        apiCall(`/skills/${skillId}/delete`, 'DELETE'),
};

// Skill Requests API
export const requestsAPI = {
    requestSkill: (skillId) =>
        apiCall('/requests/request-skill', 'POST', { skill_id: skillId }),

    getMyRequests: () => apiCall('/requests/my-requests'),

    getReceivedRequests: () => apiCall('/requests/received-requests'),

    acceptRequest: (requestId) =>
        apiCall(`/requests/${requestId}/accept`, 'PUT'),

    rejectRequest: (requestId) =>
        apiCall(`/requests/${requestId}/reject`, 'PUT'),
};
