const employeeController = require("../controllers/employeeController");
const { validator } = require("../middlewares/validation");
const router = require("express").Router();

router.post("/", validator, employeeController.addSingle);
router.get("/:eid", employeeController.getOneEmployee);
router.put("/:eid", employeeController.updateEmployee);
router.delete("/:eid", employeeController.deleteEmployee);
router.get("/data/all", employeeController.getAllEmployee);
router.post("/bulk-upload", employeeController.addBulkEmployee);

module.exports = router;
