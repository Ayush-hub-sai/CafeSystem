const express = require('express')
const connection = require('../connection')
const router = express.Router()

const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config();

var auth = require('../services/authenticate')
var checkRole = require('../services/checkRole')


router.post('/signup', (req, response) => {
    let user = req.body;
    query = 'select email,password,role,status from user where email=?'
    connection.query(query, [user.email], (error, result) => {
        if (!error) {
            if (result.length <= 0) {
                query = 'insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,"false","user")'
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return response.status(200).json({
                            message: 'Successfully Registered'
                        })
                    } else {
                        return response.status(500).json(err)
                    }
                })
            } else {
                return response.status(400).json({
                    message: "Email Already Exists"
                })
            }
        } else {
            return response.status(500).json(error)
        }
    })
})


router.post('/login', (req, res) => {
    const user = req.body;
    query = 'select email, password, role, status from user where email=?'

    connection.query(query, [user.email], (error, result) => {
        if (!error) {
            if (result.length <= 0 || result[0].password !== user.password) {
                res.status(401).json({
                    message: 'In correct username or password.'
                });
            } else if (result[0].status == 'false') {
                res.status(401).json({
                    message: 'You need to wait for admin approval'
                });
            } else if (result[0].password == user.password) {
                const response = {
                    email: result[0].email,
                    role: result[0].role
                }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
                    expiresIn: '8h'
                })
                res.status(200).json({
                    token: accessToken
                })
            } else {
                return res.status(400).json({
                    message: 'Something went wrong, Please try again later.'
                })
            }
        } else {
            res.status(500).json(error)
        }
    })
})

//not used
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD
//     }
// })

// router.post('/forgotPassword', auth.authenticateToken, (req, res) => {
//     const user = req.body;
//     query = 'select email, password from user where email=?'

//     connection.query(query, [user.email], (error, result) => {
//         if (!error) {
//             if (result.length <= 0) {
//                 res.status(200).json({
//                     message: 'password sent successfully to your email address.'
//                 })
//             } else {
//                 var mailOptions = {
//                     from: process.env.EMAIL,
//                     to: result[0].email,
//                     subject: 'Password by cafe management system',
//                     html: '<p><b>Your login details for cafe management system.</b><br><b>Email:</b>' + result[0].email + '<br><b>Password:</b>' + result[0].password + '<br><a href="http://localhost:4200">Click here to login</a>' + '</p>'
//                 };
//                 transporter.sendMail(mailOptions, (err, info) => {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         console.log('Email sent' + info.response);
//                     }
//                 })
//                 return res.status(200).json({
//                     message: 'Password sent successfully to your email address'
//                 })
//             }
//         } else {
//             return res.status(500).json(error)
//         }
//     })
// })

router.get('/getAllUser', auth.authenticateToken, (req, res) => {
    var sqlQuery = 'select id,name,email,contactNumber from user where role="user"';
    connection.query(sqlQuery, (error, result) => {
        if (!error) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(error)
        }
    })
})

router.patch('/updateStatus', auth.authenticateToken, (req, res) => {
    let user = req.body;
    const sqlQuery = 'update user set status=? where id=?';
    connection.query(sqlQuery, [user.status, user.id], (error, result) => {
        if (!error) {
            if (result.affectedRows == 0) {
                return res.status(404).json({
                    message: 'User is not exist'
                })
            } else {
                return res.status(200).json({
                    message: 'User status updated successfully'
                })
            }

        } else {
            return res.status(500).json(error)
        }
    })
})

router.post('/emailVerify', (req, res) => {
    var body = req.body.email;
    var sqlQuery = 'SELECT * FROM user WHERE email = ?';
    connection.query(sqlQuery, [body], (error, result) => {
        if (!error && result.length > 0) {
            return res.status(200).json({
                message: "Email verified successfully.",
                data: result
            });
        } else {
            return res.status(400).json({
                message: "Email is not verified. Please enter a valid email address."
            });
        }
    });
});

router.patch('/updatePassword', (req, res) => {
    var body = req.body;
    const sqlQuery = 'update user set password=? where id=? && email=?';
    connection.query(sqlQuery, [body.password, body.id, body.email], (error, result) => {
        if (!error) {
            if (result.affectedRows == 0) {
                return res.status(404).json({
                    message: 'Email is not exist'
                })
            } else {
                return res.status(200).json({
                    message: 'User password updated successfully'
                })
            }

        } else {
            return res.status(500).json(error)
        }
    })
})

router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({
        message: 'true'
    })
})

module.exports = router