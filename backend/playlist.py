from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from models import Playlist

playlist_ns = Namespace('api', description='Playlist related operations')

# Model for the Playlist endpoints
#===============================================================================
playlist_model=playlist_ns.model(
    "Playlist",
    {
        "id":fields.Integer(),
        "user_id":fields.Integer(),
        "name":fields.String(),
        "picture_path":fields.String(),
        "thumbnail_path":fields.String()
    }
)

@playlist_ns.route('/playlists')
class PlaylistResource(Resource):
    @playlist_ns.marshal_list_with(playlist_model)
    def get(self):
        """Get all playlists"""
        playlists=Playlist.query.all()
        return playlists

    @playlist_ns.marshal_with(playlist_model)
    @jwt_required()
    def post(self):
        """Create a new playlist"""
        data=request.get_json()
        new_playlist=Playlist(
            user_id=data.get('user_id'),
            name=data.get('name'),
            picture_path=data.get('picture_path'),
            thumbnail_path=data.get('thumbnail_path')
        )

        new_playlist.save()
        return new_playlist,201

@playlist_ns.route('/playlists/<int:id>')
class PlaylistResource(Resource):
    @playlist_ns.marshal_with(playlist_model)
    def get(self,id):
        """Get a playlist by id"""
        playlist=Playlist.query.get_or_404(id)
        return playlist,200

    @playlist_ns.marshal_with(playlist_model)
    @jwt_required()
    def put(self,id):
        """Update a playlist by id"""
        playlist_to_update=Playlist.query.get_or_404(id)
        data=request.get_json()
        playlist_to_update.update(
            user_id=data.get('user_id'),
            name=data.get('name'),
            picture_path=data.get('picture_path'),
            thumbnail_path=data.get('thumbnail_path')
        )
        return playlist_to_update,201

    @playlist_ns.marshal_with(playlist_model)
    @jwt_required()
    def delete(self,id):
        """Delete a playlist by id"""
        playlist_to_delete=Playlist.query.get_or_404(id)
        playlist_to_delete.delete()
        return playlist_to_delete

@playlist_ns.route('/playlists/<int:id>/songs<int:song_id>')
class PlaylistSongResource(Resource):
    @jwt_required()
    def put(self,id,song_id):
        """Add a song to a playlist"""
        playlist=Playlist.query.get_or_404(id)
        song=Song.query.get_or_404(song_id)
        
        response=playlist.add_song(song)
        if response['status']=='success':
            return {'message': f'Song {song.name} added to playlist {album.name}'}, 201
        elif response['status']=='info':
            return {'message': 'Song is already in the album.'}, 200

    @jwt_required()
    def delete(self,id,song_id):
        """Remove a song from a playlist"""
        playlist=Playlist.query.get_or_404(id)
        song=Song.query.get_or_404(song_id)

        response=playlist.remove_song(song)
        if response['status']=='success':
            return {'message': f'Song {song.name} removed from playlist {album.name}'}, 201
        elif response['status']=='info':
            return {'message': 'Song is not in the playlist.'}, 200
