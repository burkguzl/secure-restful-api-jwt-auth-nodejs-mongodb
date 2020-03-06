const express = require('express');
const app = express();
const port = process.env.port;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRouter = require('./routers/user');

app.use(userRouter);

app.listen(port, () => {
    console.log('Server is running on 8081 port !');
})

//mongodb
mongoose.connect('mongodb://localhost:27017/restful?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, () => {
        console.log('Mongoose connected');
    });

