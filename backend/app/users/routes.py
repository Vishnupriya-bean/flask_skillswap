from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User

users_bp = Blueprint('users', __name__)


def check_admin(user_id):
    """Check if user is admin"""
    user = User.query.get(user_id)
    return user and user.role == 'admin'


@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/list', methods=['GET'])
@jwt_required()
def list_users():
    """List all users (admin only)"""
    try:
        user_id = get_jwt_identity()
        
        # Check if user is admin
        if not check_admin(user_id):
            return jsonify({'error': 'Only admins can view all users'}), 403
        
        users = User.query.all()
        
        return jsonify({
            'users': [user.to_dict() for user in users]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
