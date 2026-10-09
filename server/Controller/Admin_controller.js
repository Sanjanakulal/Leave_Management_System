
const admintable = require("../Models/Admin_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = process.env.JWT_SECRET || "LeaveManagement_2026_SecureKey_9x7Kp2";


const registeradmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const existingAdmin = await admintable.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        const admindetail = new admintable({
            email,
            password: hashedPassword
        });

        await admindetail.save();

        res.status(201).json({
            success: true,
            message: "Admin registered successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const loginbyadmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const userlogin = await admintable.findOne({ email });

        if (
            !userlogin ||
            !(await bcrypt.compare(password, userlogin.password))
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: userlogin._id, role: "admin" },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = { registeradmin, loginbyadmin };
