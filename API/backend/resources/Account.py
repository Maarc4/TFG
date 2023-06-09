from flask_restful import Resource, reqparse

from models.account import AccountsModel


class Accounts(Resource):

    def get(self, email):
        account = AccountsModel.find_by_email(email)
        return {'account': account.json()}, 200 if account else 404

    def post(self):
        parser = reqparse.RequestParser()  # Create parameters parser from request

        parser.add_argument('name', type=str, required=True,
                            help="Field name cannot be left blank")
        parser.add_argument('email', type=str, required=True,
                            help="Field email cannot be left blank")
        parser.add_argument('edat', type=int, required=False,
                            help="Field age is an integer")
        parser.add_argument('password', type=str, required=True,
                            help="Field password cannot be left blank")

        data = parser.parse_args()

        if (AccountsModel.find_by_email(data['email'])):
            return {"message": "Aquest correu ja está registrat"}, 400
        else:
            new_user = AccountsModel(
                data['name'], data['email'], data['edat'], data['password'])
            new_user.hash_password(data['password'])
            new_user.save_to_db()

            if (new_user):
                return new_user.json(), 200
            else:
                return 404

    def put(self, email):
        parser = reqparse.RequestParser()

        # Define the expected request parameters
        parser.add_argument('name', type=str, required=False)
        parser.add_argument('email', type=str, required=False)
        parser.add_argument('edat', type=int, required=False)
        parser.add_argument('password', type=str, required=False)
        parser.add_argument('n_completed_routes', type=int, required=False)
        parser.add_argument('n_saved_routes', type=int, required=False)

        data = parser.parse_args()

        try:
            # Check if the account exists
            account = AccountsModel.find_by_email(email)
            print(type(account.n_saved_routes))
            print(account.json())
            print(data)

            if not account:
                return {'message': 'Account not found'}, 404
            # Update the n_completed_routes field if present
            if data.get('n_completed_routes'):
                account.n_completed_routes += data['n_completed_routes']
            if data.get('n_saved_routes'):
                account.n_saved_routes += data['n_saved_routes']
            else:
                # Update the account fields if present
                if data.get('name'):
                    account.name = data['name']
                if data.get('email'):
                    account.email = data['email']
                if data.get('edat'):
                    account.edat = data['edat']
                if data.get('password'):
                    account.hash_password(data['password'])

            # Save the updated account to the database
            account.save_to_db()

            # Return the updated account as JSON
            return account.json(), 200

        except Exception as e:
            return {"Unexpected error, review your params request": '{0}:{1}'.format(type(e), e)}, 400

    def delete(self):
        parser = reqparse.RequestParser()

        parser.add_argument('email', type=str, required=True, help="This field cannot be left blanck")
        parser.add_argument('password', type=str, required=True, help="This field cannot be left blanck")

        data = parser.parse_args()

        try:
            account_to_delete = AccountsModel.find_by_email(data['email'])
            if account_to_delete is not None:
                if account_to_delete.verify_password(data['password']):
                    account_to_delete.delete_from_db()
                    return {'account': account_to_delete.json()}, 200
                else:
                    return {'account': {}}, 400
            else:
                return {'Incorrect data': {}}, 400

        except Exception as e:
            return {"Unexpected error, review your params request" : {}}, 400      
        

       

