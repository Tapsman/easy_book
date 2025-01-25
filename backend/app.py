from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager, create_access_token,jwt_required, get_jwt_identity
import bcrypt
import os
import datetime
from flask_restx import Api, Resource, fields
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}},supports_credentials=True)

USER_UPLOAD_FOLDER = 'static/user_images/'
BOOK_UPLOAD_FOLDER = 'static/book_images/'
CATEGORY_UPLOAD_FOLDER = 'static/category_images/'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['USER_UPLOAD_FOLDER'] = USER_UPLOAD_FOLDER
app.config['BOOK_UPLOAD_FOLDER'] = BOOK_UPLOAD_FOLDER
app.config['CATEGORY_UPLOAD_FOLDER'] = CATEGORY_UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Setting up restplus api
api = Api(app, version='1.0', title='easy_book API', description='managing library with ease',security=[{'BearerAuth':[]}])
users = api.namespace('users', description='Users operations')
books = api.namespace('books', description='Books operations')
categories = api.namespace('categories', description='categories operations')



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

# users
# registration model
user_model = api.model('Register', {
    'first_name': fields.String(required=True, description='The first name of the user'),
    'last_name': fields.String(required=True, description='The last name of the user'),
    'username': fields.String(required=True, description='The username of the user'),
    'password': fields.String(required=True, description='The password of the user'),
    'role': fields.String(description='The role of the user', default='user'),
    'image': fields.String(description='Image of the category'),

})

# login model 
login_model = api.model("Login",{
    'username':fields.String(required=True, description = 'username'),
    'password':fields.String(required=True, description="password")
})

# register endpoint
@users.route('/register')
class registerUser(Resource):
    @api.expect(user_model)
    def post(self):
        data = request.form.to_dict()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        username = data.get("username")
        password = data.get("password")
        role = data.get("role","user")
        full_name = f"{first_name} {last_name}"

        # image processing 
        image = request.files.get("image")
        image_path = None


        if image:
            image_filename = f"{username}_{secure_filename(image.filename)}"
            image_path = os.path.join(app.config['USER_UPLOAD_FOLDER'], image_filename)
            print(image_path)
            os.makedirs(app.config['USER_UPLOAD_FOLDER'], exist_ok=True)
            image.save(image_path)

        curs = mysql.connection.cursor()
        curs.execute("SELECT * FROM users WHERE username = %s",(username,))
        existing_user = curs.fetchone()

        if existing_user : 
            return {"message":"User already exists"},400
        
        # hashing the password
        hashed_pwd = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt()).decode("utf-8")
        
        # commiting datat to the database
        curs.execute("INSERT INTO users (username, password, full_name, role, image) VALUES (%s, %s, %s, %s, %s)",
                     (username, hashed_pwd, full_name, role, image_path))
        curs.connection.commit()
        curs.close()

        return {"message":"User registered successfully"}, 201

# login endpoint
@users.route("/login")
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
            return {"message":"Invalid password"}, 401
        access_token = create_access_token(identity={"id":user[0],"role":user[4]}, fresh=True)
        
        return {"access_token":access_token,"message":"Login Successful"}, 200 

# specific user details 
@users.route("/details/<int:user_id>")
class GetUser(Resource):

    #@jwt_required()
    def get(self,user_id):
        #current_user = get_jwt_identity()
        #if current_user["id"]!=user_id and current_user["role"]!="admin":
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
@users.route("/list")
class ListUsers(Resource):
    #@jwt_required()
    def get(self):
        # setting page, limit offset
        #current_user = get_jwt_identity()
        #if current_user["role"]!="admin":
        #    return {"message": "Unauthorized access."}, 403
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

# delete user endpoint
@users.route("/delete/<int:user_id>")
class DeleteUser(Resource):
    #@jwt_required()
    def delete(self, user_id):
        #current_user = get_jwt_identity()

        #if current_user["role"] != "admin":
        #    return {"message": "Unauthorized access."}, 403
        
        curs = mysql.connection.cursor()
        curs.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = curs.fetchone()

        if not user:
            return {"message": "User not found."}, 404

        curs.execute("DELETE FROM users WHERE id = %s", (user_id,))
        mysql.connection.commit()
        curs.close()

        return {"message": "User deleted successfully."}, 200

