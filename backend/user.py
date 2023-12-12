from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from models import User, Artist, Song, Genre

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

@user_ns.route('/users/<int:id>/artists/<int:artist_id>')
class UserArtistResource(Resource):
    @jwt_required()
    def post(self, id, artist_id):
        """Like an artist"""
        user = User.query.get_or_404(id)
        artist = Artist.query.get_or_404(artist_id)

        user.add_liked_artist(artist)
        return {'message': f'User {user.name} likes artist {artist.name}'},201

    @jwt_required()
    def delete(self, id, artist_id):
        """Unlike an artist"""
        user = User.query.get_or_404(id)
        artist = Artist.query.get_or_404(artist_id)

        user.remove_liked_artist(artist)
        if response['status']=='success':
            return {'message': f'User {user.name} unlikes artist {artist.name}'}, 201
        elif response['status']=='info':
            return {'message': 'User is not liked the artist before.'}, 200

@user_ns.route('/users/<int:id>/songs/<int:song_id>')
class UserSongResource(Resource):
    @jwt_required()
    def post(self, id, song_id):
        """Like a song"""
        user = User.query.get_or_404(id)
        song = Song.query.get_or_404(song_id)

        user.add_liked_song(song)
        return {'message': f'User {user.name} likes song {song.name}'},201

    @jwt_required()
    def delete(self, id, song_id):
        """Unlike a song"""
        user = User.query.get_or_404(id)
        song = Song.query.get_or_404(song_id)

        user.remove_liked_song(song)
        if response['status']=='success':
            return {'message': f'User {user.name} unlikes song {song.name}'}, 201
        elif response['status']=='info':
            return {'message': 'User is not liked the song before.'}, 200

@user_ns.route('/users/<int:id>/genres/<int:genre_id>')
class UserGenreResource(Resource):
    @jwt_required()
    def post(self, id, genre_id):
        """Like a genre"""
        user = User.query.get_or_404(id)
        genre = Genre.query.get_or_404(genre_id)

        user.add_genre(genre)
        return {'message': f'User {user.name} likes genre {genre.name}'},201

    @jwt_required()
    def delete(self, id, genre_id):
        """Unlike a genre"""
        user = User.query.get_or_404(id)
        genre = Genre.query.get_or_404(genre_id)

        user.remove_genre(genre)
        if response['status']=='success':
            return {'message': f'User {user.name} unlikes genre {genre.name}'}, 201
        elif response['status']=='info':
            return {'message': 'User is not liked the genre before.'}, 200