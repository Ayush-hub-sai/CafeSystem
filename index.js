const express = require('express')
var cors = require('cors')
const connection = require('./connection')
const userRoute = require('./routes/user')
const categoryRoute = require('./routes/category')
const productRoutes=require('./routes/product')
const billRoutes=require('./routes/bill')
const dashboardRoutes=require('./routes/dashboard')


const app = express()

app.use(cors())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use('/user', userRoute)
app.use('/category', categoryRoute)
app.use('/product', productRoutes)
app.use('/bill', billRoutes)
app.use('/dash', dashboardRoutes)




module.exports = app;