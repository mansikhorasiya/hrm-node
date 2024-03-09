const Joi = require("joi");

exports.exomployeeValidate = Joi.object({
  EmployeeName: Joi.string().min(3).max(30).required(),

  EmployeeStatus: Joi.number().required(),

  JoiningDate: Joi.string().required(),

  BirthDate: Joi.string().required(),

  Skills: Joi.string().required(),

  SalaryDetails: Joi.number().required(),
  Address: Joi.string().required(),
});
