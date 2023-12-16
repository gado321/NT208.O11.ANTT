from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from models import Song, Artist, Genre, User
import urllib.parse

song_ns = Namespace('api', description='Song related operations')

# Model for the Song endpoints
#===============================================================================
song_model=song_ns.model(
    "Song",
    {
        "id":fields.Integer(),
        "name":fields.String(),
        "likes":fields.Integer(),
        "play_count":fields.Integer(),
        "path":fields.String(),
        "picture_path":fields.String(),
        "release_date":fields.Date()
    }
)

@song_ns.route('/songs')
class SongResource(Resource):
    @song_ns.marshal_list_with(song_model)
    def get(self):
        """Get all songs"""
        songs=Song.query.all()
        return songs

    @song_ns.marshal_with(song_model)
    @jwt_required()
    def post(self):
        """Create a new song"""
        data=request.get_json()
        new_song=Song(
            name=data.get('name'),
            likes=data.get('likes'),
            play_count=data.get('play_count'),
            path=data.get('path'),
            picture_path=data.get('picture_path'),
            release_date=data.get('release_date')
        )

        new_song.save()
        return new_song,201

@song_ns.route('/songs/<int:id>')
class SongResource(Resource):
    @song_ns.marshal_with(song_model)
    def get(self,id):
        """Get a song by id"""
        song=Song.query.get_or_404(id)
        return song,200

    @song_ns.marshal_with(song_model)
    @jwt_required()
    def put(self,id):
        """Update a song by id"""
        song_to_update=Song.query.get_or_404(id)
        data=request.get_json()
        song_to_update.update(
            name=data.get('name'),
            likes=data.get('likes'),
            play_count=data.get('play_count'),
            path=data.get('path'),
            picture_path=data.get('picture_path'),
            release_date=data.get('release_date')
        )
        return song_to_update,201

    @song_ns.marshal_with(song_model)
    @jwt_required()
    def delete(self,id):
        """Delete a song by id"""
        song_to_delete=Song.query.get_or_404(id)
        song_to_delete.delete()
        return song_to_delete

@song_ns.route('/songs/<int:song_id>/artists/<int:artist_id>')
class SongArtistResource(Resource):
    @jwt_required()
    def post(self, song_id, artist_id):
        """Add an artist to a song"""
        song=Song.query.get_or_404(song_id)
        artist=Artist.query.get_or_404(artist_id)

        song.add_artist(artist)

        return {'message': f'Artist {artist.name} added to song {song.name}'}, 201

    @jwt_required()
    def delete(self, song_id, artist_id):
        """Remove an artist from a song"""
        song=Song.query.get_or_404(song_id)
        artist=Artist.query.get_or_404(artist_id)

        response=song.remove_artist(artist)
        if response['status']=='success':
            return {'message': f'Artist {artist.name} removed from song {song.name}'}, 201
        elif response['status']=='info':
            return {'message': 'Artist is not in the song.'}, 200

@song_ns.route('/songs/<int:song_id>/genres/<int:genre_id>')
class SongGenreResource(Resource):
    @jwt_required()
    def post(self, song_id, genre_id):
        """Add a genre to a song"""
        song = Song.query.get_or_404(song_id)
        genre = Genre.query.get_or_404(genre_id)

        song.add_genre(genre)

        return {'message': f'Genre {genre.name} added to song {song.name}'}, 201

    @jwt_required()
    def delete(self, song_id, genre_id):
        """Remove a genre from a song"""
        song = Song.query.get_or_404(song_id)
        genre = Genre.query.get_or_404(genre_id)

        response=song.remove_genre(genre)
        if response['status']=='success':
            return {'message': f'Genre {genre.name} removed from song {song.name}'}, 201
        elif response['status']=='info':
            return {'message': 'Genre is not in the song.'}, 200

# route for search songs by grep name
@song_ns.route('/songs/search/<string:name>')
class SongSearchResource(Resource):
    @song_ns.marshal_list_with(song_model)
    def get(self,name):
        """Get all songs"""
        search_term = urllib.parse.unquote(name)
        songs=Song.query.filter(Song.name.like(f'%{search_term}%')).all()
        return songs