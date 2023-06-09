from datetime import datetime
from sqlalchemy.sql import func, desc

from db import db
from models.account import AccountsModel
from models.route import RoutesModel


class RatingsModel(db.Model):

    __tablename__ = 'ratings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey(
        'routes.id'), nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(500))
    date = db.Column(db.DateTime(), nullable=False, server_default=func.now())

    def __init__(self, user_id, route_id, stars, comment):
        self.user_id = user_id
        self.route_id = route_id
        self.stars = stars
        self.comment = comment
        self.date = datetime.utcnow()

    def json(self):
        return {'id': self.id,
                'user_id': self.user_id,
                'route_name': RoutesModel.find_by_id(self.route_id).json()["name"],
                'route_id': RoutesModel.find_by_id(self.route_id).json()["id"],
                'stars': self.stars,
                'comment': self.comment,
                'date': self.date.strftime('%Y-%m-%d %H:%M')}

    # Métodes auxiliars
    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).all()

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(user_id=email).all()

    @classmethod
    def get_by_route_id(cls, route_id):
        query = cls.query.filter_by(route_id=route_id)
        return query.order_by(desc(cls.date)).all()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def update_db(self):
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
