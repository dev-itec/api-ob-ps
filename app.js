const dotenv = require('dotenv').config({ path: '.env' })
const express = require('express'), mysql = require('mysql'), helmet = require('helmet'),
    bodyParser = require('body-Parser'), PORT = process.env.PORT, app = express();


app.use(bodyParser.json());

//Helmet
app.use(helmet());

//Mysql
const connection = mysql.createConnection({
    host: process.env.PS_DB_HOST,
    user: process.env.PS_DB_USER,
    password: process.env.PS_DB_PASSWORD,
    database: process.env.PS_DB_DATABASE
});
//Routes
app.get('/', (req, res) => {
    res.sendFile('./status.html', { root: __dirname });
});

// Products
app.get('/products', (req, res)=>{
   const sql = 'SELECT SQL_CALC_FOUND_ROWS p.`id_product`  AS `id_product`,\n' +
       ' p.`reference`  AS `referencia`,\n' +
       ' sa.`price`  AS `precio`,\n' +
       ' p.`id_shop_default`  AS `id_shop_default`,\n' +
       ' p.`is_virtual`  AS `virtual`,\n' +
       ' pl.`name`  AS `nombre`,\n' +
       ' pl.`link_rewrite`  AS `link_rewrite`,\n' +
       ' sa.`active`  AS `activo`,\n' +
       ' shop.`name`  AS `shopname`,\n' +
       ' image_shop.`id_image`  AS `id_image`,\n' +
       ' cl.`name`  AS `categoria`,\n' +
       ' 0 AS `precio_final`,\n' +
       ' pd.`nb_downloadable`  AS `nb_downloadable`,\n' +
       ' sav.`quantity`  AS `sav_quantity`,\n' +
       ' IF(sav.`quantity`<=0, 1, 0) AS `badge_danger` \n' +
       'FROM  `ps_product` p \n' +
       ' LEFT JOIN `ps_product_lang` pl ON (pl.`id_product` = p.`id_product` AND pl.`id_lang` = 1 AND pl.`id_shop` = 1) \n' +
       ' LEFT JOIN `ps_stock_available` sav ON (sav.`id_product` = p.`id_product` AND sav.`id_product_attribute` = 0 AND sav.id_shop = 1  AND sav.id_shop_group = 0 ) \n' +
       ' JOIN `ps_product_shop` sa ON (p.`id_product` = sa.`id_product` AND sa.id_shop = 1) \n' +
       ' LEFT JOIN `ps_category_lang` cl ON (sa.`id_category_default` = cl.`id_category` AND cl.`id_lang` = 1 AND cl.id_shop = 1) \n' +
       ' LEFT JOIN `ps_category` c ON (c.`id_category` = cl.`id_category`) \n' +
       ' LEFT JOIN `ps_shop` shop ON (shop.id_shop = 1) \n' +
       ' LEFT JOIN `ps_image_shop` image_shop ON (image_shop.`id_product` = p.`id_product` AND image_shop.`cover` = 1 AND image_shop.id_shop = 1) \n' +
       ' LEFT JOIN `ps_image` i ON (i.`id_image` = image_shop.`id_image`) \n' +
       ' LEFT JOIN `ps_product_download` pd ON (pd.`id_product` = p.`id_product`) \n' +
       'WHERE (1 AND state = 1)';

   connection.query(sql, (error, results) =>{
       if(error) throw error;
       if(results.length > 0) {
           res.json(results);
       } else {
           res.send('Not results');
       }
   });


});

/*app.get('/products/list', (req, res)=>{
    const sql = 'SELECT * FROM ps_product';

    connection.query(sql, (error, results) =>{
        if(error) throw error;
        if(results.length > 0) {
            res.json(results);
        } else {
            res.send('Not results');
        }
    });


});*/

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

app.get('/atr', (req, res)=>{
    const sql = 'SELECT SQL_CALC_FOUND_ROWS b.*, a.* FROM `ps_attribute_group` a LEFT JOIN `ps_attribute_group_lang` b ON ( b.`id_attribute_group` = a.`id_attribute_group` AND b.`id_lang` = 1 )';

    connection.query(sql, (error, results) =>{
        if(error) throw error;
        if(results.length > 0) {
            res.json(results);
        } else {
            res.send('Not results');
        }
    });


});

app.get('/feat', (req, res)=>{
    const sql = 'SELECT SQL_CALC_FOUND_ROWS b.*, a.* FROM `ps_feature` a LEFT JOIN `ps_feature_lang` b ON (b.`id_feature` = a.`id_feature` AND b.`id_lang` = 1)';

    connection.query(sql, (error, results) =>{
        if(error) throw error;
        if(results.length > 0) {
            res.json(results);
        } else {
            res.send('Not results');
        }
    });


});


//Check connect
connection.connect(error => {
    if (error) throw  error;
    console.log('Connection succesful');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));