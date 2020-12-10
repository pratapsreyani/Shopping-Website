var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true}
});

// figure this shit out here

let connection = null;
let model = null;


module.exports = function getModel() {
    if (connection == null) {
        console.log("Creating connection and model...");
        connection = mongoose.createConnection(dbUrl);
        model = connection.model("EmployeeModel_kalathur",
            employeeSchema);
    };
    return model;
};


module.exports = mongoose.model('Product', schema);