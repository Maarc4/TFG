from http import HTTPStatus

from flask_restful import Resource, reqparse
from sqlalchemy import exc

from models.reports import *
from models.route import RoutesModel


class Reports(Resource):

    def get(self, route_id):
        route = RoutesModel.find_by_id(route_id)
        if route is None:
            return {'message': f'No existeix una ruta amb el id [{route_id}]'}, HTTPStatus.NOT_FOUND
        reports = ReportModel.get_by_route_id(route_id)
        return {"reports_list": [x.json() for x in reports]}, HTTPStatus.OK

    def post(self):
        # get the arguments
        data = self.get_data()
        route = RoutesModel.find_by_id(data['route_id'])

        if route is None:  # return error message if route doesn't exist
            return {'message': f'No existeix una ruta amb el id [{data["route_id"]}]'}, HTTPStatus.NOT_FOUND

        try:
            new_report = ReportModel(
                route_id=data['route_id'],
                report_type=data['report_type'],
                comment=data['comment'],
                coordenadas=data['coordenadas']
            )
            print(new_report.json())
            new_report.save_to_db()
            return new_report.json(), HTTPStatus.OK
        except exc.IntegrityError as err:
            print(err)
            db.session.rollback()
            return {'message': 'Report already exists'}, HTTPStatus.CONFLICT
        except exc.SQLAlchemyError as err:
            print(err)
            db.session.rollback()
            return {'message': 'error while saving new report'}, HTTPStatus.INTERNAL_SERVER_ERROR

    def get_data(self):
        parser = reqparse.RequestParser()  # Create parameters parser from request

        parser.add_argument('route_id', type=str, required=True,
                            help="Field email cannot be left blank")
        parser.add_argument('coordenadas', type=str, required=True,
                            help="Field coordenadas cannot be left blank")
        parser.add_argument('report_type', type=str, required=True,
                            help="Field report_type cannot be left blank")
        parser.add_argument('comment', type=str, required=False,
                            help="Field comment cannot be left blank")

        return parser.parse_args()


class ReportsList(Resource):
    def get(self):
        reports = ReportModel.get_all()
        return {"reports_list": [x.json() for x in reports]}, HTTPStatus.OK
