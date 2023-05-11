const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
const cors = require('cors');
const port = 3000
const path = require('path');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next();
});

let userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String
});

let itemSchema = mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  img_path: String
});

let compraSchema = mongoose.Schema({
  user: userSchema,
  item: itemSchema,
  fecha: String,
  amount: Number
});

let User = mongoose.model('User', userSchema);
let Item = mongoose.model('Item', itemSchema);
let Compra = mongoose.model('Compra', compraSchema);

//User.deleteMany({}, (err, data)=>{});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.send("ya");
});

app.post('/register', function(req, res) {
  User.find({email: req.body.email}, function(err, data){
    if (err) res.json(err);
    else if (data.length != 0) res.json({error: 'Used email'}); 
    else {
      let new_user = new User({username: req.body.username, email: req.body.email, password: req.body.password});
      new_user.save(function(err1, data1){
        if (err1) res.json(err1);
        res.json({ok:true, user:data1});
      });
    }
  });
  
});

app.post('/login', function(req, res){
  User.findOne({email: req.body.email, password:req.body.password}, function(err, data){
    if (err) res.json(err);
    else if (data == null) res.json({error: 'Incorrect email/password'}); 
    else res.json({ok: true, user: data});
  });
});

app.get('/users', function(req, res){
  User.find({}, function(err, data){
    if (err) res.json(err);
    else res.json(data);
  });
});

app.get('/user/:id', function(req, res){
  User.findById(req.params.id, function(err, data){
    if (err) res.json(err);
    res.json(data);
  });
});

app.get('/items', function(req, res){
  Item.find({}, function(err, data){
    if (err) res.json(err);
    else res.json(data);
  });
});

app.post('/item', function(req, res){
  let new_item = new Item({name: req.body.name, price: req.body.price, stock: req.body.stock, img_path: req.body.img_path});
  new_item.save(function(err, data){
    if (err) res.json(err);
    res.json(data);
  });
});

app.get('/item/:id', function(req, res){
  console.log(req.params);
  Item.findById(req.params.id, function(err, data){
    if (err) res.json(err);
    res.json(data);
  });
});

app.patch('/item/:id', function(req, res){
  Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, data){
    if (err) res.json(err);
    res.json(data);
  });
})

app.post('/compra', function(req, res){
  User.findById(req.body.user_id, (err, data)=>{ // Encontrar usuario
    if (err) res.json(err);

  
    let item_id = req.body.item_id;
    let amount = req.body.amount;
    Item.findById(item_id, (err1, data1)=>{ // Encontrar item
      if (err1) res.json(err1);
      if (data1.stock < amount) res.json({error: "No stock"}); // Verificar si hay stock
      data1.stock = data1.stock-amount;
      data1.save(function(err, data){ // Actualiza
        if (err) res.json(err);
      });
      // Nueva compra
      let new_compra = new Compra({user: data, item: data1, fecha: Date.now(), amount: amount});
      new_compra.save(function(err2, data2){
        if (err2) res.json(err2);
        res.json(data2);
      });
    });
  
  })
})

const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
})