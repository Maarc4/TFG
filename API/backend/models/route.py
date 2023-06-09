from db import db
import geopy.distance
import json


class RoutesModel(db.Model):

    __tablename__ = 'routes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    level = db.Column(db.String(100))
    activity = db.Column(db.String(100))  # Paseo/correr
    distance = db.Column(db.Float)
    type = db.Column(db.String(100))  # Circular/ida y vuelta
    coordinates = db.Column(db.Text())
    elevation = db.Column(db.Float)
    health_type = db.Column(db.String(100))

    def __init__(self, name, level, activity, distance, type, coordinates, elevation, health_type):
        self.name = name
        self.level = level
        self.activity = activity
        self.distance = distance
        self.type = type
        self.coordinates = coordinates
        self.elevation = elevation
        self.health_type = health_type

    def json(self):
        return {'id': self.id, 'name': self.name, 'level': self.level, 'activity': self.activity, 'distance': self.distance, 'type': self.type, 'coordinates': self.coordinates, 'elevation': self.elevation, 'health_type': self.health_type}

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def update_db(self):
        db.session.commit()

    # Métodes auxiliars
    @classmethod
    def find_by_id(cls, id):
        return db.session.query(RoutesModel).filter_by(id=id).first()

    @classmethod
    def find_by_level_and_health(cls, level, health_type):
        return db.session.query(RoutesModel).filter_by(level=level, health_type=health_type).order_by(RoutesModel.id).all()

    @classmethod
    def find_by_level(cls, level):
        return db.session.query(RoutesModel).filter_by(level=level).order_by(RoutesModel.id).all()

    @classmethod
    def find_by_health(cls, health_type):
        return db.session.query(RoutesModel).filter_by(health_type=health_type).order_by(RoutesModel.id).all()

    @classmethod
    def find_by_name(cls, name):
        return db.session.query(RoutesModel).filter_by(name=name).first()

    @classmethod
    def getRoutes(cls):
        return db.session.query(RoutesModel).order_by(RoutesModel.id).all()

    @classmethod
    def generate_auto_route(cls, level, coords):
        if level:
            routes = db.session.query(RoutesModel).filter_by(level=level, health_type='ZONES VERDES').all()
            # Miramos las mas cercanas segun el nivel
            routes_json = [route.json() for route in routes]
            nearest = routes_json[0]
            minDistance = 999
            #coords = [json.loads(coords)[0], json.loads(coords)[0][1]]
            coords = json.loads(coords)
            for i in range(1, len(routes_json)):
                new_coordinates = json.loads(routes_json[i]['coordinates'])[0]
                distance = geopy.distance.geodesic(coords , new_coordinates).km

                if distance < minDistance:
                    minDistance = distance
                    nearest = routes_json[i]

            # Afegim a la distancia de la ruta l'anada i tornada des de la posicio actual
            nearest['distance'] += geopy.distance.geodesic(coords , json.loads(nearest['coordinates'])[0]).km
            nearest['distance'] += geopy.distance.geodesic(coords , json.loads(nearest['coordinates'])[0]).km
            return nearest

        else:
            routes = db.session.query(RoutesModel).filter_by(health_type='ZONES VERDES').all()
            # Miramos las mas cercanas de cualquier nivel
            routes_json = [route.json() for route in routes]
            nearest = routes_json[0]
            minDistance = 999
            #coords = [json.loads(coords)[0], json.loads(coords)[0][1]]
            coords = json.loads(coords)
            for i in range(1, len(routes_json)):
                new_coordinates = json.loads(routes_json[i]['coordinates'])[0]
                distance = geopy.distance.geodesic(coords , new_coordinates).km

                if distance < minDistance:
                    minDistance = distance
                    nearest = routes_json[i]

            return nearest
