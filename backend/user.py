from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from models import User

user_ns = Namespace('api', description='User related operations')

# Model for all the endpoints (serializers)
# Model for the User endpoints
#===============================================================================
user_model=user_ns.model(
    "User",
    {
        "id":fields.Integer(),
        "name":fields.String(),
        "email":fields.String(),
        "password":fields.String(),
        "is_admin":fields.Boolean(),
        "last_login":fields.DateTime(),
        "is_premium":fields.Boolean(),
        "picture_path":fields.String(),
        "gender":fields.String(),
        "date_of_birth":fields.Date()
    }
)

@user_ns.route('/users')
class UserResource(Resource):
    @user_ns.marshal_list_with(user_model)
    def get(self):
        """Get all users"""
        users=User.query.all()
        return users

    @user_ns.marshal_with(user_model)
    @jwt_required()
    def post(self):
        """Create a new user"""
        data=request.get_json()
        new_user=User(
            name=data.get('name'),
            email=data.get('email'),
            password=data.get('password'),
            is_admin=data.get('is_admin'),
            last_login=data.get('last_login'),
            is_premium=data.get('is_premium'),
            picture_path=data.get('picture_path'),
            gender=data.get('gender'),
            date_of_birth=data.get('date_of_birth')
        )

        new_user.save()
        return new_user,201

@user_ns.route('/users/<int:id>')
class UserResource(Resource):
    @user_ns.marshal_with(user_model)
    def get(self,id):
        """Get a user by id"""
        user=User.query.get_or_404(id)
        return user,200 

    @user_ns.marshal_with(user_model)
    @jwt_required()
    def put(self,id):
        """Update a user by id"""
        user_to_update=User.query.get_or_404(id)
        data=request.get_json()
        user_to_update.update(
            id=data.get('id'),
            name=data.get('name'),
            email=data.get('email'),
            password=data.get('password'),
            is_admin=data.get('is_admin'),
            last_login=data.get('last_login'),
            is_premium=data.get('is_premium'),
            picture_path=data.get('picture_path'),
            gender=data.get('gender'),
            date_of_birth=data.get('date_of_birth')
        )
        return user_to_update,201

    @user_ns.marshal_with(user_model)
    @jwt_required()
    def delete(self,id):
        """Delete a user by id"""
        user_to_delete=User.query.get_or_404(id)
        user_to_delete.delete()
        return user_to_delete