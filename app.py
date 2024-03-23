import os
from os.path import join, dirname
from dotenv import load_dotenv
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

app = Flask(__name__)

@app.route('/')
def home():
   return render_template('index.html')

@app.route("/mars", methods=["POST"])
def mars_post():
    name_receive = request.form["name_give"]
    address_receive = request.form["address_give"]
    size_receive = request.form["size_give"]

    count = db.marsfields.count_documents({})
    current_time = datetime.now()
    num = count + 1
    doc = {
        'num':num,
        'name': name_receive,
        'address':address_receive,
        'size': size_receive,
        'created_at': current_time,
    }
    db.marsfields.insert_one(doc)
    return jsonify({'msg':'Data Berhasil Disimpan'})

@app.route("/mars", methods=["GET"])
def mars_get():
    field_list = list(db.marsfields.find({},{'_id':False}))
    return jsonify({'marsfields':field_list})


if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)