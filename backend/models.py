from exts import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False)
    last_login = db.Column(db.DateTime)
    is_premium = db.Column(db.Boolean, nullable=False)
    picture_path = db.Column(db.String(255))
    gender = db.Column(db.String(255))
    date_of_birth = db.Column(db.Date)
    
    genres = db.relationship('Genre', secondary='user_genre', backref=db.backref('users', lazy='dynamic'))
    liked_songs = db.relationship('Song', secondary='user_song', backref=db.backref('liked_users', lazy='dynamic'))
    liked_artists = db.relationship('Artist', secondary='user_artist', backref=db.backref('liked_users', lazy='dynamic'))
    histories = db.relationship('History', backref='user', lazy='dynamic')

    def __repr__(self):
        return f"<User {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, email, password, is_admin, last_login, is_premium, picture_path, gender, date_of_birth):
        self.name = name
        self.email = email
        self.password = password
        self.is_admin = is_admin
        self.last_login = last_login
        self.is_premium = is_premium
        self.picture_path = picture_path
        self.gender = gender
        self.date_of_birth = date_of_birth
        db.session.commit()
        return self

    # add and remove liked song to user
    def add_liked_song(self, song):
        if not self.is_liked_song_added(song):
            self.liked_songs.append(song)
            db.session.commit()
    
    def remove_liked_song(self, song):
        if self.is_liked_song_added(song):
            self.liked_songs.remove(song)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}
    
    def is_liked_song_added(self, song):
        return any(s.id == song.id for s in self.liked_songs)

    def get_liked_songs(self):
        return self.liked_songs

    # add and remove liked artist to user
    def add_liked_artist(self, artist):
        if not self.is_liked_artist_added(artist):
            self.liked_artists.append(artist)
            db.session.commit()
    
    def remove_liked_artist(self, artist):
        if self.is_liked_artist_added(artist):
            self.liked_artists.remove(artist)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}
    
    def is_liked_artist_added(self, artist):
        return any(a.id == artist.id for a in self.liked_artists)

    def get_liked_artists(self):
        return self.liked_artists
    
    # add and remove genre to user
    def add_genre(self, genre):
        if not self.is_genre_added(genre):
            self.genres.append(genre)
            db.session.commit()

    def remove_genre(self, genre):
        if self.is_genre_added(genre):
            self.genres.remove(genre)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}
    
    def is_genre_added(self, genre):
        return any(g.id == genre.id for g in self.genres)
    

class Artist(db.Model):
    __tablename__ = 'artists'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    picture_path = db.Column(db.String(255))

    songs = db.relationship('Song', secondary='song_artist', backref=db.backref('artists', lazy='dynamic'))

    def __repr__(self):
        return f"<Artist {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return self
    
    def update(self, name, picture_path):
        self.name = name
        self.picture_path = picture_path
        db.session.commit()
        return self

    # add and remove song to artist
    def add_song(self, song):
        if not self.is_song_added(song):
            self.songs.append(song)
            db.session.commit()

    def remove_song(self, song):
        if self.is_song_added(song):
            self.songs.remove(song)
            db.session.commit()

    def is_song_added(self, song):
        return any(a.id == song.id for a in self.songs)

    # add and remove liked user to artist
    def add_liked_user(self, user):
        if not self.is_liked_user_added(user):
            self.liked_users.append(user)
            db.session.commit()
    
    def remove_liked_user(self, user):
        if self.is_liked_user_added(user):
            self.liked_users.remove(user)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}
    
    def is_liked_user_added(self, user):
        return any(u.id == user.id for u in self.liked_users)

    # get all song by artist
    def get_songs(self):
        return self.songs

    # get all like count of all songs of an artist
    def get_like_count(self):
        return sum(song.likes for song in self.songs)

    # get all play count of all songs of an artist
    def get_play_count(self):
        return sum(song.play_count for song in self.songs)
    

class Album(db.Model):
    __tablename__ = 'albums'
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    release_date = db.Column(db.Date)

    songs = db.relationship('Song', secondary='album_song', backref=db.backref('albums', lazy='dynamic'))

    def __repr__(self):
        return f"<Album {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return self
    
    def update(self, artist_id, name, release_date):
        self.artist_id = artist_id
        self.name = name
        self.release_date = release_date
        db.session.commit()
        return self

    # add and remove song to album
    def add_song(self, song):
        if song.artists and any(artist.id == self.artist_id for artist in song.artists):
            if not self.is_song_added(song):
                self.songs.append(song)
                db.session.commit()
                return {"status": "success"}
            else:
                return {"status": "info"}
        else:
            return {"status": "error"}

    def remove_song(self, song):
        if self.is_song_added(song):
            self.songs.remove(song)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}

    def is_song_added(self, song):
        return any(a.id == song.id for a in self.songs)

    # random album with a liked artist


