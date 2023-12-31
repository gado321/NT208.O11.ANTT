"""update relationship

Revision ID: 8144765329ee
Revises: 
Create Date: 2023-11-29 11:39:09.856211

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '8144765329ee'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('album_song', schema=None) as batch_op:
        batch_op.alter_column('album_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('song_id',
               existing_type=mysql.INTEGER(),
               nullable=False)

    with op.batch_alter_table('albums', schema=None) as batch_op:
        batch_op.alter_column('artist_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)

    with op.batch_alter_table('artists', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)

    with op.batch_alter_table('genres', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)

    with op.batch_alter_table('playlist_song', schema=None) as batch_op:
        batch_op.alter_column('playlist_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('song_id',
               existing_type=mysql.INTEGER(),
               nullable=False)

    with op.batch_alter_table('playlists', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)

    with op.batch_alter_table('song_artist', schema=None) as batch_op:
        batch_op.alter_column('song_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('artist_id',
               existing_type=mysql.INTEGER(),
               nullable=False)

    with op.batch_alter_table('song_genre', schema=None) as batch_op:
        batch_op.alter_column('song_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('genre_id',
               existing_type=mysql.INTEGER(),
               nullable=False)

    with op.batch_alter_table('songs', schema=None) as batch_op:
        batch_op.alter_column('album_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)

    with op.batch_alter_table('user_artist', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('artist_id',
               existing_type=mysql.INTEGER(),
               nullable=False)

    with op.batch_alter_table('user_genre', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('genre_id',
               existing_type=mysql.INTEGER(),
               nullable=False)

    with op.batch_alter_table('user_song', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('song_id',
               existing_type=mysql.INTEGER(),
               nullable=False)

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)
        batch_op.alter_column('email',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)
        batch_op.alter_column('password',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)
        batch_op.alter_column('is_admin',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=False)
        batch_op.alter_column('is_premium',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=False)
        batch_op.create_unique_constraint(None, ['email'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.alter_column('is_premium',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=True)
        batch_op.alter_column('is_admin',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=True)
        batch_op.alter_column('password',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)
        batch_op.alter_column('email',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)

    with op.batch_alter_table('user_song', schema=None) as batch_op:
        batch_op.alter_column('song_id',
               existing_type=mysql.INTEGER(),
               nullable=True)
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    with op.batch_alter_table('user_genre', schema=None) as batch_op:
        batch_op.alter_column('genre_id',
               existing_type=mysql.INTEGER(),
               nullable=True)
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    with op.batch_alter_table('user_artist', schema=None) as batch_op:
        batch_op.alter_column('artist_id',
               existing_type=mysql.INTEGER(),
               nullable=True)
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    with op.batch_alter_table('songs', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)
        batch_op.alter_column('album_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    with op.batch_alter_table('song_genre', schema=None) as batch_op:
        batch_op.alter_column('genre_id',
               existing_type=mysql.INTEGER(),
               nullable=True)
        batch_op.alter_column('song_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    with op.batch_alter_table('song_artist', schema=None) as batch_op:
        batch_op.alter_column('artist_id',
               existing_type=mysql.INTEGER(),
               nullable=True)
        batch_op.alter_column('song_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    with op.batch_alter_table('playlists', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    with op.batch_alter_table('playlist_song', schema=None) as batch_op:
        batch_op.alter_column('song_id',
               existing_type=mysql.INTEGER(),
               nullable=True)
        batch_op.alter_column('playlist_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    with op.batch_alter_table('genres', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)

    with op.batch_alter_table('artists', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)

    with op.batch_alter_table('albums', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)
        batch_op.alter_column('artist_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    with op.batch_alter_table('album_song', schema=None) as batch_op:
        batch_op.alter_column('song_id',
               existing_type=mysql.INTEGER(),
               nullable=True)
        batch_op.alter_column('album_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###
