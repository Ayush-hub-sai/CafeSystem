const express = require('express')
const connection = require('../connection')
const router = express.Router()
var auth = require('../services/authenticate')
var checkRole = require('../services/checkRole')

router.post('/addProduct', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    var sqlQuery = 'insert into product (name,categoryId,description,price,status) values(?,?,?,?,"true")';
    connection.query(sqlQuery, [product.name, product.categoryId, product.description, product.price], (error, result) => {
        if (!error) {
            return res.status(200).json({
                message: "Product added successfully"
            })
        } else {
            return res.status(500).json(error);
        }
    })
})



router.get('/getProduct', auth.authenticateToken, (req, res) => {
    var sqlQuery = 'select p.id, p.name,p.description,p.price,p.status,c.name as categoryName from product as p inner join category as c where p.categoryId=c.id'
    connection.query(sqlQuery, (error, result) => {
        if (!error) {
            return res.status(200).json({
                data: result
            })
        } else {
            return res.status(500).json(error);
        }
    })
})



router.get('/getByCategory/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var sqlQuery = "select id,name from product where categoryId=? and status='true'"
    connection.query(sqlQuery, [id], (error, result) => {
        if (!error) {
            return res.status(200).json({
                data: result
            })
        } else {
            return res.status(500).json(error);
        }
    })
})


router.get('/getByProduct/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var sqlQuery = 'select id,name,description,price from product where id=?'
    connection.query(sqlQuery, [id], (error, result) => {
        if (!error) {
            return res.status(200).json({
                data: result[0]
            })
        } else {
            return res.status(500).json(error);
        }
    })
})

router.patch('/updateProduct', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    var sqlQuery = 'update product set name =?,categoryId=?,description=?,price=? where id=?'
    connection.query(sqlQuery, [product.name, product.categoryId, product.description, product.price, product.id], (error, result) => {
        if (!error) {
            if (result.affectedRows == 0) {
                return res.status(400).json({
                    message: "Product id does not found"
                })
            } else {
                return res.status(200).json({
                    message: "Product updated successfully"
                })
            }
        } else {
            return res.status(500).json(error)
        }
    })
})


router.delete('/deleteProduct/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let id = req.params.id;
    var sqlQuery = 'delete from product where id=?'
    connection.query(sqlQuery, [id], (error, result) => {
        if (!error) {
            if (result.affectedRows == 0) {
                return res.status(400).json({
                    message: "Product id does not found"
                })
            } else {
                return res.status(200).json({
                    message: "Product deleted successfully"
                })
            }
        } else {
            return res.status(500).json(error)
        }
    })
})

router.patch('/updateProductStatus', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let body = req.body;
    var sqlQuery = 'update  product  set status =? where id=?'
    connection.query(sqlQuery, [body.status, body.id], (error, result) => {
        if (!error) {
            if (result.affectedRows == 0) {
                return res.status(400).json({
                    message: "Product id does not found"
                })
            } else {
                return res.status(200).json({
                    status: 1,
                    message: "Product status updated successfully"
                })
            }
        } else {
            return res.status(500).json(error)
        }
    })
})
module.exports = router