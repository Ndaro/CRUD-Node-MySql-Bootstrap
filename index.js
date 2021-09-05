//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();

//konfigurasi koneksi
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'data_vaksin',
    password: '',
    database: 'data_vaksin'
});

//connect ke database
conn.connect((err) => {
    if (err) throw err;
    console.log('Zecko-Code Connected...');
});

//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public sebagai static folder untuk static file
app.use('/assets', express.static(__dirname + '/public'));

//route untuk homepage
app.get('/', (req, res) => {
    let sql = "SELECT * FROM vaksin";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('vaksin_view', {
            results: results
        });
    });
});

//route untuk insert data
app.post('/save', (req, res) => {
    let data = { id: req.body.id, nama_warga: req.body.nama_warga, alamat: req.body.alamat, vaksin_1: req.body.vaksin_1, vaksin_2: req.body.vaksin_2 };
    let sql = "INSERT INTO vaksin SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//route untuk update data
app.post('/update', (req, res) => {
    let sql = "UPDATE vaksin SET nama_warga = '" + req.body.nama_warga + "', alamat = '" + req.body.alamat + "', vaksin_1 = '" + req.body.vaksin_1 + "', vaksin_2 = '" + req.body.vaksin_2 + "' WHERE id="+req.body.id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//route untuk delete data
app.post('/delete', (req, res) => {
    let sql = "DELETE FROM vaksin WHERE id='" + req.body.id + "'";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//server listening
app.listen(8000, () => {
    console.log('Server is running at port 8000');
});