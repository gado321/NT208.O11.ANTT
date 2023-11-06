from flask import Flask, request
from flask_restx import Api,Resource, fields
from config import DefConfig
from models import User,Artist,Album,Song,Playlist,Genre
from exts import db
import MySQLdb
from flask_migrate import Migrate


app=Flask(__name__)
app.config.from_object(DefConfig)

db.init_app(app)
migrate=Migrate(app,db)

api=Api(app,docs='/docs')

@api.route('/hello')
class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

# Model for all the endpoints (serializers)
# Model for the User endpoints
#===============================================================================
user_model=api.model(
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

@api.route('/users')
class UserResource(Resource):
    @api.marshal_list_with(user_model)
    def get(self):
        """Get all users"""
        users=User.query.all()
        return users

    @api.marshal_with(user_model)
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

@api.route('/user/<int:id>')
class UserResource(Resource):
    def get(self,id):
        """Get a user by id"""
        user=User.query.get_or_404(id)
        return user,200 

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

    def delete(self,id):
        """Delete a user by id"""
        user_to_delete=User.query.get_or_404(id)
        user_to_delete.delete()
        return user_to_delete
    
# Model for the Artist endpoints
#===============================================================================
artist_model=api.model(
    "Artist",
    {
        "id":fields.Integer(),
        "name":fields.String(),
        "picture_path":fields.String()
    }
)

@api.route('/artists')
class ArtistResource(Resource):
    @api.marshal_list_with(artist_model)
    def get(self):
        """Get all artists"""
        artists=Artist.query.all()
        return artists

    @api.marshal_with(artist_model)
    def post(self):
        """Create a new artist"""
        data=request.get_json()
        new_artist=Artist(
            name=data.get('name'),
            picture_path=data.get('picture_path')
        )

        new_artist.save()
        return new_artist,201

@api.route('/artist/<int:id>')
class ArtistResource(Resource):
    @api.marshal_with(artist_model)
    def get(self,id):
        """Get an artist by id"""
        artist=Artist.query.get_or_404(id)
        return artist,200

    @api.marshal_with(artist_model)
    def put(self,id):
        """Update an artist by id"""
        artist_to_update=Artist.query.get_or_404(id)
        data=request.get_json()
        artist_to_update.update(
            name=data.get('name'),
            picture_path=data.get('picture_path')
        )
        return artist_to_update,201

    @api.marshal_with(artist_model)
    def delete(self,id):
        """Delete an artist by id"""
        artist_to_delete=Artist.query.get_or_404(id)
        artist_to_delete.delete()
        return artist_to_delete

# Model for the Album endpoints
#===============================================================================
album_model=api.model(
    "Album",
    {
        "id":fields.Integer(),
        "artist_id":fields.Integer(),
        "name":fields.String(),
        "release_date":fields.Date()
    }
)

@api.route('/albums')
class AlbumResource(Resource):
    @api.marshal_list_with(album_model)
    def get(self):
        """Get all albums"""
        albums=Album.query.all()
        return albums

    @api.marshal_with(album_model)
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

@api.route('/album/<int:id>')
class AlbumResource(Resource):
    @api.marshal_with(album_model)
    def get(self,id):
        """Get an album by id"""
        album=Album.query.get_or_404(id)
        return album,200

    @api.marshal_with(album_model)
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

    @api.marshal_with(album_model)
    def delete(self,id):
        """Delete an album by id"""
        album_to_delete=Album.query.get_or_404(id)
        album_to_delete.delete()
        return album_to_delete

# Model for the Song endpoints
#===============================================================================
song_model=api.model(
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

@api.route('/songs')
class SongResource(Resource):
    @api.marshal_list_with(song_model)
    def get(self):
        """Get all songs"""
        songs=Song.query.all()
        return songs

    @api.marshal_with(song_model)
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

@api.route('/song/<int:id>')
class SongResource(Resource):
    @api.marshal_with(song_model)
    def get(self,id):
        """Get a song by id"""
        song=Song.query.get_or_404(id)
        return song,200

    @api.marshal_with(song_model)
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

    @api.marshal_with(song_model)
    def delete(self,id):
        """Delete a song by id"""
        song_to_delete=Song.query.get_or_404(id)
        song_to_delete.delete()
        return song_to_delete

# Model for the Playlist endpoints
#===============================================================================
playlist_model=api.model(
    "Playlist",
    {
        "id":fields.Integer(),
        "user_id":fields.Integer(),
        "name":fields.String(),
        "picture_path":fields.String(),
        "thumbnail_path":fields.String()
    }
)

@api.route('/playlists')
class PlaylistResource(Resource):
    @api.marshal_list_with(playlist_model)
    def get(self):
        """Get all playlists"""
        playlists=Playlist.query.all()
        return playlists

    @api.marshal_with(playlist_model)
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

@api.route('/playlist/<int:id>')
class PlaylistResource(Resource):
    @api.marshal_with(playlist_model)
    def get(self,id):
        """Get a playlist by id"""
        playlist=Playlist.query.get_or_404(id)
        return playlist,200

    @api.marshal_with(playlist_model)
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

    @api.marshal_with(playlist_model)
    def delete(self,id):
        """Delete a playlist by id"""
        playlist_to_delete=Playlist.query.get_or_404(id)
        playlist_to_delete.delete()
        return playlist_to_delete

# Model for the Genre endpoints
#===============================================================================
genres_model=api.model(
    "Genre",
    {
        "id":fields.Integer(),
        "name":fields.String()
    }
)

@api.route('/genres')
class GenreResource(Resource):
    @api.marshal_list_with(genres_model)
    def get(self):
        """Get all genres"""
        genres=Genre.query.all()
        return genres

    @api.marshal_with(genres_model)
    def post(self):
        """Create a new genre"""
        data=request.get_json()
        new_genre=Genre(
            name=data.get('name')
        )

        new_genre.save()
        return new_genre,201

@api.route('/genre/<int:id>')
class GenreResource(Resource):
    @api.marshal_with(genres_model)
    def get(self,id):
        """Get a genre by id"""
        genre=Genre.query.get_or_404(id)
        return genre,200

    @api.marshal_with(genres_model)
    def put(self,id):
        """Update a genre by id"""
        genre_to_update=Genre.query.get_or_404(id)
        data=request.get_json()
        genre_to_update.update(
            name=data.get('name')
        )
        return genre_to_update,201

    @api.marshal_with(genres_model)
    def delete(self,id):
        """Delete a genre by id"""
        genre_to_delete=Genre.query.get_or_404(id)
        genre_to_delete.delete()
        return genre_to_delete

    
@app.shell_context_processor
def make_shell_context():
    return dict(
        db=db,
        User=User
    )

if __name__=='__main__':
    app.run()