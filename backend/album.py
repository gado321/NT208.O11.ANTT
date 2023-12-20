from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required
from models import Album, Song
from song import song_model
import urllib.parse
import os

album_ns = Namespace('api', description='Album related operations')

# Model for the Album endpoints
#===============================================================================
album_model=album_ns.model(
    "Album",
    {
        "id":fields.Integer(),
        "artist_id":fields.Integer(),
        "name":fields.String(),
        "picture_path":fields.String(),
        "release_date":fields.Date()
    }
)

@album_ns.route('/albums')
class AlbumResource(Resource):
    @album_ns.marshal_list_with(album_model)
    @jwt_required()
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
            picture_path=data.get('picture_path'),
            release_date=data.get('release_date')
        )

        new_album.save()
        return new_album,201

@album_ns.route('/albums/<int:id>')
class AlbumResource(Resource):
    @album_ns.marshal_with(album_model)
    @jwt_required()
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
            picture_path=data.get('picture_path'),
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

# get all songs of an album
@album_ns.route('/albums/<int:id>/songs')
class AlbumSongsResource(Resource):
    @album_ns.marshal_list_with(song_model)
    @jwt_required()
    def get(self,id):
        """Get all songs of an album"""
        album=Album.query.get_or_404(id)
        songs=album.songs
        return songs

# random album with a liked artist
@album_ns.route('/albums/artist/<int:id>/random')
class AlbumRandomResource(Resource):
    @album_ns.marshal_with(album_model)
    @jwt_required()
    def get(self,id):
        """Get a random album with a liked artist"""
        albums=Album.query.filter(Album.artist_id==id).all()
        return random.choice(albums)

@album_ns.route('/albums/search/<string:name>')
class AlbumSearchResource(Resource):
    @album_ns.marshal_list_with(album_model)
    @jwt_required()
    def get(self,name):
        """Search albums by name"""
        search_term = urllib.parse.unquote(name)
        albums=Album.query.filter(Album.name.like(f'%{search_term}%')).all()
        return albums

# get last id of album in database
@album_ns.route('/albums/last_id')
class AlbumLastIdResource(Resource):
    @jwt_required()
    def get(self):
        """Get last id of album in database"""
        last_album_id=Album.query.order_by(Album.id.desc()).first().id
        return jsonify(
            {
                'lastId': last_album_id
            }
        )

@album_ns.route('/albums/upload')
class AlbumUploadResource(Resource):
    @jwt_required()
    def post(self):
        """Upload an image of an album"""
        from flask import current_app

        if 'image' not in request.files:
            return {'message': 'No data sent'}, 400

        image = request.files['image']
        album_name = request.form['name']
        album_id = request.form['albumId']

        if image.filename == '':
            return {'message': 'No file selected'}, 400
        
        if image:
            image_extension = os.path.splitext(image.filename)[1]
            
            album_filename = album_name + '-' + album_id + image_extension

            secure_album_filename = secure_filename(album_filename)

            image.save(os.path.join('../data/images/album', secure_album_filename))

            return {'message': 'Image uploaded successfully'}, 200
        else:
            return {'message': 'Image upload failed'}, 400