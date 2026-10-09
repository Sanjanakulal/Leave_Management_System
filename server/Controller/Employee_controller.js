
const employeetable = require("../Models/Employee_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = process.env.JWT_SECRET || "LeaveManagement_2026_SecureKey_9x7Kp2";


const registeremployee = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const existingemployee = await employeetable.findOne({ email });

        if (existingemployee) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const lastEmployee = await employeetable
            .findOne({ employeeId: { $exists: true } })
            .sort({ employeeId: -1 });

        let nextNumber = 1;

        if (lastEmployee && lastEmployee.employeeId) {
            const lastNumber = parseInt(
                lastEmployee.employeeId.replace("EMP", ""),
                10
            );

            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }

        const employeeId = `EMP${String(nextNumber).padStart(3, "0")}`;

        const employeedetails = new employeetable({
            employeeId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            phone
        });

        await employeedetails.save();

        return res.status(201).json({
            success: true,
            message: "Employee registered successfully",
            employeeId: employeedetails.employeeId
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email or Employee ID already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const loginemployee = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const employee = await employeetable.findOne({
            email: email.trim().toLowerCase()
        });

        if (
            !employee ||
            !(await bcrypt.compare(password, employee.password))
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: employee._id,
                role: "employee"
            },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            name: employee.name,
            employeeId: employee.employeeId,
            id: employee._id,
            leaveBalance: employee.leaveBalance
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getcurrentemployee = async (req, res) => {
    try {
        const employee = await employeetable
            .findById(req.userid.id)
            .select("-password");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            employee
        });
    } catch (error) {
        console.error("Get current employee error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {registeremployee,loginemployee,getcurrentemployee};