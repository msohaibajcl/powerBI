from flask import Flask,jsonify,request,redirect
import mysql.connector as mysql
from cryptography.fernet import Fernet
from flask_cors import CORS
import json
from datetime import datetime
import random
import os
from werkzeug.utils import secure_filename
import pandas as pd
from werkzeug.utils import secure_filename
import numpy as np
from datetime import date as dateLib

app=Flask(__name__)
db_name = "bd"
db_password = "Sohaib023612"
db_user = "root"
db_host = "127.0.0.1"
key=b'i3vVJAiA2-e6JIBoTBwvmQNmTXvVhbr60p5jOYVRVws='

CORS(app)

def database():
    db = mysql.connect(host=db_host, user=db_user, passwd=db_password, database=db_name)
    cursor=db.cursor(buffered=True)
    return db,cursor

@app.route("/api/bd/signin/",methods=["GET","POST"])
def signin():
    db,cursor=database()
    data=request.get_data()
    data = json.loads(data)
    query="select id,name,password,domain from users where email=%s"
    cursor.execute(query,(data["email"],))
    result=cursor.fetchone()
    if result:
        if result[2]==data["password"]: 
            query2="update users set status=%s where email=%s"
            cursor.execute(query2,("active",data["email"]))
            db.commit()
            query3="select link from links where domain=%s"
            cursor.execute(query3,(result[3],))
            result2=cursor.fetchone()
            links=""
            if result[3]=="all":
                temp=result2[0]
                links=temp.split(",")
            else:
                links=result2[0]
            return jsonify({"response":"success","name":result[1],"link":links,"domain":result[3]})
        else:
            return jsonify({"response":"Invalid Password"})
    else:
        return jsonify({"response":"Invalid Username or Password"})

@app.route("/api/bd/logout/",methods=["GET","POST"])
def logout():
    db,cursor=database()
    data=request.get_data()
    data = json.loads(data)
    query2="update users set status=%s where email=%s"
    cursor.execute(query2,("inactive",data["email"]))
    db.commit()
    return jsonify({"response":"success"})

if __name__=="__main__":
    app.run(port=7702,debug=True)