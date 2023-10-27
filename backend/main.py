from flask import Flask
from flask_restx import Api,Resource
from config import DefConfig
from flask_cors import CORS

def create_app():
    app=Flask(__name__)
    app.config.from_object(DefConfig)

    CORS(app)
    
    api=Api(app,docs='/docs')
    return app

@api.route('/hello')
class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}


if __name__=='__main__':
    create_app.run()