class Song(db.Model):
    __tablename__ = 'songs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    likes = db.Column(db.Integer)
    play_count = db.Column(db.Integer)
    path = db.Column(db.String(255))
    picture_path = db.Column(db.String(255))
    release_date = db.Column(db.Date)

    playlists = db.relationship('Playlist', secondary='playlist_song', backref=db.backref('songs', lazy='dynamic'))
    genres = db.relationship('Genre', secondary='song_genre', backref=db.backref('songs', lazy='dynamic'))
    histories = db.relationship('History', backref='song', lazy='dynamic')

    def __repr__(self):
        return f"<Song {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return self
    
    def update(self, **kwargs):
        for key, value in kwargs.items():
            # Only update attributes that are part of the model and not None
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)
        db.session.commit()
        return self

    # add and remove artist to song
    def add_artist(self, artist):
        if not self.is_artist_added(artist):
            self.artists.append(artist)
            db.session.commit()

    def remove_artist(self, artist):
        if self.is_artist_added(artist):
            self.artists.remove(artist)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}

    def is_artist_added(self, artist):
        return any(a.id == artist.id for a in self.artists)

    # add and remove genre to song
    def add_genre(self, genre):
        if not self.is_genre_added(genre):
            self.genres.append(genre)
            db.session.commit()

    def remove_genre(self, genre):
        if self.is_genre_added(genre):
            self.genres.remove(genre)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}
    
    def is_genre_added(self, genre):
        return any(g.id == genre.id for g in self.genres)

    # add and remove album to song
    def add_album(self, album):
        if not self.is_album_added(album):
            self.albums.append(album)
            db.session.commit()

    def remove_album(self, album):
        if self.is_album_added(album):
            self.albums.remove(album)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}
    
    def is_album_added(self, album):
        return any(a.id == album.id for a in self.albums)

    # add and remove liked user to song
    def add_liked_user(self, user):
        if not self.is_liked_user_added(user):
            self.liked_users.append(user)
            db.session.commit()
    
    def remove_liked_user(self, user):
        if self.is_liked_user_added(user):
            self.liked_users.remove(user)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}
    
    def is_liked_user_added(self, user):
        return any(u.id == user.id for u in self.liked_users)

class Playlist(db.Model):
    __tablename__ = 'playlists'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    picture_path = db.Column(db.String(255))
    thumbnail_path = db.Column(db.String(255))

    def __repr__(self):
        return f"<Playlist {self.name}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return self
    
    def update(self, user_id, name, picture_path, thumbnail_path):
        self.user_id = user_id
        self.name = name
        self.picture_path = picture_path
        self.thumbnail_path = thumbnail_path
        db.session.commit()
        return self

    # add and remove song to playlist
    def add_song(self, song):
        if not self.is_song_added(song):
            self.songs.append(song)
            db.session.commit()
    
    def remove_song(self, song):
        if self.is_song_added(song):
            self.songs.remove(song)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}
    
    def is_song_added(self, song):
        return any(s.id == song.id for s in self.songs)

class Genre(db.Model):
    __tablename__ = 'genres'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<Genre {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return self
    
    def update(self, name):
        self.name = name
        db.session.commit()
        return self

    # add and remove song to genre
    def add_song(self, song):
        if not self.is_song_added(song):
            self.songs.append(song)
            db.session.commit()
    
    def remove_song(self, song):
        if self.is_song_added(song):
            self.songs.remove(song)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}
    
    def is_song_added(self, song):
        return any(s.id == song.id for s in self.songs)

    # add and remove user to genre
    def add_user(self, user):
        if not self.is_user_added(user):
            self.users.append(user)
            db.session.commit()
    
    def remove_user(self, user):
        if self.is_user_added(user):
            self.users.remove(user)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "info"}
    
    def is_user_added(self, user):
        return any(u.id == user.id for u in self.users)

    # get all song by genre
    def get_songs(self):
        return self.songs

class History(db.Model):
    __tablename__ = 'histories'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), nullable=False)
    played_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<History {self.id}>"

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return self
    
    def update(self, user_id, song_id, date):
        self.user_id = user_id
        self.song_id = song_id
        self.date = date
        db.session.commit()
        return self

class SongArtist(db.Model):
    __tablename__ = 'song_artist'
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), primary_key=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'), primary_key=True)

class PlaylistSong(db.Model):
    __tablename__ = 'playlist_song'
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), primary_key=True)

class UserGenre(db.Model):
    __tablename__ = 'user_genre'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.id'), primary_key=True)

# Liked artists by user
class UserArtist(db.Model):
    __tablename__ = 'user_artist'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'), primary_key=True)

# Liked song by user
class UserSong(db.Model):
    __tablename__ = 'user_song'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), primary_key=True)

class SongGenre(db.Model):
    __tablename__ = 'song_genre'
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), primary_key=True)
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.id'), primary_key=True)

class AlbumSong(db.Model):
    __tablename__ = 'album_song'
    album_id = db.Column(db.Integer, db.ForeignKey('albums.id'), primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), primary_key=True)