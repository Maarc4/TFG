

class Config:
    pass

class ProductionConfig(Config):
    DEBUG = False
    #SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:Alczn!99@database-1.cumvig2rjkfh.eu-west-1.rds.amazonaws.com:5432/TFG'
    SQLALCHEMY_DATABASE_URI = ''
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "5c017d0641e0d405eeb6515a"


class DevelopmentConfig(Config):
        DEBUG = True
        SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:marctfg@34.175.208.8/tfg_api'
        SQLALCHEMY_TRACK_MODIFICATIONS = False
        SECRET_KEY = "5c017d0641e0d405eeb6515a"

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}