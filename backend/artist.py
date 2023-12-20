from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from models import Artist, Song
from song import song_model
import urllib.parse
import os

artist_ns = Namespace('api', description='Artist related operations')

# Model for the Artist endpoints
#===============================================================================
artist_model=artist_ns.model(
    "Artist",
    {
        "id":fields.Integer(),
        "name":fields.String(),
        "picture_path":fields.String()
    }
)

@artist_ns.route('/artists')
class ArtistResource(Resource):
    @artist_ns.marshal_list_with(artist_model)
    @jwt_required()
    def get(self):
        """Get all artists"""
        artists=Artist.query.all()
        return artists

    @artist_ns.marshal_with(artist_model)
    @jwt_required()
    def post(self):
        """Create a new artist"""
        data=request.get_json()
        new_artist=Artist(
            name=data.get('name'),
            picture_path=data.get('picture_path')
        )

        new_artist.save()
        return new_artist,201

@artist_ns.route('/artists/<int:id>')
class ArtistResource(Resource):
    @artist_ns.marshal_with(artist_model)
    @jwt_required()
    def get(self,id):
        """Get an artist by id"""
        artist=Artist.query.get_or_404(id)
        return artist,200

    @artist_ns.marshal_with(artist_model)
    @jwt_required()
    def put(self,id):
        """Update an artist by id"""
        artist_to_update=Artist.query.get_or_404(id)
        data=request.get_json()
        artist_to_update.update(
            name=data.get('name'),
            picture_path=data.get('picture_path')
        )
        return artist_to_update,201

    @artist_ns.marshal_with(artist_model)
    @jwt_required()
    def delete(self,id):
        """Delete an artist by id"""
        artist_to_delete=Artist.query.get_or_404(id)
        artist_to_delete.delete()
        return artist_to_delete

@artist_ns.route('/artists/search/<string:name>')
class ArtistSearchResource(Resource):
    @artist_ns.marshal_list_with(artist_model)
    @jwt_required()
    def get(self,name):
        """Search """
        search_term = urllib.parse.unquote(name)
        artists=Artist.query.filter(Artist.name.like(f'%{search_term}%')).all()
        return artists

# get all songs of an artist
@artist_ns.route('/artists/<int:id>/songs')
class ArtistSongsResource(Resource):
    @artist_ns.marshal_list_with(song_model)
    @jwt_required()
    def get(self,id):
        """Get all songs of an artist"""
        artist=Artist.query.get_or_404(id)
        songs=Artist.get_songs(artist)
        return songs

# get all like count of all songs of an artist
@artist_ns.route('/artists/<int:id>/likes')
class ArtistLikesResource(Resource):
    @jwt_required()
    def get(self,id):
        """Get the total likes of an artist"""
        artist=Artist.query.get_or_404(id)
        likes=Artist.get_like_count(artist)
        return jsonify(
            {
                "likes":likes
            }
        )

# get all play count of all songs of an artist
@artist_ns.route('/artists/<int:id>/plays')
class ArtistPlaysResource(Resource):
    @jwt_required()
    def get(self,id):
        """Get the total plays of an artist"""
        artist=Artist.query.get_or_404(id)
        plays=Artist.get_play_count(artist)
        return jsonify(
            {
                "plays":plays
            }
        )

@artist_ns.route('/artist/search/<string:name>')
class ArtistSearchResource(Resource):
    @artist_ns.marshal_list_with(artist_model)
    @jwt_required()
    def get(self,name):
        """Search artists by name"""
        search_term = urllib.parse.unquote(name)
        artist=Artist.query.filter(Artist.name.like(f'%{search_term}%')).all()
        return artist

# get last id of artist in database
@artist_ns.route('/artists/last_id')
class ArtistLastIdResource(Resource):
    @jwt_required()
    def get(self):
        """Get last id of artist in database"""
        song=Artist.query.order_by(Artist.id.desc()).first()
        return jsonify(
            {
                "lastId":song.id
            }
        )

# route to upload image of an artist
@artist_ns.route('/artists/upload')
class ArtistUploadResource(Resource):
    @jwt_required()
    def post(self):
        """Upload an image of an artist"""
        from flask import current_app

        if 'image' not in request.files:
            return {'message': 'No data sent'}, 400

        image = request.files['image']
        artist_name = request.form['name']
        artist_id = request.form['artistId']

        if image.filename == '':
            return {'message': 'No file selected'}, 400
        
        if image:
            image_extension = os.path.splitext(image.filename)[1]
            
            artist_filename = artist_name + '-' + artist_id + image_extension

            secure_artist_filename = secure_filename(artist_filename)

            image.save(os.path.join('../data/images/artist', secure_artist_filename))

            return {'message': 'Image uploaded successfully'}, 200
        else:
            return {'message': 'Image upload failed'}, 400
        