const { exomployeeValidate } = require("../helper/employeValidation");
exports.validator = (req, res, next) => {
  try {
    const { error } = exomployeeValidate.validate(req.body);
    if (error) {
      return res.status(500).json({
        success: true,
        message: error.message,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
