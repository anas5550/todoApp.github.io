const express = require('express');
const app = express();
const chalk = require('chalk');
app.use(express.static('public'));
app.set('view engine', 'ejs');
require('../models/conn');
const Todo = require('../models/schema');
const db = require('../models/conn');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const db = await Todo.find();
    res.render('index', { db });

});

app.post('/', async (req, res) => {
    try {
        const userData = new Todo({
            description: req.body.description,
            category: req.body.category,
            date: req.body.date
        })
        const result = await userData.save();

        res.redirect('back');
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// delete data

app.get('/delete-data', (req, res) => {
    let id = req.query.id;
    Todo.findByIdAndDelete(id, (err) => {
        if (err) {
            console.log('error while deleting');
            return;
        }
        return res.redirect('back');
    });
});

app.get('/update-data', async (req, res) => {
    let id = req.query.id;
    const updateData = await Todo.findById(id);
    res.render('update-data', { updateData });
});

app.get('/u-data/:id', (req, res) => {
    res.render('u-data');
});
app.post('/u-data/:id', function (req, res) {
    Todo.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                description: req.body.description,
                category: req.body.category,
                date: req.body.date
            }
        }, function (err, docs) {
            if (err) res.json(err);
            else {
                res.redirect('/');
            }
        });
});

app.listen(8000, () => {
    console.log(chalk.yellow('server is running on port 8000'));
});