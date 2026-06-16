const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', routes);
app.get('/health', (req,res)=>{
    return res.status(200).json({
        status : "ok"
    })
})

module.exports = app;