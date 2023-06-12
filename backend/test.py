import requests
import unittest
import pytest
import json


class Test(unittest.TestCase):
    API_URL = "https://judiciousbaggybraces.juaquinremon.repl.co"
    id_usuario = None
    id_producto = None
    
    def setUp(self):
        user_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword"
        }
        response = requests.post(f"{self.API_URL}/register", data=user_data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["ok"])
        self.id_usuario = response.json()["user"]["_id"]

        product_data = {
            "name": "TestItem",
            "price": 100,
            "stock": 10,
            "img_path": "test.jpg"
        }
        response = requests.post(f"{self.API_URL}/item", data=product_data)
        assert response.status_code == 200
        assert response.json()["name"] == "TestItem"
        self.id_producto = response.json()["_id"]

    """
    Test Case: Register Success
    Precondition: El usuario no está registrado
    Test Steps: Proceder a registrar el usuario
    Test Data: Introducir datos de usuario como nombre de usuario, correo electrónico y contraseña
    Expected Result: El usuario está registrado, de lo contrario, el id del usuario es None
    """ 
    def test_register_success(self):
        self.assertIsNotNone(self.id_usuario)


    """
    Test Case: Login Success
    Precondition: El usuario está registrado
    Test Steps: Proceder a iniciar sesión con el usuario
    Test Data: Introducir datos de usuario como correo electrónico y contraseña
    Expected Result: El usuario inicia sesión y el servidor devuelve "ok" como True
    """
    def test_login_success(self):
        data = {
            "email": "testuser@example.com",
            "password": "testpassword"
        }
        response = requests.post(f"{self.API_URL}/login", data=data)
        assert response.status_code == 200
        assert response.json()["ok"] == True

    """
    Test Case: Create Item Success
    Precondition: El producto no está creado
    Test Steps: Proceder a crear el producto
    Test Data: Introducir datos del producto como nombre, precio, stock e img_path
    Expected Result: El producto está creado, de lo contrario, el id del producto es None
    """
    def test_create_item_success(self):
        self.assertIsNotNone(self.id_producto)

    """
    Test Case: Compra Success
    Precondition: El usuario y el producto existen y el producto tiene stock
    Test Steps: Proceder a realizar una compra
    Test Data: Introducir datos de compra como user_id, item_id y amount
    Expected Result: La compra se realiza y el stock del producto se reduce por la cantidad
    """
    def test_compra_success(self):
        data = {
            "user_id": self.id_usuario,
            "item_id": self.id_producto,
            "amount": 2
        }
        response = requests.post(f"{self.API_URL}/compra", data=data)
        assert response.status_code == 200
        assert list(response.json().values())[2]["stock"] == 8

    """
    Test Case: Compra No Stock
    Precondition: El producto existe pero no tiene suficiente stock
    Test Steps: Proceder a realizar una compra
    Test Data: Introducir datos de compra como user_id, item_id y amount
    Expected Result: El servidor devuelve un error "No stock"
    """
    def test_buy_item_no_stock(self):
        data = {
            "user_id": self.id_usuario,
            "item_id": self.id_producto,
            "amount": 11 
        }
        response = requests.post(f"{self.API_URL}/compra", data=data)
        assert "error" in response.json()
        assert response.json()["error"] == "No stock"

    """
    Test Case: Compra Item Not Exist
    Precondition: El producto no existe
    Test Steps: Proceder a realizar una compra
    Test Data: Introducir datos de compra como user_id, item_id y amount
    Expected Result: El servidor devuelve un error "Producto no encontrado"
    """
    def test_buy_item_not_exist(self):
        data = {
            "user_id": self.id_usuario,
            "item_id": "product_not_exist",
            "amount": 1
        }
        response = requests.post(f"{self.API_URL}/compra", data=data)
        assert "error" in response.json()
        assert response.json()["error"] == "Producto no encontrado"

    """
    Test Case: Delete Item Success
    Precondition: El producto existe
    Test Steps: Proceder a eliminar el producto
    Test Data: Introducir item_id
    Expected Result: El producto es eliminado y el servidor devuelve "ok" como True
    """
    def test_delete_item_success(self):
        response = requests.delete(f"{self.API_URL}/item/{self.id_producto}")
        assert response.status_code == 200
        assert response.json()["ok"] == True
        self.id_producto = None

    """
    Test Case: Delete User Success
    Precondition: El usuario existe
    Test Steps: Proceder a eliminar el usuario
    Test Data: Introducir user_id
    Expected Result: El usuario es eliminado y el servidor devuelve "ok" como True
    """
    def test_delete_success(self):
        response = requests.delete(f"{self.API_URL}/user/{self.id_usuario}")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["ok"])
        self.id_usuario = None

    def tearDown(self):
        if self.id_usuario:
            response = requests.delete(f"{self.API_URL}/user/{self.id_usuario}")
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.json()["ok"])
            self.id_usuario = None

        if self.id_producto:
            response = requests.delete(f"{self.API_URL}/item/{self.id_producto}")
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.json()["ok"])
            self.id_producto = None

if __name__ == '__main__':
    unittest.main()





