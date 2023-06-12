
import os

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

        # Get the current script's directory
        current_directory = os.path.dirname(os.path.abspath(__file__))

        # Specify the filename of the CA certificate
        ca_cert_filename = "DigiCertGlobalRootCA.crt.pem"

        # Construct the full path to the CA certificate file
        ca_cert_path = os.path.join(current_directory, ca_cert_filename)
        
        SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://marc:ewyttfg.2023@everywalkyoutake-api.mysql.database.azure.com:3306/tfg?ssl_ca={ca_cert_path}"
        # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:marctfg@34.175.208.8/tfg_api'
        SQLALCHEMY_TRACK_MODIFICATIONS = False
        SECRET_KEY = "5c017d0641e0d405eeb6515a"

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}