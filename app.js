require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/usersDB',{useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret: secret, encryptedFields: ['password']});

const User = new mongoose.model('User',userSchema);

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',(req,res)=>{
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });
    user.save(err=>{
        if (err) {
            console.log(err);
        } else {
            res.render('secrets');
        }
    });
})

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username},(err,user)=>{
        if (user) {
            if (password === user.password){
                res.render('secrets');
            }
        }
    });
});







app.listen(3000, ()=>{
    console.log('Server started on port 3000');
})
