const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

mongoose.connect("mongodb://127.0.0.1:27017/Sample")
    .then(() => {
        console.log("connected with mongodb")
    })
    .catch(err => {
        console.log(err)
    })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
})

const Product = mongoose.model("Product", productSchema)

// create product
app.post('/api/v1/product/new', async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        status: true,
        product
    })
})

// read product
app.get('/api/v1/products', async (req, res) => {
    const products = await Product.find()
    res.status(200).json({
        success: true,
        products
    })
})

// update product
app.put('/api/v1/product/:id', async (req, res) => {
    let product = await Product.findById(req.params.id);
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })
})

// delete product
app.delete('/api/v1/product/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        res.status(500).json({
            success: false,
            message: "product not found"
        })
    }
    await product.deleteOne()

    res.status(200).json({
        success: true,
        message: "product is deleted"
    })
})

app.listen(3000, () => {
    console.log("server is listening at http://localhost:3000")
})