from flask import Flask, render_template, json, request, session, redirect, url_for
from ajax import Ajax
import json
from sqlalchemy import create_engine
from sqlalchemy import exc
import json
import random
import requests

app = Flask(__name__)
aj = Ajax()

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///static/db/orders.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db_connect = create_engine('sqlite:///orders.db')

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/login')
def showLogin():
    return render_template('login.html')

@app.route('/update')
def update():
    return render_template('update.html')

@app.route('/orders')
def orders():
    return render_template('orders.html')

@app.route('/sac')
def sac():
    return render_template('sac.html')

@app.route('/new_ticket')
def newTickets():
    return render_template('new_ticket.html')

@app.route('/payments')
def payments():
    return render_template('payments.html')

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
        session['username'] = request.form["email"]
        user = json.loads(aj.getUser(session['username'])[0])['data'][0]
        session['cpf'] = user['cpf']
        session.modified = True
    else:
        print('Erro')
    return r

@app.route('/ajax/get_email', methods=['GET'])
def ajaxGetEmail():
    if session.get('username'):
        return json.dumps(session['username']), "200"
    return "500"

@app.route('/ajax/get_user/<string:email>', methods=['GET'])
def ajaxGetUser(email):
    return aj.getUser(email)

@app.route('/ajax/update', methods=['POST'])
def ajaxUpdate():
    return aj.update(request.form)

@app.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    session.pop('cart', None)
    session.modified = True
    return render_template('index.html')

@app.route('/product/<string:productId>')
def productPage(productId):
    return render_template('product.html')
    
@app.route('/product_search/')
def productSearch():
    return render_template('product_search.html')

@app.route('/remove')
def remove_cart():
    args = request.args
    id_p = args['id']
    d = session['cart']
    index = -1
    for p in d:
        index+=1
        if p['id'] == id_p:
            break

    if index is not -1:
        d = d[:index] + d[index+1:]
        session['cart'] = d

    return redirect(url_for('cart'))

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/ajax/product_details/<string:productId>')
def showProduct(productId):
    r = aj.getProduct(productId)
    if(r[1] != 200):
        print('Erro')
    return r

@app.route('/ajax/getStatusCredit/<string:cpf>')
def getStatusCredit(cpf):
    r = aj.getStatusCredit(cpf)
    return r 

@app.route('/ajax/product_search/')
def searchProduct():
    dic = {}
    if(request.args.get('brand')): dic["brand"] = request.args.get('brand')
    if(request.args.get('category_id')): dic["category_id"] = request.args.get('category_id')
    if(request.args.get('highlight')): dic["highlight"] = request.args.get('highlight')
    if(request.args.get('max_price')): dic["max_price"] = request.args.get('max_price')
    if(request.args.get('min_price')): dic["min_price"] = request.args.get('min_price')
    if(request.args.get('name')): dic["name"] = request.args.get('name')
    if(request.args.get('page')): dic["page"] = request.args.get('page')
    if(request.args.get('parent_product')): dic["parent_product"] = request.args.get('parent_product')
    r = aj.searchProduct(dic)
    if(r[1] != 200):
        print('Erro')
    return r
    
@app.route('/ajax/category_search/')
def searchCategory():
    dic = {}
    if(request.args.get('name')): dic["name"] = request.args.get('name')
    if(request.args.get('page')): dic["page"] = request.args.get('page')
    if(request.args.get('parent_category')): dic["parent_category"] = request.args.get('parent_category')
    r = aj.searchCategory(dic)
    if(r[1] != 200):
        print('Erro')
    return r
    
@app.route('/add_to_cart', methods=['POST'])
def addToCart():
    data = request.get_json()
    if data is None:
        print("Erro. Nenhum produto enviado")
        return "400"

    if session.get('cart') == None:
        d = [data]
        session['cart'] = d
    else:
        d = session['cart']
        d.append(data)
        session['cart'] = d
    #else 
    #    return 500
    print(session['cart'])
    return "200"
    
@app.route('/ajax/get_cart/', methods=['GET'])
def getCart():
    #if session['username'] and session['cart']:
    if session.get('cart'):
        return json.dumps(session['cart']), "200"
    return json.dumps({}), "200"

@app.route('/purchase')
def purchase():
    if session.get('username') == None:
        return render_template('login.html')
    return render_template('purchase.html')

@app.route('/ajax/pay_credit', methods=['POST'])
def payCredit():
    ret = aj.payCredit(request.form)
    print(ret)
    session['idPagamento'] = json.loads(ret[0]).get('operationHash')
    return ret

@app.route('/ajax/pay_ticket', methods=['POST'])
def payTicket():
    ret = aj.payTicket(request.form)
    return ret

@app.route('/ajax/check_payment/<string:code>')
def checkPayment(code):
    ret = aj.checkPayment(code)
    return ret

@app.route('/ajax/get_cep/<string:cep>')
def ajaxGetCep(cep):
    ret = aj.getCep(cep)
    return ret

