// Supplemental code for referring to when designing program
// from HW3

const DB = require('../models/product.js');
// const Employee = DB.getModel();

module.exports.addEmployee =
    (req , res , next) => {

    res.render('addEmployeeView',
        {title:"Add a Employee"});
};

module.exports.deleteEmployee =
    (req , res , next) => {

    let id = req.params.id;

    Employee.findById(id,  (err, emp) => {
        if(err)
        console.log("Error Selecting : %s ", err);
    if (!emp)
        return res.render('404');

    emp.remove( (err) => {
        if (err)
        console.log("Error deleting : %s ",err );
    res.redirect('/employees');
});
});
};

module.exports.displayEmployees =
    (req , res , next) => {

    Employee.find({}, (err , employees) => {
        if(err)
        console.log("Error : %s ",err);

    let results = employees.map( (emp) => {
            return {
                id: emp._id,
                firstName: emp.firstName,
                lastName: emp.lastName
            }
        });

    res.render('displayEmployeesView',
        {title:"List of Employees", data:results});
});
};


module.exports.editEmployee =
    (req , res , next) => {

    let id = req.params.id;

    Employee.findById(id, (err, emp) => {
        if(err)
        console.log("Error Selecting : %s ", err);
    if (!emp)
        return res.render('404');

    res.render('editEmployeeView',
        {title:"Edit Employee",
            data: {id: emp._id,
                firstName: emp.firstName,
                lastName:  emp.lastName}
        });

});
};

module.exports.saveEmployee =
    (req , res , next) => {

    let emp = new Employee({
        firstName:     req.body.fname,
        lastName:       req.body.lname
    });

    emp.save((err) => {
        if(err)
        console.log("Error : %s ",err);
    res.redirect('/employees');
});

};

module.exports.saveAfterEdit =
    (req , res , next) => {

    let id = req.params.id;

    Employee.findById(id, (err, emp) => {
        if(err)
        console.log("Error Selecting : %s ", err);
    if (!emp)
        return res.render('404');

    emp.firstName = req.body.fname;
    emp.lastName  = req.body.lname;

    emp.save((err) => {
        if (err)
        console.log("Error updating : %s ",err );
    res.redirect('/employees');
});
});
};
