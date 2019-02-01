const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();

// middleware décodant le json inclu dans le body des requêtes
app.use(bodyParser.json());





// routes
// https://httpstatuses.com/

// ** Todo: route **
// POST /todos
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then(doc => {
    res.status(200).send(doc);
  }).catch(err => {
    res.status(400).send(err);
  })
})

// GET /todos
app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.status(200).send({todos});
  }).catch(err => {
    res.status(400).send(err);
  })
})

// GET /todos/id
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch(err => {
    res.status(400).send(err);
  })
})

// DELETE /todos/id
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndDelete(id).then(todo => {
    // findByIdAndDelete renvoie l'objet supprimé
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch(err => res.status(400).send());
})

// PATCH /todos/id
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.status(200).send({todo});
    }).catch(err => res.status(400).send());
})

// ** User: routes **
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  // instancier le modèle sur l'objet body
  var user = new User(body);
  // promesse qui renvoie un document
  user.save().then(doc => {
    res.status(200).send(doc);
  }).catch(err => {
    res.status(400).send(err);
  })

})

// POST /users/login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      // res.status(200).send(user);
      user.generateAuthToken().then(token => {
        res.header('x-auth', token).send(user);
      })
    })
    .catch(err => {
      res.status(400).send();
    })
})

// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})
app.listen(3000, () => {
  console.log('Server écoutant le port 3000...');
})

module.exports = {app};


//
