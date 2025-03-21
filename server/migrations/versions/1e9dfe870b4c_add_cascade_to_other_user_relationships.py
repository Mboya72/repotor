"""Add cascade to other user relationships

Revision ID: 1e9dfe870b4c
Revises: 37926d3ea4a5
Create Date: 2025-03-02 19:25:30.711218

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1e9dfe870b4c'
down_revision = '37926d3ea4a5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bookmarks', schema=None) as batch_op:
        batch_op.drop_constraint('fk_bookmarks_user_id_users', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_bookmarks_user_id_users'), 'users', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.drop_constraint('fk_comments_user_id_users', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_comments_user_id_users'), 'users', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('follows', schema=None) as batch_op:
        batch_op.drop_constraint('fk_follows_follower_id_users', type_='foreignkey')
        batch_op.drop_constraint('fk_follows_followed_id_users', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_follows_followed_id_users'), 'users', ['followed_id'], ['id'], ondelete='CASCADE')
        batch_op.create_foreign_key(batch_op.f('fk_follows_follower_id_users'), 'users', ['follower_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('records', schema=None) as batch_op:
        batch_op.drop_constraint('fk_records_user_id_users', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_records_user_id_users'), 'users', ['user_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('records', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_records_user_id_users'), type_='foreignkey')
        batch_op.create_foreign_key('fk_records_user_id_users', 'users', ['user_id'], ['id'])

    with op.batch_alter_table('follows', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_follows_follower_id_users'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_follows_followed_id_users'), type_='foreignkey')
        batch_op.create_foreign_key('fk_follows_followed_id_users', 'users', ['followed_id'], ['id'])
        batch_op.create_foreign_key('fk_follows_follower_id_users', 'users', ['follower_id'], ['id'])

    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_comments_user_id_users'), type_='foreignkey')
        batch_op.create_foreign_key('fk_comments_user_id_users', 'users', ['user_id'], ['id'])

    with op.batch_alter_table('bookmarks', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_bookmarks_user_id_users'), type_='foreignkey')
        batch_op.create_foreign_key('fk_bookmarks_user_id_users', 'users', ['user_id'], ['id'])

    # ### end Alembic commands ###
