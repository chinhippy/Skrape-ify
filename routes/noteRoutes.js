const express = require('express'),
      router = express.Router(),
      db = require('../models')


// Route for retrieving all articles from db
router.get('/notes', (req, res) => {
    db.Note.find({})
        .then(dbNote => {
            res.json(dbNote);
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = router