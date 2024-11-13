const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use('/web', express.static('web'));
const UserAgent = require('user-agents');

const PORT = process.env.PORT || 55555;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);


});

const {  getdata} = require('./BattleSrp.js');

app.post('/getBattleLogin', bodyParser.json(), bodyParser.urlencoded({ extended: false }),async  function(req, res) {
    var password = req.body.password;
    var srpParams = req.body.srpParams;
    res.json(getdata(srpParams,password));

});

app.get('/randUa' , (req, res) => {

    res.send(new UserAgent( ).toString());

});
