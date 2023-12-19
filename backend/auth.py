from flask import Flask, request, jsonify, make_response
from flask_restx import Namespace, Resource, fields
from models import User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity

auth_ns = Namespace('auth', description='Authentication related operations')

bcrypt = Bcrypt()

signup_model=auth_ns.model(
    "SignUp",
    {
        "name":fields.String(required=True),
        "email":fields.String(required=True),
        "password":fields.String(required=True),
        "gender":fields.String(enum=["Male", "Female", "Other"], required=True),
        "date_of_birth":fields.Date(required=True)
    }
)

login_model=auth_ns.model(
    "Login",
    {
        "email":fields.String(required=True),
        "password":fields.String(required=True)
    }
)

@auth_ns.route('/hello')
class HelloWorld(Resource):
    def get(self):
        return {'message': 'hello world'}

@auth_ns.route('/signup')
class SignUp(Resource):

    @auth_ns.expect(signup_model)
    def post(self):
        data = request.get_json()

        email = data.get('email')
        db_user = User.query.filter_by(email=email).first()

        if db_user is not None:
            return jsonify({"message": "Email already exists"})

        
        new_user = User(
            name=data.get('name'),
            email=data.get('email'),
            password=bcrypt.generate_password_hash(data.get('password')).decode('utf-8'),
            is_admin=False, # MAYBE FIX THIS LATER
            is_premium=False, # MAYBE FIX THIS LATER
            last_login=None,
            picture_path=None,
            gender=data.get('gender'),
            date_of_birth=data.get('date_of_birth')
        )

        new_user.save()
        return make_response(jsonify({"message": "User created successfully"}), 201)

@auth_ns.route('/login')
class Login(Resource):

    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')
        
        db_user = User.query.filter_by(email=email).first()
        
        if db_user and bcrypt.check_password_hash(db_user.password, password):
            # Check if the user is an admin
            if db_user.is_admin:
                # Create tokens with additional claim to indicate the admin role
                access_token = create_access_token(identity=db_user.email, additional_claims={"is_admin": True})
                refresh_token = create_refresh_token(identity=db_user.email)
                return make_response(jsonify({
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "email": db_user.email,
                    "id": db_user.id,
                    "is_admin": True
                }), 200)
            else:
                # Create tokens without the admin claim
                access_token = create_access_token(identity=db_user.email, fresh=True)
                refresh_token = create_refresh_token(identity=db_user.email)
                return make_response(jsonify({
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "email": db_user.email,
                    "id": db_user.id,
                    "is_admin": False
                }), 200)
        else:
            return make_response(jsonify({
                "message": "Invalid credentials"
            }), 401)


# Refresh token is used to get a new access token when the old one expires
@auth_ns.route('/refresh')
class Refresh(Resource):

    @jwt_required(refresh=True)
    def post(self):
        current_user=get_jwt_identity()
        new_access_token=create_access_token(identity=current_user, fresh=False)
        return make_response(jsonify({"access_token":new_access_token}), 200)