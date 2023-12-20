from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from models import Song, Artist, Genre, User

history_ns = Namespace('api', description='History related operations')

# Model for the History endpoints
#===============================================================================
history_model=history_ns.model(
    "History",
    {
        "id":fields.Integer(),
        "user_id":fields.Integer(),
        "song_id":fields.Integer(),
        "date":fields.DateTime()
    }
)

@history_ns.route('/histories')
class HistoryResource(Resource):
    @history_ns.marshal_list_with(history_model)
    @jwt_required()
    def get(self):
        """Get all histories"""
        histories=History.query.all()
        return histories

    @history_ns.marshal_with(history_model)
    @jwt_required()
    def post(self):
        """Create a new history"""
        data=request.get_json()
        new_history=History(
            user_id=data.get('user_id'),
            song_id=data.get('song_id'),
            date=datetime.now()
        )

        new_history.save()
        return new_history,201

@history_ns.route('/histories/<int:id>')
class HistoryResource(Resource):
    @history_ns.marshal_with(history_model)
    @jwt_required()
    def get(self,id):
        """Get a history by id"""
        history=History.query.get_or_404(id)
        return history,200

    @history_ns.marshal_with(history_model)
    @jwt_required()
    def put(self,id):
        """Update a history by id"""
        history_to_update=History.query.get_or_404(id)
        data=request.get_json()
        history_to_update.update(
            user_id=data.get('user_id'),
            song_id=data.get('song_id'),
            date=datetime.now()
        )
        return history_to_update,201

    @history_ns.marshal_with(history_model)
    @jwt_required()
    def delete(self,id):
        """Delete a history by id"""
        history_to_delete=History.query.get_or_404(id)
        history_to_delete.delete()
        return history_to_delete,200

@history_ns.route('/histories/users/<int:user_id>')
class HistoryResource(Resource):
    @history_ns.marshal_with(history_model)
    @jwt_required()
    def get(self,user_id):
        """Get a history by user id"""
        history=History.query.filter_by(user_id=user_id).order_by(History.date.desc()).all()
        return history,200