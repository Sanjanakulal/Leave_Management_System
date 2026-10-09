const express = require("express");
const {
    registeremployee,
    loginemployee,
    getcurrentemployee
} = require("../Controller/Employee_controller");

const employeetable = require("../Models/Employee_model");
const employeeauth = require("../Middleware/Auth");

const route = express.Router();

route.post("/register", registeremployee);
route.post("/login", loginemployee);

route.get("/me", employeeauth, getcurrentemployee);


route.get("/all", async (req, res) => {
    try {
        const employees = await employeetable
            .find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            employees
        });
    } catch (error) {
        console.error("Get all employees error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = route;
