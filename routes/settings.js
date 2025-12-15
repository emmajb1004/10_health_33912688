// Create a new router
const express = require("express")
const router = express.Router()

const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
          res.redirect('users/login') // redirect to the login page
        } else { 
            next (); // move to the next middleware function
        } 
    }

//route to site settings page
router.get('/', redirectLogin, (req, res) => {
    //query database and get most recent record in setings table
    db.query("SELECT * FROM settings ORDER BY id DESC LIMIT 1;", (err, result) => { 
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        if (result) {
            res.render("settings", { setting: result }); //render settings page showing result of query
        } else {
            res.status(404).send("Not Found");
        }
    });
});

//route to site settings page
router.post("/", function(req,res){
    let sqlquery = "INSERT INTO settings(title,manager_name,settings_description) VALUES(?,?,?)"; //query to add new record to settings table

    let newRecord = [req.body.title,req.body.manager_name,req.body.settings_description]; //use the form values from the request
    db.query(sqlquery,newRecord,(err,result)=>{
        if(err){
            return console.error(err.message);
        }else
        res.redirect('organizerHome'); //redirect to home page after changing settings
    });
});

// Export the router object so index.js can access it
module.exports = router