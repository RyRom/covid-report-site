const express = require("express");

const mysql = require('mysql');
const app = express();
const pool = dbConnection();
app.set("view engine", "ejs");
app.use(express.static("public"));
//to parse Form data sent using POST method
app.use(express.urlencoded({extended: true}));

//routes
app.get('/', (req, res) => {
   res.render('home');
});

app.get('/report', (req, res) => {
   res.render('report');
});

app.post('/reportVariant', async (req, res) => {

   let variant = req.body.variant;
   let name = req.body.name;
   let country = req.body.country;
   let attributes = req.body.attributes;

   console.log(variant);
   console.log(name);
   console.log(country);
   console.log(attributes);

   let sql = `INSERT INTO covid_variant_details
               (name, variant, first_detected, attributes)
               VALUES
               (?, ?, ?, ?)`;

   let params = [name, variant, country, attributes];
   let rows = await executeSQL(sql, params);

   res.redirect('/');
});

app.get('/variants', (req, res) => {
   res.render('variants');
});

app.get('/updateVariant/:variant', async (req, res) => {
   let variant = req.params.variant;

   let sql = `SELECT *
               FROM covid_variant_details
               WHERE name = ?`;

   let params = [variant];
   let rows = await executeSQL(sql, params);

   res.render('updateVariants', { "data" : rows} );
});

app.post('/updateVariant', async (req, res) => {
   let name = req.body.name;
   let attributes = req.body.attributes;

   let sql = `UPDATE covid_variant_details
               SET attributes = ?
               WHERE name = ?`;

   let params = [attributes, name];
   let rows = await executeSQL(sql, params);

   res.render('variants');
});

app.get('/quiz', async (req, res) => {
   let sql = `SELECT qid, question, choice1, choice2, choice3, choice4
             FROM covid_variants`;
   
   let rows = await executeSQL(sql);
   res.render('quiz', { "questions" : rows } );
});

// api's
app.get('/api/variants', async (req, res) => {
   let sql = `SELECT DISTINCT name
             FROM covid_variant_details`;
   let rows = await executeSQL(sql);
   res.send(rows);
});

app.get('/api/variantInfo/:variant', async (req, res) => {
   let variant = req.params.variant;

   let sql = `SELECT *
             FROM covid_variant_details
             WHERE variant = ?`;
   let params = [variant];
   let rows = await executeSQL(sql, params);
   res.send(rows);
});

app.get('/api/answers/:id', async (req, res) => {
   let sql = `SELECT choice1, choice2, choice3, choice4
             FROM covid_variants
             WHERE qId = ?`;
   let params = [req.params.id];
   let rows = await executeSQL(sql, params);
   res.send(rows);
});

app.get('/api/check/:id/:answer', async (req, res) => {
   let id = req.params.id;
   let answer = req.params.answer;

   let sql = `SELECT answer
             FROM covid_variants
             WHERE qId = ?`;

   let params = [id];
   let rows = await executeSQL(sql, params);

   if (rows[0].answer == answer) {
      res.send("Correct");
   } else {
      res.send("Incorrect");
   }
});

app.get("/dbTest", async function(req, res){
   let sql = "SELECT CURDATE()";
   let rows = await executeSQL(sql);
   res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params){
   return new Promise (function (resolve, reject) {
   pool.query(sql, params, function (err, rows, fields) {
      if (err) throw err;
         resolve(rows);
      });
   });
}//executeSQL

//values in red must be updated
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 10,
      host: "migae5o25m2psr4q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "pvsz77pj8o0fqkke",
      password: "zp65lcmnni3dfqym",
      database: "crf0ktaw989bmz1i"

   }); 

   return pool;

} //dbConnection
//start server
app.listen(3000, () => {
console.log("Expresss server running...")
});