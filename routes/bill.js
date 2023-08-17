const express = require('express')
const connection = require('../connection')
const router = express.Router()
var auth = require('../services/authenticate')
var checkRole = require('../services/checkRole')

router.post('/addBill', auth.authenticateToken, (req, res, next) => {
    let orderDetails = req.body;
    // "[{\"id\":1,\"price\":500,\"item\":\"chai\"}]"
    // json
    var sqlQuery = 'insert into bill (name,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?)';
    connection.query(sqlQuery, [orderDetails.name, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.total, orderDetails.productDetails, res.locals.email], (error, result) => {
        if (!error) {
            return res.status(200).json({
                data: result
            })
        } else {
            return res.status(500).json(error);
        }
    })
})

router.get('/getBill', auth.authenticateToken, (req, res) => {
    var sqlQuery = 'select * from bill'
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


router.delete('/deleteBill/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let id = req.params.id;
    var sqlQuery = 'delete from bill where id=?'
    connection.query(sqlQuery, [id], (error, result) => {
        if (!error) {
            if (result.affectedRows == 0) {
                return res.status(400).json({
                    message: "Order id does not found"
                })
            } else {
                return res.status(200).json({
                    messsage: "Order  deleted successfully"
                })
            }
        } else {
            return res.status(500).json(error)
        }
    })
})




module.exports = router