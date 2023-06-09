from flask_restful import Resource, reqparse
from models.account import AccountsModel

class Login(Resource):

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help="This field cannot be left blank")
        parser.add_argument('password', type=str, required=True, help="This field cannot be left blank")

        data = parser.parse_args()

        acc = AccountsModel.find_by_email(data['email'])

        if acc:
            try:
                if acc.verify_password(data['password']):
                    return {"message": "Logged in", 'account': acc.json()}, 200
                else:
                    return {"message": "Invalid password"}, 400
            except:
                return {"message": "Internal server error"}, 500
        else:
            return {"message": "User doesn't exist"}, 400
