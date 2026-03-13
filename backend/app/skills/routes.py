from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Skill

skills_bp = Blueprint('skills', __name__)


def check_admin(user_id):
    """Check if user is admin"""
    user = User.query.get(user_id)
    return user and user.role == 'admin'


@skills_bp.route('/create', methods=['POST'])
@jwt_required()
def create_skill():
    """Create a new skill"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validation
        if not data or not data.get('title') or not data.get('description'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create skill
        skill = Skill(
            title=data['title'],
            description=data['description'],
            created_by=user_id
        )
        
        db.session.add(skill)
        db.session.commit()
        
        return jsonify({
            'message': 'Skill created successfully',
            'skill': skill.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@skills_bp.route('/list', methods=['GET'])
def list_skills():
    """List all skills"""
    try:
        skills = Skill.query.all()
        
        return jsonify({
            'skills': [skill.to_dict() for skill in skills]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@skills_bp.route('/<int:skill_id>/update', methods=['PUT'])
@jwt_required()
def update_skill(skill_id):
    """Update a skill"""
    try:
        user_id = get_jwt_identity()
        skill = Skill.query.get(skill_id)
        
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        # Check if user owns the skill or is admin
        if skill.created_by != user_id and not check_admin(user_id):
            return jsonify({'error': 'You can only update your own skills'}), 403
        
        data = request.get_json()
        
        if data.get('title'):
            skill.title = data['title']
        if data.get('description'):
            skill.description = data['description']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Skill updated successfully',
            'skill': skill.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@skills_bp.route('/<int:skill_id>/delete', methods=['DELETE'])
@jwt_required()
def delete_skill(skill_id):
    """Delete a skill"""
    try:
        user_id = get_jwt_identity()
        skill = Skill.query.get(skill_id)
        
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        # Check if user owns the skill or is admin
        if skill.created_by != user_id and not check_admin(user_id):
            return jsonify({'error': 'You can only delete your own skills'}), 403
        
        db.session.delete(skill)
        db.session.commit()
        
        return jsonify({'message': 'Skill deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