# update user endpoint
@users.route("/update/<int:user_id>",methods=["PUT"])
class UpdateUser(Resource):
    #@jwt_required()
    def put(self,user_id):
        #current_user = get_jwt_identity()
        #if current_user["role"]!="admin" and current_user["id"]!=user_id:
        #    return {"message":"unauthorized operation."}, 403
        
        data = request.form.to_dict()
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        old_password = data.get("old_password")
        new_password = data.get("new_password")
        image = request.files.get("image")
        image_path = None

        updates = []
        values = []

        # Check if old and new passwords are provided
        if old_password and new_password:
            curs = mysql.connection.cursor()
            curs.execute("SELECT password FROM users WHERE id = %s", (user_id,))
            current_password = curs.fetchone()

            if current_password and bcrypt.checkpw(old_password.encode("utf-8"), current_password[0].encode("utf-8")):
                # Hash the new password
                hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
                updates.append("password = %s")
                values.append(hashed_password)
            else:
                return {"message": "Old password is incorrect."}, 400
        elif old_password or new_password:
            return {"message": "Both old and new passwords must be provided."}, 400

        # Concatenate first_name and last_name for full_name
        if first_name and last_name:
            full_name = f"{first_name} {last_name}"
            updates.append("full_name = %s")
            values.append(full_name)
        
        # Handle image upload if provided
        if image:
            image_filename = f"{user_id}_{secure_filename(image.filename)}"
            image_path = os.path.join(app.config["USER_UPLOAD_FOLDER"], image_filename)
            os.makedirs(app.config["USER_UPLOAD_FOLDER"], exist_ok=True)
            image.save(image_path)
            updates.append("image = %s")
            values.append(image_path)

        # If no updates were provided, return an error
        if not updates:
            return {"message": "No data provided."}, 400

        # Prepare and execute the update query
        update_query = "UPDATE users SET " + ", ".join(updates) + " WHERE id = %s"
        values.append(user_id)

        curs.execute(update_query, values)
        mysql.connection.commit()
        curs.close()

        return {"message": "User updated successfully."}, 200

# books
# Book model
book_model = api.model('Book', {
    'title': fields.String(required=True, description='The title of the book'),
    'description': fields.String(description='The description of the book'),
    'image': fields.String(description='Image of the book'),
    'quantity': fields.Integer(description='The quantity of books', default=1),
    'category_id':fields.Integer(description='The quantity of books', default=1),
})

# add book endpoint
@books.route('/add')
class AddBook(Resource):
    @api.expect(book_model)  
    #@jwt_required()
    def post(self):
        #current_user = get_jwt_identity()
        #if current_user["role"] != "admin":
        #    return {"message": "Unauthorized access."}, 403
        
        data = request.form.to_dict()

        title = data.get("title")
        description = data.get("description", "")
        quantity = data.get("quantity", 1)
        category_id = data.get("category_id")

        # image processing 
        image = request.files.get("image")
        image_path = None


        if image:
            image_filename = f"{title}_{secure_filename(image.filename)}"
            image_path = os.path.join(app.config['BOOK_UPLOAD_FOLDER'], image_filename)
            
            os.makedirs(app.config['BOOK_UPLOAD_FOLDER'], exist_ok=True)
            image.save(image_path)
        
        if not title:
            return {"message": "Title is required."}, 400

        # Insert book into the database
        curs = mysql.connection.cursor()
        curs.execute(
            "INSERT INTO books (title, description, image, quantity, category_id) VALUES (%s, %s, %s, %s, %s)",
            (title, description, image_path, quantity, category_id),
        )
        mysql.connection.commit()
        curs.close()

        return {"message": "Book added successfully."}, 201

@books.route('/list', methods=['GET'])
class ListBooks(Resource):
    def get(self):
        curs = mysql.connection.cursor()
        try:
            # Get page and limit from query parameters, default to page 1 and limit 10
            page = int(request.args.get("page", 1))
            limit = int(request.args.get("limit", 10))
            offset = (page - 1) * limit

            # Fetch books with pagination
            curs.execute("SELECT id, title, description, image, quantity FROM books LIMIT %s OFFSET %s", (limit, offset))
            books = curs.fetchall()

            # Check if books exist
            if books:
                books = [{"id": row[0], "title": row[1], "description": row[2], "image": row[3], "quantity": row[4]} for row in books]
                return {"books": books, "page": page, "limit": limit}, 200

            return {"message": "No books found."}, 404
        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500
        finally:
            curs.close()
# edit book
@books.route('/update/<int:book_id>', methods=['PUT'])
class UpdateBook(Resource):
    def put(self, book_id):
        data = request.form.to_dict()
        title = data.get("title")
        description = data.get("description")
        quantity = data.get("quantity")
        image = request.files.get("image")
        
        if not title or not description or not quantity:
            return {"message": "Title, description, and quantity are required."}, 400

        image_filename = None
        if image:
            image_filename = f"book_{title}_{secure_filename(image.filename)}"
            image_path = os.path.join(app.config['BOOK_UPLOAD_FOLDER'], image_filename)
            os.makedirs(app.config['BOOK_UPLOAD_FOLDER'], exist_ok=True)
            image.save(image_path)

        curs = mysql.connection.cursor()
        try:
            curs.execute(
                "UPDATE books SET title=%s, description=%s, quantity=%s, image=%s WHERE id=%s",
                (title, description, quantity, image_filename, book_id)
            )
            mysql.connection.commit()
            return {"message": "Book updated successfully."}, 200
        except Exception as e:
            mysql.connection.rollback()
            return {"message": f"Error: {str(e)}"}, 500
        finally:
            curs.close()

