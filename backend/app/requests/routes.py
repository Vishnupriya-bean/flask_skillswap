from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Skill, SkillRequest

requests_bp = Blueprint('requests', __name__)


def check_admin(user_id):
    """Check if user is admin"""
    user = User.query.get(user_id)
    return user and user.role == 'admin'


@requests_bp.route('/request-skill', methods=['POST'])
@jwt_required()
def request_skill():
    """Request a skill from another user"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validation
        if not data or not data.get('skill_id'):
            return jsonify({'error': 'Missing skill_id'}), 400
        
        # Check if skill exists
        skill = Skill.query.get(data['skill_id'])
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        # Check if user is not the skill creator
        if skill.created_by == user_id:
            return jsonify({'error': 'You cannot request your own skill'}), 400
        
        # Check if request already exists
        existing_request = SkillRequest.query.filter_by(
            skill_id=data['skill_id'],
            requester_id=user_id,
            status='pending'
        ).first()
        
        if existing_request:
            return jsonify({'error': 'You already have a pending request for this skill'}), 400
        
        # Create skill request
        skill_request = SkillRequest(
            skill_id=data['skill_id'],
            requester_id=user_id
        )
        
        db.session.add(skill_request)
        db.session.commit()
        
        return jsonify({
            'message': 'Skill request created successfully',
            'request': skill_request.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@requests_bp.route('/my-requests', methods=['GET'])
@jwt_required()
def get_my_requests():
    """Get all skill requests made by the current user"""
    try:
        user_id = get_jwt_identity()
        
        skill_requests = SkillRequest.query.filter_by(requester_id=user_id).all()
        
        return jsonify({
            'requests': [sr.to_dict() for sr in skill_requests]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@requests_bp.route('/received-requests', methods=['GET'])
@jwt_required()
def get_received_requests():
    """Get all skill requests received for user's skills"""
    try:
        user_id = get_jwt_identity()
        
        # Get all skills created by the user
        user_skills = Skill.query.filter_by(created_by=user_id).all()
        skill_ids = [skill.id for skill in user_skills]
        
        # Get all requests for these skills
        skill_requests = SkillRequest.query.filter(
            SkillRequest.skill_id.in_(skill_ids)
        ).all()
        
        return jsonify({
            'requests': [sr.to_dict() for sr in skill_requests]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@requests_bp.route('/<int:request_id>/accept', methods=['PUT'])
@jwt_required()
def accept_request(request_id):
    """Accept a skill request"""
    try:
        user_id = get_jwt_identity()
        skill_request = SkillRequest.query.get(request_id)
        
        if not skill_request:
            return jsonify({'error': 'Request not found'}), 404
        
        # Check if user is the skill creator
        if skill_request.skill.created_by != user_id:
            return jsonify({'error': 'You can only accept requests for your skills'}), 403
        
        skill_request.status = 'accepted'
        db.session.commit()
        
        return jsonify({
            'message': 'Request accepted successfully',
            'request': skill_request.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@requests_bp.route('/<int:request_id>/reject', methods=['PUT'])
@jwt_required()
def reject_request(request_id):
    """Reject a skill request"""
    try:
        user_id = get_jwt_identity()
        skill_request = SkillRequest.query.get(request_id)
        
        if not skill_request:
            return jsonify({'error': 'Request not found'}), 404
        
        # Check if user is the skill creator
        if skill_request.skill.created_by != user_id:
            return jsonify({'error': 'You can only reject requests for your skills'}), 403
        
        skill_request.status = 'rejected'
        db.session.commit()
        
        return jsonify({
            'message': 'Request rejected successfully',
            'request': skill_request.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
