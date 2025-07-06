'''from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy.orm import DeclarativeBase

# SQLAlchemy setup
class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Configure Flask-Login
login_manager = LoginManager() '''

from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()  # Remove `model_class=Base`

# Configure Flask-Login
login_manager = LoginManager()
