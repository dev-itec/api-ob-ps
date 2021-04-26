const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-Parser');

const  PORT = process.env.PORT || 3010;

const  app = express();

app.use(bodyParser.json());

//Mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'krypton'
});
//Routes
app.get('/', (req, res) => {
    res.send('API CONNECT');
});

// Products
app.get('/products', (req, res)=>{
   const sql = 'SELECT * FROM ps_product';

   connection.query(sql, (error, results) =>{
       if(error) throw error;
       if(results.length > 0) {
           res.json(results);
       } else {
           res.send('Not results');
       }
   });


});

app.get('/products/:id', (req, res)=>{
    const {id} = req.params
    const sql = `SELECT * FROM ps_product WHERE id_product = ${id}`;

    connection.query(sql, (error, results) =>{
        if(error) throw error;
        if(results.length > 0) {
            res.json(results);
        } else {
            res.send('Not results');
        }
    });
});

app.post('/add', (req, res)=>{
    res.send('New product');
});

app.put('/update/:id', (req, res)=>{
    res.send('Update product');
});

app.delete('/delete/:id',(req,res)=>{
    res.send('Delete Product')
});

//Check connect
connection.connect(error => {
    if (error) throw  error;
    console.log('Connection succesful');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));