from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from models import Genre
from song import song_model, song_ns

genre_ns = Namespace('api', description='Genre related operations')

# Model for the Genre endpoints
#===============================================================================
genres_model=genre_ns.model(
    "Genre",
    {
        "id":fields.Integer(),
        "name":fields.String()
    }
)

@genre_ns.route('/genres')
class GenreResource(Resource):
    @genre_ns.marshal_list_with(genres_model)
    @jwt_required()
    def get(self):
        """Get all genres"""
        genres=Genre.query.all()
        return genres

    @genre_ns.marshal_with(genres_model)
    @jwt_required()
    def post(self):
        """Create a new genre"""
        data=request.get_json()
        new_genre=Genre(
            name=data.get('name')
        )

        new_genre.save()
        return new_genre,201

@genre_ns.route('/genres/<int:id>')
class GenreResource(Resource):
    @genre_ns.marshal_with(genres_model)
    @jwt_required()
    def get(self,id):
        """Get a genre by id"""
        genre=Genre.query.get_or_404(id)
        return genre,200

    @genre_ns.marshal_with(genres_model)
    @jwt_required()
    def put(self,id):
        """Update a genre by id"""
        genre_to_update=Genre.query.get_or_404(id)
        data=request.get_json()
        genre_to_update.update(
            name=data.get('name')
        )
        return genre_to_update,201

    @genre_ns.marshal_with(genres_model)
    @jwt_required()
    def delete(self,id):
        """Delete a genre by id"""
        genre_to_delete=Genre.query.get_or_404(id)
        genre_to_delete.delete()
        return genre_to_delete

# search songs by genre
@genre_ns.route('/genres/<int:id>/songs')
class GenreSongsResource(Resource):
    @jwt_required()
    def get(self,id):
        """Get all songs by genre"""
        genre=Genre.query.get_or_404(id)
        songs=genre.songs
        return jsonify(
            [
                {
                    "id":song.id,
                    "name":song.name,
                    "likes":song.likes,
                    "play_count":song.play_count,
                    "path":song.path,
                    "picture_path":song.picture_path,
                    "release_date":song.release_date
                } for song in songs
            ]
        )

@genre_ns.route('/genres/search/<string:name>')
class GenreSearchResource(Resource):
    @genre_ns.marshal_list_with(genres_model)
    @jwt_required()
    def get(self,name):
        """Search genres by name"""
        search_term = urllib.parse.unquote(name)
        genres=Genre.query.filter(Genre.name.like(f'%{search_term}%')).all()
        return genres