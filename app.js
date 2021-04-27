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
    const  sql = 'INSERT INTO  ps_product SET ?';

    const productObj = {
        id_supplier: req.body.id_supplier
    };

    connection.query(sql, productObj, error => {
        if (error) throw  error;
        res.send('Product added')
    });
});

app.put('/update/:id', (req, res)=>{
    const {id} = req.params;
    const {id_supplier} =req.body;
    const sql =`UPDATE ps_product SET id_supplier = '${id_supplier}' WHERE id =${id}`;

    connection.query(sql, error => {
        if (error) throw  error;
        res.send('Product updated')
    });
});

app.delete('/delete/:id',(req,res)=>{
    const  {id} = req.params;
    const sql = `DELETE FROM ps_product WHERE id= id ${id}`;

    connection.query(sql, error =>{
        if (error) throw  error;
        res.send('Product deleted')
    });
});

//Check connect
connection.connect(error => {
    if (error) throw  error;
    console.log('Connection succesful');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));