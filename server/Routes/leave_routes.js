const express = require("express");
const router = express.Router();

const {
    applyleave,
    getmyleaves,
    getallleaves,
    updateleavestatus
} = require("../Controller/Leave_controller");

const employeeauth = require("../Middleware/Auth");

router.post("/apply", employeeauth, applyleave);
router.get("/my-leaves", employeeauth, getmyleaves);
router.get("/all", getallleaves);
router.patch("/:id/status", updateleavestatus);

module.exports = router;
