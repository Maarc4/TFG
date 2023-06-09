from datetime import datetime

from sqlalchemy.sql import func, desc

from db import db
from models.route import RoutesModel


class ReportModel(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    route_id = db.Column(db.Integer, db.ForeignKey(
        'routes.id'), nullable=False)
    report_type = db.Column(db.String(100), nullable=False)
    comment = db.Column(db.String(500))
    coordenadas = db.Column(db.Text())
    date = db.Column(db.DateTime(), nullable=False, server_default=func.now())

    def __init__(self, route_id, report_type, comment, coordenadas):
        self.route_id = route_id
        self.report_type = report_type
        self.comment = comment
        self.coordenadas = coordenadas
        self.date = datetime.utcnow()

    def json(self):
        return {
            'id': self.id,
            'route_id': RoutesModel.find_by_id(self.route_id).json()["id"],
            'report_type': self.report_type,
            'coordenadas': self.coordenadas,
            'comment': self.comment,
            'date': self.date.strftime('%Y-%m-%d %H:%M')
        }

    # Métodes auxiliars

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).all()

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
