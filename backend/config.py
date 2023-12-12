from decouple import config
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY=config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS=config('SQLALCHEMY_TRACK_MODIFICATIONS',cast=bool)

class DevConfig(Config):
    DEBUG=True
    SQLALCHEMY_DATABASE_URI=config('SQLALCHEMY_DATABASE_URI')
    SQLACHEMY_ECHO=True 

class ProdConfig(Config):
    pass

class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI=config('SQLALCHEMY_DATABASE_URI')
    SQLACHEMY_ECHO=False
    TESTING=True