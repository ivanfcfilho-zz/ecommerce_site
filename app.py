from flask import Flask, render_template, json, request, session
from ajax import Ajax
from werkzeug import generate_password_hash, check_password_hash

app = Flask(__name__)
aj = Ajax()

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/login')
def showLogin():
    return render_template('login.html')

@app.route('/signup')
def showSignUp():
    return render_template('signup.html')

@app.route('/ajax/signup', methods=['POST'])
def ajaxSignup():
    return aj.signUp(request.form)

@app.route('/ajax/login', methods=['POST'])
def ajaxLogin():
    r = aj.login(request.form)
    if(r[1] == 200):
        session['username'] = 'user'
        session.modified = True
    else:
        print('Erro')
    return r

@app.route('/logout')
def logout():
    session.pop('username', None)
    session.modified = True
    return render_template('index.html')

if __name__ == "__main__":
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(port=5000)
