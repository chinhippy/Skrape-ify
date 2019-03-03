const express = require('express'),
      mongoose = require('mongoose'),
      articleRoutes = require('./routes/articleRoutes'),
      noteRoutes = require('./routes/noteRoutes'),
      PORT = process.env.PORT || 3000,
      app = express(),
      exphbs = require('express-handlebars')

    //   Parse request body as JSON 
    app.use(express.urlencoded({ extended: true}))
    app.use(express.json())

    // Accessing created routes
    app.use('/', articleRoutes)
    app.use('/', noteRoutes)

    // Make 'public' folder static
    app.use(express.static('public'))

    // HBRS
    app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // Connect to Mongo DB
    // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

    mongoose.connect(MONGODB_URI);

    // Start the server
    app.listen(PORT, () => {
        console.log(`app running on port ${PORT}!`);
    });
