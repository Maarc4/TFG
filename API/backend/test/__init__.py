import unittest
import requests

class AccountsRESTTest(unittest.TestCase):

    BASE_URL = 'http://127.0.0.1:5001'
    AUTHORIZATION = 'Basic YWRtaW46YWRtaW4='

    def test_a_get_accounts(self):
        url = self.BASE_URL + '/accounts'

        response = requests.get(url, headers={'Content-Type' : 'application/json', 'Authorization' : self.AUTHORIZATION})
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json())  # add assertion here

    def test_b_get_account_by_id(self):
        email = 'albert@example.com'
        url = self.BASE_URL + '/account/' + email

        response = requests.get(url, headers={'Content-Type' : 'application/json', 'Authorization' : self.AUTHORIZATION})
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json())

    def test_c_post_account(self):
        url = self.BASE_URL + '/account'
        body = {
            "name" : "test",
            "email" : "test@test.com",
            "edat": 24,
            "password" : "test"
        }

        response = requests.post(url, json=body)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json())

    def test_d_update_account(self):
        url = self.BASE_URL + '/account/' + 'test@test.com'
        body = {
            "name" : "testModify",
            "email" : "test@test.com",
            "edat": 24,
            "password" : "test"
        }

        response = requests.put(url, json=body)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json())
        self.assertEqual(response.json()['name'], 'testModify')

    def test_e_login(self):
        url = self.BASE_URL + '/login'
        body = {
            "email": "test@test.com",
            "password": "test"
        }

        response = requests.post(url, headers={'Content-Type' : 'application/json'}, json=body)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json())
    
    def test_f_delete_account(self):
        url = self.BASE_URL + '/account'
        body = {
            "email": "test@test.com",
            "password": "test"
        }

        response = requests.delete(url, json=body)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json())

    def test_g_get_route_by_id(self):
        route_id = '6'
        url = self.BASE_URL + '/route/' + route_id

        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json())

    def test_get_routes_auto(self): #Rutes automàtiques
        url = self.BASE_URL + '/routes'
        params = {
            "health_type" : "AUTO",
            "level": "DIFICIL",
            "coords" : "[2.15899, 41.38879]"
        }

        response = requests.get(url, params=params)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json())

    def test_get_routes_normal(self):
        url = self.BASE_URL + '/routes'
        params = {
            "health_type" : "NORMAL",
            "level": "MITJA"
        }

        response = requests.get(url, params=params)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json())

    def test_get_routes_verdes(self):
        url = self.BASE_URL + '/routes'
        params = {
            "health_type" : "ZONES VERDES",
            "level": "MITJA"
        }

        response = requests.get(url, params=params)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json())

if __name__ == '__main__':
    unittest.main()