# details
@books.route('/<int:book_id>')
class BookDetail(Resource):
    def get(self, book_id):
        curs = mysql.connection.cursor()

        try:
            curs.execute("""
                SELECT b.id, b.title, b.description, b.quantity, c.name AS category_name, b.image
                FROM books b
                LEFT JOIN categories c ON b.category_id = c.id
                WHERE b.id = %s
            """, (book_id,))
            book = curs.fetchone()

            if not book:
                return {"message": "Book not found"}, 404

            return {
                "id": book[0],
                "title": book[1],
                "description": book[2],
                "quantity": book[3],
                "category_name": book[4],  
                "image": book[5]
            }, 200

        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500

        finally:
            curs.close()

# delete book
@books.route('/delete/<int:book_id>', methods=['DELETE'])
class DeleteBook(Resource):
    def delete(self, book_id):
        curs = mysql.connection.cursor()

        try:
            curs.execute("DELETE FROM books WHERE id = %s", (book_id,))
            mysql.connection.commit()

            if curs.rowcount == 0:
                return {"message": "Book not found"}, 404

            return {"message": "Book deleted successfully."}, 200

        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500

        finally:
            curs.close()

# borrow book 
@books.route('/borrow', methods=['POST'])
class BorrowBook(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get("user_id")
        book_id = data.get("book_id")

        if not user_id or not book_id:
            return {"message": "User ID and Book ID are required."}, 400

        curs = mysql.connection.cursor()

        # Check if the book is available
        curs.execute("SELECT id, quantity FROM books WHERE id = %s", (book_id,))
        book = curs.fetchone()

        if not book:
            return {"message": "Book not found."}, 404
        
        if book[1] <= 0:
            return {"message": "Book is out of stock."}, 400

        # Check if the user exists
        curs.execute("SELECT borrowed_books FROM users WHERE id = %s", (user_id,))
        user = curs.fetchone()

        if not user:
            return {"message": "User not found."}, 404

        borrowed_books = json.loads(user[0] or '[]')  # Load list from JSON or empty array

        # Check if the user has already borrowed 3 books
        if len(borrowed_books) >= 3:
            return {"message": "You can borrow a maximum of 3 books."}, 400

        # Check if the user has already borrowed this book
        if book_id in borrowed_books:
            return {"message": "You have already borrowed this book."}, 400

        # Check if there is an existing 'borrowed' transaction for this user and book
        curs.execute(
            "SELECT id FROM transactions WHERE user_id = %s AND book_id = %s AND status = 'borrowed'",
            (user_id, book_id)
        )
        existing_transaction = curs.fetchone()

        if existing_transaction:
            return {"message": "Transaction already exists for this book."}, 400

        borrowed_books.append(book_id)
        curs.execute(
            "UPDATE users SET borrowed_books = %s WHERE id = %s",
            (json.dumps(borrowed_books), user_id)
        )

        # Decrease the quantity of the book in stock
        curs.execute(
            "UPDATE books SET quantity = quantity - 1 WHERE id = %s",
            (book_id,)
        )

        # Add a new transaction for borrowing the book
        transaction_date = datetime.datetime.now()
        curs.execute(
            "INSERT INTO transactions (user_id, book_id, status, transaction_date) VALUES (%s, %s, 'borrowed', %s)",
            (user_id, book_id, transaction_date)
        )
        mysql.connection.commit()
        
        curs.close()

        return {"message": "Book borrowed successfully."}, 200

# return book endpoint
@books.route('/return', methods=['POST'])
class ReturnBook(Resource):
    def post(self):
        data = request.json
        user_id = data.get("user_id")
        book_id = data.get("book_id")
        
        if not user_id or not book_id:
            return {"message": "User ID and Book ID are required."}, 400

        curs = mysql.connection.cursor()
        try:
            curs.execute("SELECT borrowed_books FROM users WHERE id = %s", (user_id,))
            user = curs.fetchone()
            if not user:
                return {"message": "User not found."}, 404
            
            borrowed_books = json.loads(user[0] or '[]')

            if book_id not in borrowed_books:
                return {"message": "Book not borrowed by the user."}, 400
            
            borrowed_books.remove(book_id)
            curs.execute(
                "UPDATE users SET borrowed_books = %s WHERE id = %s",
                (json.dumps(borrowed_books), user_id)
            )

            curs.execute(
                "UPDATE books SET quantity = quantity + 1 WHERE id = %s",
                (book_id,)
            )

            curs.execute(
                """
                UPDATE transactions
                SET status = 'returned', return_date = NOW()
                WHERE user_id = %s AND book_id = %s AND status = 'borrowed'
                """,
                (user_id, book_id)
            )

            mysql.connection.commit()
            return {"message": "Book returned successfully."}, 200

        except Exception as e:
            mysql.connection.rollback()
            return {"message": f"Error: {str(e)}"}, 500
        finally:
            curs.close()

# categories
category_model =api.model('category', {
    'name': fields.String(required=True, description='category name'),
    'description': fields.String(description='The description of the catgory'),
    'image': fields.String(description='Image of the category'),

})

# add
@categories.route('/add')
class AddCategory(Resource):
    @api.expect(category_model)
    def post(self):
        data = request.form.to_dict()
        name = data.get("name")
        description = data.get("description")
        image = request.files.get("image")

        if not name or not description:
            return {"message": "Name and description are required."}, 400

        image_filename = None
        if image:
            image_filename = f"{name}_{secure_filename(image.filename)}"
            image_path = os.path.join(app.config['CATEGORY_UPLOAD_FOLDER'], image_filename)
            
            os.makedirs(app.config['CATEGORY_UPLOAD_FOLDER'], exist_ok=True)

            image.save(image_path)
            image_path = os.path.join(app.config['CATEGORY_UPLOAD_FOLDER'], image.filename)


        curs = mysql.connection.cursor()
        try:
            curs.execute(
                "INSERT INTO categories (name, description, image) VALUES (%s, %s, %s)",
                (name, description, image_path)
            )
            mysql.connection.commit()
            return {"message": "Category added successfully."}, 201
        except Exception as e:
            mysql.connection.rollback()
            return {"message": f"Error: {str(e)}"}, 500
        finally:
            curs.close()

# list
@categories.route('/list', methods=['GET'])
class ListCategories(Resource):
    def get(self):
        curs = mysql.connection.cursor()

        try:
            curs.execute("SELECT id, name, description, image FROM categories")
            categories = curs.fetchall()

            categories_list = []
            for category in categories:
                categories_list.append({
                    'id': category[0],
                    'name': category[1],
                    'description': category[2],
                    'image': category[3]
                })

            return {"categories": categories_list}, 200

        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500

        finally:
            curs.close()

# update
@categories.route('/update/<int:category_id>', methods=['PUT'])
class UpdateCategory(Resource):
    def put(self, category_id):
        data = request.form.to_dict()
        name = data.get("name")
        description = data.get("description")
        image = request.files.get("image")

        if not name or not description:
            return {"message": "Name and description are required."}, 400

        image_filename = None
        if image:
            image_filename = f"{name}_{secure_filename(image.filename)}"
            image_path = os.path.join(app.config['CATEGORY_UPLOAD_FOLDER'], image_filename)
            os.makedirs(app.config['CATEGORY_UPLOAD_FOLDER'], exist_ok=True)
            image.save(image_path)
            image_path = os.path.join(app.config['CATEGORY_UPLOAD_FOLDER'], image.filename)


        curs = mysql.connection.cursor()
        try:
            if image_filename:
                curs.execute(
                    "UPDATE categories SET name=%s, description=%s, image=%s WHERE id=%s",
                    (name, description, image_path, category_id)
                )
            else:
                curs.execute(
                    "UPDATE categories SET name=%s, description=%s WHERE id=%s",
                    (name, description, category_id)
                )
            mysql.connection.commit()
            return {"message": "Category updated successfully."}, 200

        except Exception as e:
            mysql.connection.rollback()
            return {"message": f"Error: {str(e)}"}, 500

        finally:
            curs.close()

@categories.route('/detail/<int:category_id>', methods=['GET'])
class CategoryDetail(Resource):
    def get(self, category_id):
        curs = mysql.connection.cursor()
        try:
            curs.execute("SELECT id, name, description, image FROM categories WHERE id = %s", (category_id,))
            category = curs.fetchone()

            if not category:
                return {"message": "Category not found."}, 404

            category_data = {
                "id": category[0],
                "name": category[1],
                "description": category[2],
                "image": category[3] if category[3] else None,  
                }
            return {"category": category_data}, 200

        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500

        finally:
            curs.close()


if __name__ == "__main__":
    api.add_namespace(users)
    api.add_namespace(books)
    app.run(debug=True)

