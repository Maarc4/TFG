from flask import Flask
from flask_restful import Resource, Api, reqparse

from models.route import RoutesModel

app = Flask(__name__)
api = Api(app)

class Routes(Resource):

    def get(self, id):
        route = RoutesModel.find_by_id(id)
        return {'route' + id: route.json()}, 200 if route else 404

    def post(self):
        parser = reqparse.RequestParser() #Create parameters parser from request

        parser.add_argument('name', type=str, required=True, help="Field name cannot be left blank")
        parser.add_argument('level', type=str, required=True, help="Field level cannot be left blank")
        parser.add_argument('activity', type=str, required=True, help="Field activity cannot be left blank")
        parser.add_argument('distance', type=int, required=True, help="Field distance cannot be left blank")
        parser.add_argument('type', type=str, required=True, help="Field type cannot be left blank") #Circular, ida y vuelta, punto a punto
        parser.add_argument('coordinates', type=str, required=True, help="Field coordinates cannot be left blank")
        parser.add_argument('elevation', type=float, required=True, help="Field elevation cannot be left blank")
        parser.add_argument('health_type', type=str, required=True, help="Field health_type cannot be left blank")

        data = parser.parse_args()

        if (RoutesModel.find_by_name(data['name'])):
            return {"message": "Aquesta ruta ja está guardada a la base de dades"}
        else:
            new_route = RoutesModel(data['name'], data['level'], data['activity'], data['distance'], data['type'], data['coordinates'], data['elevation'], data['health_type'])
            new_route.save_to_db()

        if(new_route):
            return new_route.json()
        else:
            return 404