@app.route('/ajax/get_shipping/', methods=['GET'])
def ajaxGetShipping():
    dic = {}
    if(request.args.get('tipoEntrega')): dic["tipoEntrega"] = request.args.get('tipoEntrega')
    if(request.args.get('cepOrigem')): dic["cepOrigem"] = request.args.get('cepOrigem')
    if(request.args.get('cepDestino')): dic["cepDestino"] = request.args.get('cepDestino')
    if(request.args.get('peso')): dic["peso"] = request.args.get('peso')
    if(request.args.get('tipoPacote')): dic["tipoPacote"] = request.args.get('tipoPacote')
    if(request.args.get('comprimento')): dic["comprimento"] = request.args.get('comprimento')
    if(request.args.get('altura')): dic["altura"] = request.args.get('altura')
    if(request.args.get('largura')): dic["largura"] = request.args.get('largura')
    ret = aj.getShipping(dic)
    return ret

@app.route('/ajax/register_delivery', methods=['POST'])
def ajaxRegisterDelivery():
    ret = aj.registerDelivery(request.form)
    return ret

@app.route('/ajax/check_delivery/<string:cod_rastreio>')
def ajaxCheckDelivery(cod_rastreio):
    ret = aj.checkDelivery(cod_rastreio)
    return ret

@app.route('/ajax/save_order', methods=['POST'])
def saveOder():
    cart = session['cart']
    email = json.dumps(session['username'])

    cod_rastreio = request.form['cod_rastreio_logistica']
    id_pagamento = request.form['id_pagamento']
    cep_de_entrega = request.form['cep_de_entrega']
    frete = request.form['frete']

    try:
        conn = db_connect.connect()
        conn.execute("INSERT INTO pedidos (client_email, cod_rastreio_logistica, id_pagamento, cep_de_entrega, frete)"
                             " VALUES ({}, '{}', '{}', '{}', '{}');".format(email, cod_rastreio, id_pagamento, cep_de_entrega, frete))
        order_id = conn.execute("SELECT order_id from pedidos where cod_rastreio_logistica='{}';".format(cod_rastreio))
        order_id = order_id.fetchall()[0][0]
        for item in cart:
            preco = item.get('price')
            item_id = item.get('id')
            conn.execute("INSERT INTO itens_do_pedido (order_id, item_id, preco, quantidade) VALUES ({}, '{}', {}, {});".format(order_id, item_id, preco, 1))
        return json.dumps({}), "200"
    except Exception as e:
        print('TA DANDO ERRO NESSA PORRA: ' + str(e))
        return "Error"

@app.route('/ajax/get_orders', methods=['GET'])
def getOrder():
    client_email = session['username']

    conn = db_connect.connect()
    print("\n***********\n")

    result = conn.execute("SELECT * FROM pedidos WHERE client_email='{}'".format(client_email))#"SELECT * FROM pedidos AS p INNER JOIN itens_do_pedido AS i ON p.order_id = i.order_id where p.client_email='{}' order by p.order_id;".format(client_email))
    orders = result.fetchall()

    response = {}

    orderlist = []
    for order in orders:
        o = {}
        o['order_id'] = order[0]
        o['client_email'] = order[1]
        o['cod_rastreio_logistica'] = order[2]
        o['id_pagamento'] = order[3]
        o['cep'] = order[4]
        o['frete'] = order[5]
        o['itens_do_pedido'] = []

        result = conn.execute("SELECT * FROM itens_do_pedido WHERE order_id='{}'".format(order[0]))
        itens = result.fetchall()
        for item in itens:
            i = {}
            i['order_id'] = item[0]
            i['item_id'] = item[1]
            i['preco'] = item[2]
            i['quantidade'] = item[3]
            o['itens_do_pedido'].append(i)
        orderlist.append(o)

    response['orders'] = orderlist

    """json_out = {"orders":[
                    {
                    "order_id": "1",
                    "client_email": "1",
                    "cod_rastreio_logistica": "208da020-5c7d-11e8-9fa8-7b984a6a0aca",
                    "id_pagamento": None,
                    "cep_de_entrega": "13330-000",
                    "itens_do_pedido": [{"order_id":"1",
                                         "item_id":"2d4636de-47c5-4a9a-b196-6a46c6f48a58",
                                         "quantidade":"2"},
                                        {"order_id":"1",
                                         "item_id":"f7a77f9d-a4c6-47dc-a60e-3b4013d34126",
                                         "quantidade":"1"}
                                        ]
                    },
                    {
                    "order_id": "2",
                    "client_email": "1",
                    "cod_rastreio_logistica": "208da020-5c7d-11e8-9fa8-7b984a6a0aca",
                    "id_pagamento": None,
                    "cep_de_entrega": "13330-000",
                    "itens_do_pedido": [{"order_id": "2",
                                          "item_id": "2d4636de-47c5-4a9a-b196-6a46c6f48a58",
                                          "quantidade": "2"},
                                         {"order_id": "2",
                                          "item_id": "f7a77f9d-a4c6-47dc-a60e-3b4013d34126",
                                          "quantidade": "1"}
                                         ]
                     }
                 ]}"""
    return json.dumps(response)

@app.route('/ajax/check_tickets/<string:id>')
def ajaxCheckTickets(id):
    return aj.checkTickets(id)

@app.route('/ajax/post_ticket', methods=['POST'])
def postTicket():
    print(request.form)
    ret = aj.postTicket(request.form)
    print(ret)
    return ret


if __name__ == "__main__":
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(port=5001)
