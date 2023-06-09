from flask import Flask
from flask_restful import Resource, Api, request

from models.route import RoutesModel

app = Flask(__name__)
api = Api(app)

class RoutesList(Resource):

    def get(self):
        level = request.args.get('level') #Create parameters parser from request
        health_type = request.args.get('health_type')
        coords = request.args.get('coords')

        print(level, health_type, coords)

        if (level and health_type):
            if health_type == 'AUTO': 
                route = RoutesModel.generate_auto_route(level, coords)
                return {'routes': [route]}, 200 if route else 400
            else:
                routes = RoutesModel.find_by_level_and_health(level, health_type)
        elif (level and not health_type):
            routes = RoutesModel.find_by_level(level)
        elif (not level and health_type):
            if health_type == 'AUTO':
                route = RoutesModel.generate_auto_route(level=None, coords=coords)
                return {'routes': [route]}, 200 if route else 400
            else:
                routes = RoutesModel.find_by_health(health_type)
        else:
            routes = RoutesModel.getRoutes()
        
        route_json = [route.json() for route in routes]
        return {'routes': route_json}, 200 if route_json else 204