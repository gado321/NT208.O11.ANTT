from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from models import Album, Song

album_ns = Namespace('api', description='Album related operations')

# Model for the Album endpoints
#===============================================================================
album_model=album_ns.model(
    "Album",
    {
        "id":fields.Integer(),
        "artist_id":fields.Integer(),
        "name":fields.String(),
        "release_date":fields.Date()
    }
)

@album_ns.route('/albums')
class AlbumResource(Resource):
    @album_ns.marshal_list_with(album_model)
    def get(self):
        """Get all albums"""
        albums=Album.query.all()
        return albums

    @album_ns.marshal_with(album_model)
    @jwt_required()
    def post(self):
        """Create a new album"""
        data=request.get_json()
        new_album=Album(
            artist_id=data.get('artist_id'),
            name=data.get('name'),
            release_date=data.get('release_date')
        )

        new_album.save()
        return new_album,201

@album_ns.route('/albums/<int:id>')
class AlbumResource(Resource):
    @album_ns.marshal_with(album_model)
    def get(self,id):
        """Get an album by id"""
        album=Album.query.get_or_404(id)
        return album,200

    @album_ns.marshal_with(album_model)
    @jwt_required()
    def put(self,id):
        """Update an album by id"""
        album_to_update=Album.query.get_or_404(id)
        data=request.get_json()
        album_to_update.update(
            artist_id=data.get('artist_id'),
            name=data.get('name'),
            release_date=data.get('release_date')
        )
        return album_to_update,201

    @album_ns.marshal_with(album_model)
    @jwt_required()
    def delete(self,id):
        """Delete an album by id"""
        album_to_delete=Album.query.get_or_404(id)
        album_to_delete.delete()
        return album_to_delete

@album_ns.route('/albums/<int:id>/songs/<int:song_id>')
class AlbumSongResource(Resource):
    @jwt_required()
    def post(self, id, song_id):
        """Add a song to an album"""
        album=Album.query.get_or_404(id)
        song=Song.query.get_or_404(song_id)
        
        response=album.add_song(song)

        if response['status']=='success':
            return {'message': f'Song {song.name} added to album {album.name}'}, 201
        elif response['status']=='info':
            return {'message': 'Song is already in the album.'}, 200
        else :
            return {'message': 'Cannot add this song to the album. Artist ID does not match.'}, 200

    @jwt_required()
    def delete(self,id,song_id):
        """Remove a song from an album"""
        album=Album.query.get_or_404(id)
        song=Song.query.get_or_404(song_id)

        response=album.remove_song(song)

        if response['status']=='success':
            return {'message': f'Song {song.name} removed from album {album.name}'}, 201
        elif response['status']=='info':
            return {'message': 'Song is not in the album.'}, 200
