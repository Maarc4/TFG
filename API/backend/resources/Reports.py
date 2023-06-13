from http import HTTPStatus
import os 

from flask_restful import Resource, reqparse
from flask import request
from sqlalchemy import exc
from azure.storage.blob import BlobServiceClient, ContentSettings

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
                coordenadas=data['coordenadas'],
                image_url = data['image_url']
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
        parser.add_argument('image_url', type=str, required=False,
                    help="Field photo cannot be left blank")

        return parser.parse_args()



class ReportsList(Resource):
    def get(self):
        reports = ReportModel.get_all()
        return {"reports_list": [x.json() for x in reports]}, HTTPStatus.OK

class ReportsImage(Resource):
    def post(self):
        try:
            print("IN REPORTS IMAGE")
            image_file = request.files['image']

            connect_str = "DefaultEndpointsProtocol=https;AccountName=retroaccionsfotos;AccountKey=pnZExBXhHLsnEfwW4W1xWz5IMSPa6d6mPAoAY+7Yo6vzKB8pN3s3zVZ1fjmTB78zaRxZq+54qiMC+AStFP6SkA==;EndpointSuffix=core.windows.net"
            container_name = "fotos"

            blob_service_client = BlobServiceClient.from_connection_string(connect_str)
            container_client = blob_service_client.get_container_client(container_name)

        # with open(file_uri[7:], 'rb') as data:
            content_settings = ContentSettings(content_type='image/jpeg')
            container_client.upload_blob(name=image_file.filename, data=image_file, content_settings=content_settings)

            blob_url = f"https://retroaccionsfotos.blob.core.windows.net/{container_name}/{image_file.filename}"
            return blob_url
        except Exception as e:
            # Handle any errors that occur during image upload or processing
            print(e)
            return 'Error occurred during image upload'

