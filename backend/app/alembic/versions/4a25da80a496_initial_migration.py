"""initial migration

Revision ID: 4a25da80a496
Revises: 
Create Date: 2024-10-11 16:31:22.565721

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '4a25da80a496'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('poll',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('description', sqlmodel.sql.sqltypes.AutoString(length=1024), nullable=False),
    sa.Column('is_private', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('creator_email', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('start_time', sa.DateTime(), nullable=False),
    sa.Column('end_time', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('polloption',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('poll_id', sa.Uuid(), nullable=False),
    sa.Column('option_text', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('total_votes', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['poll_id'], ['poll.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('rollrange',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('start', sa.Integer(), nullable=False),
    sa.Column('end', sa.Integer(), nullable=False),
    sa.Column('poll_id', sa.Uuid(), nullable=False),
    sa.ForeignKeyConstraint(['poll_id'], ['poll.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('vote',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('option_id', sa.Uuid(), nullable=False),
    sa.Column('voter_email_hash', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['option_id'], ['polloption.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_vote_id'), 'vote', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_vote_id'), table_name='vote')
    op.drop_table('vote')
    op.drop_table('rollrange')
    op.drop_table('polloption')
    op.drop_table('poll')
    # ### end Alembic commands ###
