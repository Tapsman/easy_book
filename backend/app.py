from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager, create_access_token,jwt_required, get_jwt_identity
import bcrypt
import os
from flask_restx import Api, Resource, fields



app = Flask(__name__)

# Setting up restplus api
api = Api(app, version='1.0', title='easy_book API', description='A simple library management API ')
ns = api.namespace('users', description='User operations')

# registration model
user_model = api.model('Register', {
    'first_name': fields.String(required=True, description='The first name of the user'),
    'last_name': fields.String(required=True, description='The last name of the user'),
    'username': fields.String(required=True, description='The username of the user'),
    'password': fields.String(required=True, description='The password of the user'),
    'role': fields.String(description='The role of the user', default='user')
})

# login model 
login_model = api.model("Login",{
    'username':fields.String(required=True, description = 'username'),
    'password':fields.String(required=True, description="password")
})

# connectiong to mysql server
app.config['MYSQL_HOST'] = 'localhost'
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "loay"
app.config["MYSQL_DB"] = "db_library"
mysql = MySQL(app)

# configurating app
app.config['SECRET_KEY'] = 'LoayAbassiTheBestInTheWorld'
app.config["JWT_SECRET_KEY"] = 'LoayAbassiTheBestInTheWorld'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)

jwt = JWTManager(app)

# register endpoint
@ns.route('/register')
class registerUser(Resource):
    @api.expect(user_model)
    def post(self):
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        username = data.get("username")
        password = data.get("password")

        role = data.get("role","user")
        full_name = f"{first_name} {last_name}"

        curs = mysql.connection.cursor()
        curs.execute("SELECT * FROM users WHERE username = %s",(username,))
        existing_user = curs.fetchone()

        if existing_user : 
            return {"message":"User already exists"},400
        
        # hashing the password
        hashed_pwd = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt()).decode("utf-8")
        print("Hashed password:", hashed_pwd)
        
        # commiting datat to the database
        curs.execute("INSERT INTO users (username,password,full_name,role) VALUES (%s, %s, %s, %s)",
                    (username,hashed_pwd,full_name,role))
        curs.connection.commit()
        curs.close()

        return {"message":"User registered successfully"}, 201

# login endpoint

@ns.route("/login")
class LoginUser(Resource):
    @api.expect(login_model)
    def post(self):
        # getting data from the request
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        # database access
        curs = mysql.connection.cursor()
        curs.execute("SELECT * FROM users WHERE username = %s",(username,))
        user = curs.fetchone()

        if not user : 
            return {"message":"Invalid username"}, 401
        
        stored_pass = user[3]
        if not stored_pass or not bcrypt.checkpw(password.encode('utf-8'), stored_pass.encode("utf-8")):
            return {"message":"Invalid password"}
        access_token = create_access_token(identity={"id":user[0],"username":user[1]}, fresh=True)
        
        return {"access_token":access_token,"message":"Login Successful"}, 200 
    

if __name__ == "__main__":
    api.add_namespace(ns)
    app.run(debug=True)

