// Create a new router
const express = require("express")
const router = express.Router()

router.get("/home", (req, res) => {
    // Query events
    db.query("SELECT * FROM events WHERE is_published = 1 ORDER BY event_date ASC", (err, events) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching events');
        }

        // Query settings after events are fetched
        db.query("SELECT * FROM settings ORDER BY id DESC LIMIT 1", (err, settingsResult) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching settings');
            }

            // Keep settingsResult as an array for your EJS template
            const setting = settingsResult; // <- array with 1 item

            // Render the attendee home page
            res.render('attendeeHome', { events, setting });
        });
    });
});

//route to attendee event page where attendees can book 
router.get("/eventDetails/:id", (req, res) => {
    const id = req.params.id; //save id of event
    db.query("SELECT * FROM events WHERE id = ?", [id], (err, results) => {
        if (err) return console.error(err.message);

        if (results.length > 0) {
            const event = results[0]; // pick the first (and only) row
            res.render("eventDetails", { 
                event,
                fullTicketOptions: Array.from({ length: event.ticket_type_full }, (_, i) => i + 1),
                discountTicketOptions: Array.from({ length: event.ticket_type_discount }, (_, i) => i + 1)
            });
        } else {
            res.status(404).send("Event Not Found");
        }
    });
});

// Route for book button
router.post('/book/:id', (req, res) => {
    const id = req.params.id; // save id of event
    const fullPriceAmount = req.body.ticket_type_full; // full-price tickets requested
    const discountPriceAmount = req.body.ticket_type_discount; // discount-price tickets requested

    if (fullPriceAmount == 0 && discountPriceAmount == 0) { // must select at least one ticket
        return res.status(400).send(`
            <html>
                <body>
                    <h3>Error: You must select at least one ticket!</h3>
                    <button onclick="window.history.back()">Go Back</button>
                </body>
            </html>
        `);
    }

    // Begin transaction
    db.query("START TRANSACTION", (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Transaction start failed');
        }

        // Update ticket counts
        const updateTicketsQuery = `
            UPDATE events 
            SET ticket_type_full = ticket_type_full - ?, 
                ticket_type_discount = ticket_type_discount - ? 
            WHERE id = ?
        `;
        db.query(updateTicketsQuery, [fullPriceAmount, discountPriceAmount, id], (err, result) => {
            if (err) {
                db.query("ROLLBACK", () => {});
                console.error(err);
                return res.status(500).send('Error updating ticket count');
            }

            // Insert booking record
            const bookingQuery = `
                INSERT INTO bookings (attendee_name, ticket_amount_full, ticket_amount_discount, title) 
                VALUES (?, ?, ?, ?)
            `;
            db.query(bookingQuery, [req.body.attendee_name, fullPriceAmount, discountPriceAmount, req.body.title], (err, result) => {
                if (err) {
                    db.query("ROLLBACK", () => {});
                    console.error(err);
                    return res.status(500).send('Error inserting booking data');
                }

                // Commit transaction
                db.query("COMMIT", (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Transaction commit failed');
                    }

                    // Redirect to attendee home page
                    res.redirect('/attendee/home');
                });
            });
        });
    });
});

// Export the router object so index.js can access it
module.exports = router