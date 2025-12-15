// Create a new router
const express = require("express")
const router = express.Router()
const BASE_PATH = '';

const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
          res.redirect(`${BASE_PATH}/users/login`) // redirect to the login page
        } else { 
            next (); // move to the next middleware function
        } 
    }

//route to organizer home page
router.get("/home", redirectLogin, (req, res) => {
    // Query published events
    db.query("SELECT * FROM events WHERE is_published = 1 ORDER BY id DESC", (err, published) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        // Query settings (most recent)
        db.query("SELECT * FROM settings ORDER BY id DESC LIMIT 1", (err, settings) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }

            // Query draft events
            db.query("SELECT * FROM events WHERE is_published = 0 ORDER BY id DESC", (err, drafts) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }

                // Render organizerHome with all results
                // For settings, you probably want the first element
                res.render('organizerHome', { 
                    published_events: published, 
                    setting: settings, 
                    draft_events: drafts 
                });
            });
        });
    });
});

//organizer events

//route to render create/edit events page
router.get('/events', (req, res) => {
    res.render('events');
});

//route to make changes to events using form on create/edit events page page
router.post("/events", (req, res) => {
    const is_published = req.body.state === '1' ? 1 : 0;
    const sqlquery = `
        INSERT INTO events(
            title,
            event_description,
            ticket_type_full,
            ticket_type_discount,
            ticket_price_full,
            ticket_price_discount,
            event_date,
            is_published
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const newRecord = [
        req.body.title,
        req.body.event_description,
        req.body.ticket_type_full,
        req.body.ticket_type_discount,
        req.body.ticket_price_full,
        req.body.ticket_price_discount,
        req.body.event_date,
        is_published
    ];

    db.query(sqlquery, newRecord, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating event');
        }
        // Successfully inserted, render the events page
        res.render('events');
    });
});

// Route to publish a draft event
router.post('/publish_event/:id', (req, res) => {
    const id = req.params.id; //save id of event

    const publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current timestamp
    // Update the event to publish it and set the published_at timestamp
    const query = `
        UPDATE events
        SET is_published = 1, publishedAt = ?
        WHERE id = ?
    `; //set to published, insert published timestamp

    db.query(query, [publishedAt, id], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error publishing event');
        }

        // Redirect to the organizer page after publishing the event
        res.redirect('/organizer/home');
    });
});

router.post('/unpublish_event/:id', (req, res) => {
    const id = req.params.id; //save event id

    db.query('UPDATE events SET is_published = 0 WHERE id = ?', [id], function(err) { //update is_published
        if (err) {
            console.log(err.message);
            return res.status(500).send('Error unpublishing event');
        }

        // Redirect to the organizer page after unpublishing the event
        res.redirect('/organizer/home');
    });
});

//route to edit button on events to pop up edit event page
router.get("/events/:id", (req, res) => {
    const id = req.params.id; //save event id
    db.query("SELECT * FROM events WHERE id = ?", [id], (err, result) => { //get event record that has saved id
        if (err) {
            return console.error(err.message);
        }
        if (result) {
            res.render("editEvent", { event: result }); //populate form fields with event information using javascript object
        } else { 
            res.status(404).send("Error");
        }
    });
});

//route to update pages
router.post("/update/:id", (req, res) => {
    const id = req.params.id; //save event id
    const { title, event_description, event_date, ticket_type_full, ticket_type_discount, ticket_price_full, ticket_price_discount} = req.body; //save new form inputs
    const modAt = new Date().toISOString().slice(0, 19).replace('T', ' '); //save modified at date
    const query = `
    UPDATE events SET title = ?, event_description = ? ,
     event_date = ?, ticket_type_full = ?, ticket_type_discount = ?,
      ticket_price_full = ?, ticket_price_discount = ?, modifiedAt = ? WHERE id = ?
`; //update the event record that has the saved id and at modified at time

db.query(query, [title, event_description, event_date, ticket_type_full,ticket_type_discount, ticket_price_full,ticket_price_discount, modAt, id], function(err) {
    if (err) {
        console.error(err);
        return res.status(500).send('Error publishing event');
    }

    // Redirect to the organizer page after updating the event
    res.redirect('/organizer/home');
});
});

//route for delete button
router.post("/delete/:id", (req, res) => {
    const id = req.params.id; //save event id
    db.query("DELETE FROM events WHERE id = ?", [id], (err) => { //remove the record that has that id in the events table
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/organizer/home'); //redirect to organizer home page after deletion
    });
});

//route to organizer bookings page
router.get("/bookings", redirectLogin, function (req, res) {
    // query the bookings database to get all records in the bookings table, ordered by id descending  so most recent first
    let sqlquery = "SELECT * FROM bookings ORDER BY id DESC"; 

    // Execute SQL query
    db.query(sqlquery, (err, result) => {
        if (err) {
            return console.log(err.message);
        }
        
        // render the bookings page with javascript object of query result
        res.render("bookings", { booking: result });
    });
});

// Export the router object so index.js can access it
module.exports = router