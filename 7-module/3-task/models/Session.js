const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Session = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },
  lastVisit: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

Session.path('lastVisit').index({expires: '7d'});

module.exports = connection.model('Session', Session);
