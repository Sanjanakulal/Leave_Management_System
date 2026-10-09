const express = require("express");
const dbconnection = require("./db");
const cors = require("cors");

const adminroute = require('./Routes/admin_routes');
const employeeroute = require('./Routes/employee_routes');
const leaveroute = require("./Routes/leave_routes");

const app = express();

// const PORTNUMBER = 5000;
const PORTNUMBER = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/apitest', (req, res) => {
    res.send("Hello Server");
});

app.use('/admin', adminroute);
app.use('/employee', employeeroute);
app.use("/leave", leaveroute);


dbconnection();

app.listen(PORTNUMBER, () => {
    console.log(`Server is running on portnumber: ${PORTNUMBER}`);
});