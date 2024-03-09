const employeeController = require("../controllers/employeeController");

const router = require("express").Router();

router.get("/status", employeeController.statusChart);
router.get("/salary", employeeController.salaryChart);
router.get("/location", employeeController.locationChart);

module.exports = router;
