const { static } = require('express');
const express = require('express');
const { registerHelper } = require('hbs');
const app = express();
const hbs = require('hbs');
const port = process.env.PORT || 8000;
const path = require('path');
const db = require('../db/conn');
const Register = require('../models/FormSchema');
require('../models/FormSchema');
var views_path = path.join(__dirname,"../views");
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.render('index');
});


app.get('/read', (req, res)=>{
    res.render('read');
});

app.get('/update', (req, res) => {
    res.render('update');
});

app.get('/delete', (req, res) => {
    res.render('delete');
});

app.get('/showdbs', (req, res) => {
    res.render('showdbs');
});

app.post('/filled', async (req, res) => {
    try{    
            const  name = req.body.name;
            const text = req.body.text; 
            const  password = req.body.password;
            const pass = req.body.password;
            const cPassword = req.body.confirmPassword;
            if(name=="" ||text=="" || password=="" || cPassword==""){
                res.send('palease fill details first');
            }

            if(pass === cPassword) {
                const anas = new Register({
                    name : req.body.name,
                    text : req.body.text,  
                    password : req.body.password
                })

                const result = await anas.save();
                console.log(result);
                res.status(201).render('filled');

                } else {
                    res.send('password are not matching');
                }            
    }catch(err){
        res.status(400).send(err);
    }
});


app.post('/read', async (req, res)=>{
    try{
        const name = req.body.name;
        const db = await Register.findOne({name:name});
        if(db.name === name){
            res.status(201).send(`data is found  : ${db.text}`);
            Register.updateOne();
        }else{
            res.status(400).send('no data found');
        }
    }catch(err){
        res.status(400).send(`some error :  ${err}`);        
    }
});


app.post('/update', async (req, res) => {
    try{


       const name = req.body.mname;
       const newName = req.body.updateName;

       if(name==""){
           res.send('please enter name'); 
       } else if(newName=="") {
            res.send('please enter newname'); 
       }

       const db = await Register.findOne({name:name});

       if(db.name === name) {
        const updateData = await Register.updateOne({name : name},{$set:{name:newName}});
        res.status(201).send('data updated successfully');
       } else {
           res.status(400).send('data not found');
       }
    }   catch(err){
        res.status(400).send(`data not found : ${err}`);
    }
});


//  delete


app.post('/delete', async (req, res) => {
    try{

        const name = req.body.name;

       const db = await Register.findOne({name:name});

       if(db.name === name) {
        await Register.deleteMany({name : name});
        res.status(201).send('data deleted successfully');
       } else {
           res.status(400).send('data not found');
       }

    } catch(err){
        res.status(400).send(`data not found : ${err}`);
    }
});

// show dbs


app.post('/readyourdata', async (req, res) => {
    try{
        const password = req.body.password;
        const db = await Register.find();
        const check = await Register.findOne({password:password});
        if(check.password === password && password!=""){
            // res.send(db);
            res.render('readyourdata');
        } else {
            res.send('you are not authorised to this site');
        }
        
    }catch(err){
        res.status(400).send(`err from show db page ${err}`);
    }
});

app.get('*', (req, res) =>{
    res.send('<h1>Sorry this page is not available<h1>')
} );


app.listen(port, () =>{
    console.log(`server is running at port ${port}`);
});