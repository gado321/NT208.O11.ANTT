from flask import Flask, jsonify, request
from flask_restx import Api, Resource, fields
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import MySQLdb

from config import DevConfig
from models import User, Artist, Album, Song, Playlist, Genre
from exts import db
from auth import auth_ns
from user import user_ns
from artist import artist_ns
from album import album_ns
from song import song_ns
from playlist import playlist_ns
from genre import genre_ns

def create_app(config):
    app=Flask(__name__)
    app.config.from_object(config)
    CORS(app)
    db.init_app(app)
    migrate=Migrate(app,db)
    bcrypt = Bcrypt(app)
    JWTManager(app)

    api=Api(app,doc='/docs')
    api.add_namespace(auth_ns)
    api.add_namespace(user_ns)
    api.add_namespace(artist_ns)
    api.add_namespace(album_ns)
    api.add_namespace(song_ns)
    api.add_namespace(playlist_ns)
    api.add_namespace(genre_ns)
        
    @app.shell_context_processor
    def make_shell_context():
        return {
            "db":db,
            "User":User,
            "Artist":Artist,
            "Album":Album,
            "Song":Song,
            "Playlist":Playlist,
            "Genre":Genre
        }

    return app