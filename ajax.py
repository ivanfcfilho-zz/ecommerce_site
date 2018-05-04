import requests
import json

class Ajax():
    
    def __init__(self):
        #self.url = 'http://127.0.0.1:5001'
        self.url = 'http://www.gentle-waters-56547.herokuapp.com'

    def signUp(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        s = requests.Session()
        url = self.url+"/api/client"
        r = s.post(self.url+"/api/client", json=data)
        return r.text, r.status_code

    def login(self, data):
        data = dict((key, data.getlist(key)[0]) for key in data.keys())
        s = requests.Session()
        url = self.url+"/api/useraccess"
        r = s.post(url, json=data)
        if(r.status_code == 200):
            result = r.json()
            token = result['token']
            r = s.get(url, params={'token':token})
            return r.text, r.status_code
        else:
            return r.text, r.status_code
        
