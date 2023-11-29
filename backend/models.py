from exts import db

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

    artists = db.relationship('Artist', secondary='user_artist', backref=db.backref('users', lazy='dynamic'))
    genres = db.relationship('Genre', secondary='user_genre', backref=db.backref('users', lazy='dynamic'))

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

class Song(db.Model):
    __tablename__ = 'songs'
    id = db.Column(db.Integer, primary_key=True)
    album_id = db.Column(db.Integer, db.ForeignKey('albums.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    likes = db.Column(db.Integer)
    play_count = db.Column(db.Integer)
    path = db.Column(db.String(255))
    picture_path = db.Column(db.String(255))
    release_date = db.Column(db.Date)

    playlists = db.relationship('Playlist', secondary='playlist_song', backref=db.backref('songs', lazy='dynamic'))
    genres = db.relationship('Genre', secondary='song_genre', backref=db.backref('songs', lazy='dynamic'))

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
    
    def update(self, album_id, name, likes, play_count, path, picture_path, release_date):
        self.album_id = album_id
        self.name = name
        self.likes = likes
        self.play_count = play_count
        self.path = path
        self.picture_path = picture_path
        self.release_date = release_date
        db.session.commit()
        return self

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

class UserArtist(db.Model):
    __tablename__ = 'user_artist'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'), primary_key=True)

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