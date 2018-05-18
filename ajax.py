import requests
import json

class Ajax():
    
    def __init__(self):
        self.url_client = 'https://gentle-waters-56547.herokuapp.com'
        self.url_product = 'https://ftt-catalog.herokuapp.com'
        self.url_payment = 'https://payment-server-mc851.herokuapp.com/payments'

    def signUp(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        s = requests.Session()
        url = self.url_client+"/api/client"
        r = s.post(url, json=data)
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
                print('AQUI' + r.text)
            return r.text, r.status_code
        else:
            return r.text, r.status_code
        
    def getProduct(self, productId):
        s = requests.Session()
        url = self.url_product+"/products/"+productId
        r = s.get(url)
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
        url = self.url_payment+"/creditCard"
        r = s.post(url, json=data)
        return r.text, r.status_code

    def payTicket(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        s = requests.Session()
        url = self.url_payment+"/bankTicket"
        r = s.post(url, json=data)
        return r.text, r.status_code