from main import create_app
from config import DevConfig
from flask_cors import CORS

if __name__=='__main__':
    app=create_app(DevConfig)
    CORS(app, origins='http://127.0.0.1:3000')
    app.run()