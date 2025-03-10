from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure the SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///inputs.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Define the database model
class Input(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100), nullable=False, unique=True)

# Create the database and tables (run this once at startup)
with app.app_context():
    db.create_all()

@app.route("/", methods=["GET", "POST"])
def index():
    message = ""
    
    if request.method == "POST":
        action = request.form.get("action")
        text = request.form.get("text")
        
        if action == "add":
            if not Input.query.filter_by(text=text).first():  # Avoid duplicates
                new_input = Input(text=text)
                db.session.add(new_input)
                db.session.commit()
                message = f"'{text}' added!"
            else:
                message = f"'{text}' already exists!"
        elif action == "delete":
            input_to_delete = Input.query.filter_by(text=text).first()
            if input_to_delete:
                db.session.delete(input_to_delete)
                db.session.commit()
                message = f"'{text}' deleted!"
            else:
                message = f"'{text}' not found!"

    # Retrieve all inputs from the database
    inputs = Input.query.all()
    return render_template("index.html", inputs=inputs, message=message)

if __name__ == "__main__":
    app.run(debug=True)
