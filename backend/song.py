from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from models import Song

song_ns = Namespace('song', description='Song related operations')

# Model for the Song endpoints
#===============================================================================
song_model=song_ns.model(
    "Song",
    {
        "id":fields.Integer(),
        "album_id":fields.Integer(),
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
            album_id=data.get('album_id'),
            name=data.get('name'),
            likes=data.get('likes'),
            play_count=data.get('play_count'),
            path=data.get('path'),
            picture_path=data.get('picture_path'),
            release_date=data.get('release_date')
        )

        new_song.save()
        return new_song,201

@song_ns.route('/song/<int:id>')
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
            album_id=data.get('album_id'),
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