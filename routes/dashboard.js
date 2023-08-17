const express = require('express')
const connection = require('../connection')
const router = express.Router()
var auth = require('../services/authenticate')
var checkRole = require('../services/checkRole')


router.get('/details', auth.authenticateToken, (req, res) => {
    var categoryCount;
    var productCount;
    var billCount;
    var sqlQuery = 'select  count(id) as categoryCount from category'
    connection.query(sqlQuery, (error, result) => {
        if (!error) {
            categoryCount = result[0].categoryCount
        } else {
            return res.status(500).json(error);
        }
    })

    var sqlQuery = 'select  count(id) as productCount from product'
    connection.query(sqlQuery, (error, result) => {
        if (!error) {
            productCount = result[0].productCount

        } else {
            return res.status(500).json(error);
        }
    })

    var sqlQuery = 'select  count(id) as billCount from bill'
    connection.query(sqlQuery, (error, result) => {
        if (!error) {
            billCount = result[0].billCount
            var data = {
                category: categoryCount,
                product: productCount,
                bill: billCount
            }
            return res.status(200).json(data)

        } else {
            return res.status(500).json(error);
        }
    })
})


module.exports = router