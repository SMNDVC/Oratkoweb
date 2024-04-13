from flask import Flask, render_template, request, redirect, url_for, session, jsonify, request
import os
import json

app = Flask(__name__)
app.secret_key = os.urandom(24)



# Load user data from file
def load_users():
    data_dir = os.path.join(os.path.dirname(__file__), 'data') 
    file_path = os.path.join(data_dir, 'users.json')
    
    with open(file_path, 'r') as f:
        users = json.load(f)
    return users

# Check if username and password match
def authenticate(username, password):
    users = load_users()
    for user in users:
        if user['username'] == username and user['password'] == password:
            return True
    return False

@app.route('/update_json', methods=['POST'])
def update_json():
    qlcplusIP = request.json['qlcplusIP']
    data = {"qlcplusIP": qlcplusIP}
    json_url = os.path.join(app.static_folder, 'config.json')
    with open(json_url, 'w') as f:
        json.dump(data, f)
    return jsonify(success=True)

@app.route('/config')
def config():
    if 'logged_in' not in session:
        return redirect(url_for('login'))
    
    json_url = os.path.join(app.static_folder, 'config.json')
    with open(json_url, 'r') as f:
        data = json.load(f)
    
    return render_template('/config.html', qlcplusIP=data['qlcplusIP'])

@app.route('/moreoptions')
def moreoptions():
    return render_template('moreoptions.html')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/bugs')
def bugy():
    return render_template('bugy.html')

@app.route('/tutorials')
def tutorialy():
    return render_template('tutorialy.html') 

@app.route('/qlcplus')
def qlcplus():
    return render_template('qlcplus.html')

# @app.route('/prezentacie')
# def osvetlenie_podium():
#     return render_template('osvetlenie/prezentacie.html')

# @app.route('/strop')
# def osvetlenie_stropu():
#     return render_template('osvetlenie/strop.html')

# @app.route('/diskocajovna')
# def diskocajovna():
#     return render_template('osvetlenie/diskocajovna.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if authenticate(username, password):
            session['logged_in'] = True
            return redirect(url_for('config'))
        else:
            error = 'Invalid username or password'

    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('qlcplus'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    