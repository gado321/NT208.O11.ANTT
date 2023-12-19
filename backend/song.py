from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required
from models import Song, Artist, Genre, User
import urllib.parse
import os

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
            likes=0,
            play_count=0,
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

@song_ns.route('/songs/search/<string:name>')
class SongSearchResource(Resource):
    @song_ns.marshal_list_with(song_model)
    def get(self,name):
        """Search artists by name"""
        search_term = urllib.parse.unquote(name)
        songs=Song.query.filter(Song.name.like(f'%{search_term}%')).all()
        return songs

# route for random 2 songs with genre
@song_ns.route('/songs/random_with_genre/<int:genre_id>')
class SongRandomWithGenreResource(Resource):
    @song_ns.marshal_list_with(song_model)
    def get(self,genre_id):
        """Get random 2 songs with a genre id"""
        songs=Song.query.filter(Song.genres.any(id=genre_id)).order_by(Song.id.desc()).all()
        # random 2 songs in songs list
        import random
        random.shuffle(songs)
        return songs[:2]

# route for get all artists of a song
@song_ns.route('/songs/<int:id>/artists')
class SongArtistsResource(Resource):
    def get(self,id):
        """Get all artists of a song"""
        song=Song.query.get_or_404(id)
        artists=song.artists
        return jsonify(
            [
                {
                    "id":artist.id,
                    "name":artist.name,
                    "picture_path":artist.picture_path
                } for artist in artists
            ]
        )

# route for get all genres of a song
@song_ns.route('/songs/<int:id>/genres')
class SongGenresResource(Resource):
    def get(self,id):
        """Get all genres of a song"""
        song=Song.query.get_or_404(id)
        genres=song.genres
        return jsonify(
            [
                {
                    "id":genre.id,
                    "name":genre.name
                } for genre in genres
            ]
        )

# route to upload a song and picture of a song
@song_ns.route('/songs/upload')
class SongUploadResource(Resource):
    @jwt_required()
    def post(self):
        """Upload a song and its image with a custom name"""
        from flask import current_app
        
        # check if the post request has the file part
        if 'file' not in request.files or 'image' not in request.files:
            return {'message': 'No data sent'}, 400
        
        file = request.files['file']
        image = request.files['image']
        song_name = request.form['name']
        song_id = request.form['songId']

        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return {'message': 'No selected file'}, 400
        if image.filename == '':
            return {'message': 'No selected image'}, 400

        if file and image:
            # Generate new filenames based on the song name
            song_extension = os.path.splitext(file.filename)[1]
            image_extension = os.path.splitext(image.filename)[1]
            
            song_filename = song_name + '-' + song_id + song_extension
            image_filename = song_name + '-' + song_id + image_extension

            secure_song_filename = secure_filename(song_filename)
            secure_image_filename = secure_filename(image_filename)

            # Save the files
            file.save(os.path.join('../data/songs', secure_song_filename))
            image.save(os.path.join('../data/images/song', secure_image_filename))
            
            return {'message': 'Data uploaded successfully'}, 201
        else:
            return {'message': 'Data upload failed'}, 400

# get last id of song in database
@song_ns.route('/songs/last_id')
class SongLastIdResource(Resource):
    @jwt_required()
    def get(self):
        """Get last id of song in database"""
        song=Song.query.order_by(Song.id.desc()).first()
        return jsonify(
            {
                "lastId":song.id
            }
        )