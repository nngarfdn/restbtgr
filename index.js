const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Konfigurasi Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(bodyParser.json());

// Endpoint untuk menambah data produk
app.post('/addProduct', async (req, res) => {
  const { name, price, quantity, transactionDate } = req.body;
  try {
    const docRef = await db.collection('products').add({
      name,
      price,
      quantity,
      transactionDate: new Date(transactionDate)
    });
    res.status(200).send(`Product added with ID: ${docRef.id}`);
  } catch (error) {
    res.status(500).send(`Error adding product: ${error}`);
  }
});

// Endpoint untuk mendapatkan data produk
app.get('/getProducts', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(`Error getting products: ${error}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
