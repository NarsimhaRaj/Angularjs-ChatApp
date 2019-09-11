const express = require('express');
const app = express();
const registerRouter = require('./Router/router');
const bodyParser=require('body-parser');
const expressValidator=require('express-validator');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(expressValidator());

app.use('/register',registerRouter);

app.listen(4000);
