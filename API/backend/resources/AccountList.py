from flask import Flask, request, make_response
from flask_restful import Resource, Api

from models.account import AccountsModel
from functools import wraps

app = Flask(__name__)
api = Api(app)

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if auth and auth.username == 'admin' and auth.password == 'admin':
            return f(*args, **kwargs)
        
        return make_response('Could not verify your login!', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})

    return decorated

class AccountsList(Resource):

    @auth_required
    def get(self):
        try:
            accounts = AccountsModel.getAccounts()
            acc_json = [acc.json() for acc in accounts]
            return {'accounts': acc_json}, 200 if acc_json else 404
        except Exception as e:
            return {"Internal server error": '{0}:{1}'.format(type(e), e)}, 502