const express = require('express'),
      router = express.Router(),
      db = require('../models'),
      axios = require('axios'),
      cheerio = require('cheerio')

// Render homepage
router.get('/', (req, res) => {
    db.Article.find({})
        .populate('note')
        .then(dbArticle => {
            res.render('index', {article: dbArticle})
        })
        .catch(err => {
            res.json(err)
        });
});

// VICE News Scraping Route
router.get('/scrape', (req, res) => {
    axios.get('https://news.vice.com/en_us').then(response => {
        const $ = cheerio.load(response.date);

        $('li.trb_outfit_group_list_item').each((i, element) => {

            const title = $(this).children("section").children("h3").text();
            const para = $(this).children("section").children("p").text();
            const link = $(this).children("a").attr("href");

            if (title && para && link) {
                db.Article.create({
                    title: title,
                    para: para,
                    link: link
                })
                    .then(dbArticle => {
                        console.log(dbArticle);
                    })
                    .catch(err => {
                        return res.json(err);
                    });
            };
        });
        res.send('scrape complete');
    });
});

// Route for retrieving all articles from db
router.get('/api/articles', (req, res) => {
    db.Article.find({})
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err);
        });
});

// Route for retrieving article by ID
router.get('/api/articles/id', (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate('note')
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err)
        });
});

// Route to create an article note
router.post('/api/articles/:id', (req, res) => {
    db.Note.create(req.body)
    .then(dbNote => {
        return db.Article.findOneAndUpdate(
            {_id: req.params.id},
            {note: dbNote.body},
            {new: true}
        );
    })
    .then(dbArticle => {
        res.json(dbArticle);
    })
    .catch(err => {
        res.json(err)
    });
});

// Route to delete article note

module.exports = router