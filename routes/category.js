const express = require('express')
const connection = require('../connection')
const router = express.Router()
var auth = require('../services/authenticate')
var checkRole = require('../services/checkRole')

router.post('/addCategory', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let category = req.body;
    var sqlQuery = 'insert into category (name) values(?)';
    connection.query(sqlQuery, [category.name], (error, result) => {
        if (!error) {
            return res.status(200).json({
                message: "Category added successfully"
            })
        } else {
            return res.status(500).json(error);
        }
    })
})

router.get('/getCategory', auth.authenticateToken, (req, res, next) => {
    var query = "select * from category order by name"
    connection.query(query, (error, result) => {
        if (!error) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(error)
        }
    })
})

router.patch('/updateCategory', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let category = req.body;
    var sqlQuery = 'update category set name =? where id=?'
    connection.query(sqlQuery, [category.name, category.id], (error, result) => {
        if (!error) {
            if (result.affectedRows == 0) {
                return res.status(400).json({
                    message: "Categoty id not found"
                })
            } else {
                return res.status(200).json({
                    messsage: "Category updated successfully"
                })
            }
        } else {
            return res.status(500).json(error)
        }
    })
})

module.exports = router