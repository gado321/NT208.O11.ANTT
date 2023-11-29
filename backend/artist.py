from flask import Flask, request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from models import Artist

artist_ns = Namespace('artist', description='Artist related operations')

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

@artist_ns.route('/artist/<int:id>')
class ArtistResource(Resource):
    @artist_ns.marshal_with(artist_model)
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
    def delete(self,id):
        """Delete an artist by id"""
        artist_to_delete=Artist.query.get_or_404(id)
        artist_to_delete.delete()
        return artist_to_delete