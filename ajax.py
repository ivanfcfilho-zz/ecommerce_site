import requests
import send_email
from time import gmtime, strftime

class Ajax():
    
    def __init__(self):
        self.url_client = 'https://gentle-waters-56547.herokuapp.com'
        self.url_product = 'https://ftt-catalog.herokuapp.com'
        self.url_payment = 'https://payment-server-mc851.herokuapp.com/payments'
        self.url_cep = 'http://node.thiagoelg.com'
        self.url_logistica = 'https://hidden-basin-50728.herokuapp.com'
        self.url_sac = 'https://centralatendimento-mc857.azurewebsites.net'
        self.key_cep = {'x-api-key': '06c2cbde-66b2-4ca7-8f51-ed552c6c1c31'}
        self.key_logistica = 'd52bede3-88f0-568f-a71b-4f2a9ea6323a'
        self.key_sac = 'bafecfbf93a5ecf25ca8c6ca19d46ea3bffdee0c'
        self.url_credit_validation = 'https://glacial-brook-98386.herokuapp.com/score/'
        self.key_credit_validation = 'tmvcgp2'

    def signUp(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        s = requests.Session()
        url = self.url_client+"/api/client"
        r = s.post(url, json=data)
        return r.text, r.status_code

    def update(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        s = requests.Session()
        url = self.url_client+"/api/client"
        r = s.put(url, json=data)
        return r.text, r.status_code

    def changeEmail(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        s = requests.Session()
        url = self.url_client+"/api/client/email"
        r = s.put(url, json=data)
        return r.text, r.status_code

    def login(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        s = requests.Session()
        url = self.url_client+"/api/useraccess"
        r = s.post(url, json=data)
        if(r.status_code == 200):
            result = r.json()
            token = result['token']
            if r.status_code == 200:
                r = s.get(self.url_client+'/api/useraccess', params={'token':token})     
            return r.text, r.status_code
        else:
            print(r.status_code)
            return r.text, r.status_code

    def getUser(self, email):
        s = requests.Session()
        url = self.url_client + "/api/client?email=" + email
        r = s.get(url)
        return r.text, r.status_code
        
    def getProduct(self, productId):
        s = requests.Session()
        url = self.url_product+"/products/"+productId
        r = s.get(url)
        return r.text, r.status_code

    def reserveProduct(self, productId, reserve):
        s = requests.Session()
        if reserve:
            url = self.url_product+"/reservation/reserve/"+productId
        else:
            url = self.url_product + "/reservation/release/" + productId
        r = s.put(url, json=1)
        return r.text, r.status_code

    def searchProduct(self, params):
        s = requests.Session()
        query = ""
        if params:
            query = "?"
            for key, value in params.items():
                query += key+"="+value+"&"
            query = query[:-1]
        url = self.url_product+"/products/"+query
        r = s.get(url)
        return r.text, r.status_code
        
    def searchCategory(self, params):
        s = requests.Session()
        query = ""
        if params:
            query = "?"
            for key, value in params.items():
                query += key+"="+value+"&"
            query = query[:-1]
        url = self.url_product+"/categories/"+query
        r = s.get(url)
        return r.text, r.status_code

    def payCredit(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        s = requests.Session()

        d = {"number":data['cardNumber'], 'hasCredit':True}
        url = 'https://payment-server-mc851.herokuapp.com/creditCard'
        r = s.post(url, json=d)

        url = self.url_payment+"/creditCard"
        r = s.post(url, json=data)
        print(r.text)
        return r.text, r.status_code

    def payTicket(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        print(data)
        s = requests.Session()
        url = self.url_payment+"/bankTicket"
        r = s.post(url, json=data)
        print(r.text)
        return r.text, r.status_code

    def checkPayment(self, code):
        s = requests.Session()
        url = self.url_payment+"/bankTicket/"+code+"/status"
        r = s.get(url)
        return r.text, r.status_code

    def getCep(self, cep):
        s = requests.Session()
        url = self.url_cep+"/paises/br/cep/"+cep
        r = s.get(url, headers=self.key_cep)
        return r.text, r.status_code

    def getShipping(self, params):
        s = requests.Session()
        query = ""
        if params:
            query = "?"
            for key, value in params.items():
                query += key+"="+value+"&"
            query = query[:-1]
        url = self.url_logistica+"/calculafrete"+query
        r = s.get(url)
        return r.text, r.status_code

    def registerDelivery(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        data["apiKey"]=self.key_logistica
        s = requests.Session()
        url = self.url_logistica+"/cadastrarentrega"
        r = s.post(url, json=data)
        return r.text, r.status_code

    def checkDelivery(self, cod_rastreio):
        s = requests.Session()
        url = self.url_logistica+"/rastrearentrega/"+cod_rastreio
        r = s.get(url, params={"apiKey":self.key_logistica})
        return r.text, r.status_code


    def checkTickets(self, client_id):
        s = requests.Session()
        url = self.url_sac+"/tickets/"+self.key_sac+"/"+client_id+"/"
        r = s.get(url)
        return r.text, r.status_code

    def postTicket(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        data["timestamp"]=strftime('%Y-%m-%dT%H:%M', gmtime())
        client_id = data.pop("client_id", None)
        compra_id = data.pop("compraId", None)
        ticket_id = data.pop("ticketId", None)
        if client_id is None:
            return 500
        if compra_id:
            s = requests.Session()
            url = self.url_sac+"/tickets/"+self.key_sac+"/"+client_id+"/compra/"+compra_id
            r = s.post(url, json=data)
            return r.text, r.status_code
        if ticket_id:
            s = requests.Session()
            url = self.url_sac + "/tickets/" + self.key_sac + "/" + client_id + "/ticket/" + ticket_id
            r = s.put(url, json=data)
            return r.text, r.status_code
        else:
            s = requests.Session()
            url = self.url_sac+"/tickets/"+self.key_sac+"/"+client_id+"/"
            r = s.post(url, json=data)
            return r.text, r.status_code

    def getStatusCredit(self, cpf):
        s = requests.Session()
        header = {'x-api-key': 'tmvcgp2'}
        r = s.get('https://glacial-brook-98386.herokuapp.com/score/'+cpf, headers=header)
        if r.status_code == 400 and 'Invalid' in r.text:
            data = {"score": 400,
                    "document":cpf}
            r = s.post('https://glacial-brook-98386.herokuapp.com/score/'+cpf, headers=header, json=data)
            print(r.text)
            return r.text, r.status_code
        else:
            return r.text, r.status_code

