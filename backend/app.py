from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager, create_access_token,jwt_required, get_jwt_identity
import bcrypt
import os
from flask_restx import Api, Resource, fields



app = Flask(__name__)

# Setting up restplus api
api = Api(app, version='1.0', title='easy_book API', description='managing library with ease',security=[{'BearerAuth':[]}])
ns = api.namespace('user', description='Users')
ns2 = api.namespace('book', description='Books')

# registration model
user_model = api.model('Register', {
    'first_name': fields.String(required=True, description='The first name of the user'),
    'last_name': fields.String(required=True, description='The last name of the user'),
    'username': fields.String(required=True, description='The username of the user'),
    'password': fields.String(required=True, description='The password of the user'),
    'role': fields.String(description='The role of the user', default='user'),
    'image': fields.String(description='Profile image URL'),
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
        image = data.get("image")

        curs = mysql.connection.cursor()
        curs.execute("SELECT * FROM users WHERE username = %s",(username,))
        existing_user = curs.fetchone()

        if existing_user : 
            return {"message":"User already exists"},400
        
        # hashing the password
        hashed_pwd = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt()).decode("utf-8")
        
        # commiting datat to the database
        print(image)
        curs.execute("INSERT INTO users (username, password, full_name, role, image) VALUES (%s, %s, %s, %s, %s)",
                     (username, hashed_pwd, full_name, role, image))
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

# specific user details 
@ns.route("/details/<int:user_id>")
class UserInfo(Resource):

    #@jwt_required()
    def get(self,user_id):
        #current_user = get_jwt_identity()
        #if current_user["id"]!=user_id and current_user["role"]!=user_id:
        #    return {"message": "Unauthorized access."}, 403
    
        curs = mysql.connection.cursor()
        curs.execute("SELECT id, username, full_name, role, image, borrowed_books FROM users WHERE id = %s", (user_id,))
        user_data = curs.fetchone()

        if not user_data:
            return {"message": "User not found."}, 404

        return {
            "id": user_data[0],
            "username": user_data[1],
            "full_name": user_data[2],
            "role": user_data[3], 
            "image":user_data[4],
            "borrowed_books":user_data[5]
        }, 200

# listing paginated users
@ns.route("/list")
class GetUsers(Resource):
    #@jwt_required()
    def get(self):
        # setting page, limit offset
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        offset = (page - 1) * limit
        
        # Fetch users with pagination
        curs = mysql.connection.cursor()
        curs.execute("SELECT id, username, full_name, role, image FROM users WHERE role='user' LIMIT %s OFFSET %s", (limit, offset))
        users = curs.fetchall()
        
        if not users:
            return {"message": "No users found."}, 404

        user_list = []
        for user in users:
            user_list.append({
                "id": user[0],
                "username": user[1],
                "full_name": user[2],
                "role": user[3],
                "image": user[4]
            })

        return {"users": user_list, "page": page, "limit": limit}, 200

@ns.route("/<int:user_id>")
class DeleteUser(Resource):
    @jwt_required()
    def delete(self, user_id):
        current_user = get_jwt_identity()

        if current_user["role"] != "staff":
            return {"message": "Unauthorized access."}, 403
        
        curs = mysql.connection.cursor()
        curs.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = curs.fetchone()

        if not user:
            return {"message": "User not found."}, 404

        curs.execute("DELETE FROM users WHERE id = %s", (user_id,))
        mysql.connection.commit()
        curs.close()

        return {"message": "User deleted successfully."}, 200


if __name__ == "__main__":
    api.add_namespace(ns)
    api.add_namespace(ns2)
    app.run(debug=True)

