from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager, create_access_token,jwt_required, get_jwt_identity
import bcrypt
import os
app = Flask(__name__)

# connectiong to mysql server
app.config['MYSQL_HOST'] = 'localhost'
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "loay"
app.config["MYSQL_DB"] = "db_library"
mysql = MySQL(app)

# configurating jwt
app.config["JWT_SECRET_KEY"]= os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

@app.route("/register",methods = ["POST"])
def register():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    username = data.get("username")
    password = data.get("password")

    role = data.get("role","user")
    full_name = f"{first_name} {last_name}"
    

@app.route("/")
def home():
    return 'hello mate'



if __name__ == "__main__":
    app.run(debug=True)

