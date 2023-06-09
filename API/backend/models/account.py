import datetime
from passlib.apps import custom_app_context as pwd_context

from db import db

class AccountsModel(db.Model):

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    name = db.Column(db.String(100))
    edat = db.Column(db.Integer)
    password = db.Column(db.String(400))
    n_completed_routes = db.Column(db.Integer, default=0)
    n_saved_routes = db.Column(db.Integer, default=0)
    last_reset_date = db.Column(db.Date, default=datetime.date.today())

    def __init__(self, name, email, edat, password):
        self.name = name
        self.email = email
        self.edat = edat
        self.password = password

    def json(self):
        self.reset_n_completed_routes()
        return {'id': self.id, 'name': self.name, 'email': self.email, 'edat': self.edat, 'completed_routes_week':self.n_completed_routes, 'n_saved_routes':self.n_saved_routes}

    def reset_n_completed_routes(self):
        if datetime.date.today() > self.last_reset_date + datetime.timedelta(days=7):
            self.n_completed_routes = 0
            self.last_reset_date = datetime.date.today()
            self.save_to_db()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def update_db(self):
        db.session.commit()
    
    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    #Métodes auxiliars
    @classmethod
    def find_by_id(cls, user_id):
        return cls.query.get(user_id)
    @classmethod
    def find_by_email(cls, email):
        return cls.query.get(email)

    @classmethod
    def getAccounts(cls):
        return db.session.query(AccountsModel).all()

    def hash_password(self, password):
        self.password = pwd_context.encrypt(password)

    def verify_password(self, passwordHash):
        return pwd_context.verify(passwordHash, self.password)