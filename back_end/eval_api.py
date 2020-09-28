from flask import Flask
from flask_cors import CORS
from scrapinghub import ScrapinghubClient
import re
import csv
import pandas as pd
from flask import send_file, send_from_directory
import os
import boto3
import json
import time
import requests





def load_transactions(dynamodb,user,data):
    data = json.loads(data)
    print(data[1])
    table = dynamodb.Table('askit_eval')
    eval = {}
    eval['User'] = user
    for i in range(len(data)):
        for k in range(10):
            if k == 0:
                eval[str(i)+"*" +str(k)] = data[i][k]
            else:
                for j in range(len(data[i][k])):
                    eval[str(i)+"*" +str(k)+"*" +str(j)] = data[i][k][j]
    print(eval)
    table.put_item(Item=eval)
    return True



dynamodb = boto3.resource('dynamodb')
app = Flask(__name__)
CORS(app)
@app.route('/upload/<user>/<data>')
def view(user,data):
    return {"success":load_transactions(dynamodb,user,data=data)},{'Access-Control-Allow-Origin': '*'}


if __name__ == '__main__':
    app.run(debug=False)

# testdriver()


