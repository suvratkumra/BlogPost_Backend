const mongoose = require('mongoose');

const connect = ()=> mongoose.connect("mongodb+srv://suvratkumra:12345@mernstack.mtz1rlo.mongodb.net/?retryWrites=true&w=majority").then(console.log("DB Connected")).catch((err) => console.log(err));

module.exports = connect;