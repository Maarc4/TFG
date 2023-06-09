from http import HTTPStatus

from flask_restful import Resource, reqparse
from sqlalchemy import exc

from models.ratings import *
from models.account import AccountsModel
from models.route import RoutesModel


class Ratings(Resource):

    def get(self, user_id):
        account = AccountsModel.find_by_id(user_id)
        # return account if it exists
        if account is None:
            return {'message': f'No existeix un compte amb el id [{user_id}]'}, HTTPStatus.NOT_FOUND
        ratings = RatingsModel.get_by_id(user_id)
        return {"ratings_list": [x.json() for x in ratings]}, HTTPStatus.OK

    def post(self):
        # get the arguments
        data = self.get_data()
        account = AccountsModel.find_by_id(data['user_id'])
        route = RoutesModel.find_by_id(data['route_id'])

        if account is None:  # return error message if account doesn't exist
            return {'message': f'No existeix un compte amb el correu [{data["user_id"]}]'}, HTTPStatus.NOT_FOUND

        if route is None:  # return error message if route doesn't exist
            return {'message': f'No existeix una ruta amb el id [{data["route_id"]}]'}, HTTPStatus.NOT_FOUND

        try:
            new_rating = RatingsModel(
                user_id=data['user_id'],
                route_id=data['route_id'],
                stars=data['stars'],
                comment=data['comment']
            )
            print(new_rating.json())
            new_rating.save_to_db()
            return new_rating.json(), HTTPStatus.OK
        except exc.IntegrityError as err:
            print(err)
            db.session.rollback()
            return {'message': 'Rating already exists'}, HTTPStatus.CONFLICT
        except exc.SQLAlchemyError as err:
            print(err)
            db.session.rollback()
            return {'message': 'error while saving new rating'}, HTTPStatus.INTERNAL_SERVER_ERROR

    def get_data(self):
        parser = reqparse.RequestParser()  # Create parameters parser from request

        parser.add_argument('user_id', type=str, required=True,
                            help="Field user_id cannot be left blank")
        parser.add_argument('route_id', type=str, required=True,
                            help="Field route_id cannot be left blank")
        parser.add_argument('stars', type=int, required=True,
                            help="Field stars is an integer")
        parser.add_argument('comment', type=str, required=False,
                            help="Field comment cannot be left blank")

        return parser.parse_args()


class RatingsList(Resource):
    def get(self):
        ratings = RatingsModel.get_all()
        return {"ratings_list": [x.json() for x in ratings]}, HTTPStatus.OK
