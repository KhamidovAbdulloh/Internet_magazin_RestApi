const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const errorHandler = require('./middleware/error')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')

const AuthRoutes = require('./routes/auth')
const ProductsRoutes = require('./routes/products')


//Initialize env variables
dotenv.config()

// App instance
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))


// Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}



//Register routes
app.use('/api/v1/auth', AuthRoutes)
app.use('/api/v1/products', ProductsRoutes)

app.use(errorHandler)












const startApp = async () => {
    try {
        mongoose.set("strictQuery", false)
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Mongo DB connected')
        const PORT = process.env.PORT || 4100
        app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

startApp()