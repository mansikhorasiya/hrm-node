const router = require("express").Router();

router.use("/employe", require("./employee.routes"));

// status routes
router.use("/status", require("./employeeStatus.routes"));

// charts routes
router.use("/charts", require("./charts.routes"));

module.exports = router;
