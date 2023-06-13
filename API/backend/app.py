from flask import Flask, request
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_swagger_ui import get_swaggerui_blueprint

from db import db

from resources.Account import Accounts
from resources.AccountList import AccountsList
from resources.Route import Routes
from resources.RouteList import RoutesList
from resources.Login import Login
from resources.Ratings import Ratings, RatingsList
from resources.Reports import Reports, ReportsList, ReportsImage
from functools import wraps

from add_routes import db_circular_routes, db_zonas_verdas_routes
from config import config

app = Flask(__name__)
enviornment = config['development']

### swagger specific ###
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Seans-Python-Flask-REST-Boilerplate"
    }
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL, security='Bearer Auth')
### end swagger specific ###

with app.app_context():

    app.config.from_object(enviornment)
    api = Api(app)

    # db = SQLAlchemy(app)
    db.init_app(app)

    ma = Marshmallow(app)

    #Lee todas nuestras classes y crea las tablas
    db.create_all()

    @app.route("/")
    def home():
        return "Hello, TFG!"

    api.add_resource(Accounts, '/account/<string:email>', '/account')
    api.add_resource(AccountsList, '/accounts')
    api.add_resource(Login, '/login')
    api.add_resource(Routes, '/route/<string:id>', '/route')
    api.add_resource(RoutesList, '/routes')
    api.add_resource(Ratings, '/rating/<int:user_id>', '/rating')
    api.add_resource(RatingsList, '/ratings')
    api.add_resource(Reports, '/report/<int:route_id>', '/report')
    api.add_resource(ReportsList, '/reports')
    api.add_resource(ReportsImage, '/upload')
    
    if __name__ == "__main__":
        # db_circular_routes(app, db)
        # db_zonas_verdas_routes(app, db)
        app.run(port=5001, debug=False)
