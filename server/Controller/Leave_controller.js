const leavetable = require("../Models/Leave_model");
const employeetable = require("../Models/Employee_model");


const applyleave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        if (!leaveType || !startDate || !endDate || !reason?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide all leave details"
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date().toISOString().slice(0, 10);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            startDate < today ||
            endDate < startDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Please select valid leave dates"
            });
        }

        
        const employee = await employeetable.findById(req.userid.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const totalDays =
            Math.floor(
                (Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()) -
                Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())) /
                (1000 * 60 * 60 * 24)
            ) + 1;

        const leavedetails = new leavetable({
            employee: employee._id,
            employeeId: employee.employeeId,
            employeeName: employee.name,
            leaveType,
            startDate: start,
            endDate: end,
            reason: reason.trim(),
            totalDays,
            status: "Pending"
        });

        await leavedetails.save();

        return res.status(201).json({
            success: true,
            message: "Leave application submitted successfully",
            leave: leavedetails
        });
    } catch (error) {
        console.error("Apply leave error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getmyleaves = async (req, res) => {
    try {
        const leaves = await leavetable
            .find({ employee: req.userid.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            leaves
        });
    } catch (error) {
        console.error("Get leave history error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getallleaves = async (req, res) => {
    try {
        const leaves = await leavetable
            .find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            leaves
        });
    } catch (error) {
        console.error("Get all leaves error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const updateleavestatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid leave status"
            });
        }

      
        const leave = await leavetable.findOneAndUpdate(
            { _id: req.params.id, status: "Pending" },
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!leave) {
            return res.status(400).json({
                success: false,
                message: "Leave request not found or already processed"
            });
        }

        if (status === "Approved") {
            const employee = await employeetable.findOneAndUpdate(
                {
                    _id: leave.employee,
                    leaveBalance: { $gte: leave.totalDays }
                },
                { $inc: { leaveBalance: -leave.totalDays } },
                { new: true }
            );

            if (!employee) {
                
                await leavetable.updateOne(
                    { _id: leave._id, status: "Approved" },
                    { $set: { status: "Pending" } }
                );

                return res.status(400).json({
                    success: false,
                    message: "Employee not found or insufficient leave balance"
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: `Leave ${status.toLowerCase()} successfully`,
            leave
        });
    } catch (error) {
        console.error("Update leave status error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {applyleave,getmyleaves,getallleaves,updateleavestatus};
