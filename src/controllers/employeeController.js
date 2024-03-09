const prisma = require("../../DB/db.config");

const employeeController = {
  //done
  addBulkEmployee: async (req, res, next) => {
    try {
      const { data } = req.body;
      const employees = data.map((employeeData) => ({
        EmployeeName: employeeData[0],
        EmployeeStatus: employeeData[1],
        JoiningDate: employeeData[2],
        BirthDate: employeeData[3],
        Skills: employeeData[4],
        SalaryDetails: employeeData[5],
        Address: employeeData[6],
      }));

      const updV = await prisma.employee.createMany({
        data: employees,
        skipDuplicates: true, // Skip insertion of duplicate entries
      });

      if (updV) {
        return res.status(201).json({
          success: true,
          message: "Employees added successfully",
        });
      }

      // res.status(201).json({ message: "Employees added successfully" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },
  // done
  addSingle: async (req, res) => {
    try {
      const {
        EmployeeName,
        EmployeeStatus,
        JoiningDate,
        BirthDate,
        Skills,
        SalaryDetails,
        Address,
      } = req.body;

      const Status = await prisma.employeeStatus.findUnique({
        where: {
          id: Number(EmployeeStatus),
        },
      });
      if (!Status) {
        return res.status(400).json({
          success: false,
          message: "Please select valid employee status.",
        });
      }
      const data = await prisma.employee.create({
        data: {
          EmployeeName,
          employeeStatusId: Number(EmployeeStatus),
          JoiningDate,
          BirthDate,
          Skills,
          SalaryDetails,
          Address,
        },
      });

      if (data) {
        return res.status(201).json({ status: true, data: "add employee." });
      }
      return res.status(201).json({ status: true, data: allEmployees });

      // res.status(201).json({ status: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },
  // done
  getAllEmployee: async (req, res) => {
    const { statusId } = req.query;
    console.log("he;;;p");
    console.log("statusId", statusId);
    try {
      let query = {
        include: {
          employeeStatus: {
            select: {
              status: true,
            },
          },
        },
      };

      if (statusId && statusId !== "0") {
        query = {
          ...query,
          where: {
            employeeStatusId: Number(statusId),
          },
        };
      }
      const allEmployees = await prisma.employee.findMany(query);
      if (!allEmployees) {
        return res.status(500).json({
          success: false,
          message: "no data found",
        });
      }
      return res
        .status(200)
        .json({ message: "Employees List", data: allEmployees });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },
  // done
  getOneEmployee: async (req, res) => {
    const { eid } = req.params;
    try {
      const row = await prisma.employee.findUnique({
        include: {
          employeeStatus: {
            select: {
              status: true,
            },
          },
        },
        where: {
          id: Number(eid),
        },
      });
      if (!row) {
        return res
          .status(400)
          .json({ success: false, message: "No data found" });
      }
      return res.status(200).json({ success: true, data: row });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },
  //done
  updateEmployee: async (req, res) => {
    const { eid } = req.params;
    try {
      const employeeData = await prisma.employee.findUnique({
        where: {
          id: Number(eid),
        },
      });
      if (!employeeData) {
        return res
          .status(400)
          .json({ success: false, message: "No data found" });
      }
      const update = await prisma.employee.update({
        data: req.body,
        where: {
          id: Number(eid),
        },
      });
      if (!update) {
        return res.status(400).json({
          success: false,
          message: "Data not update. Plase try again!",
        });
      }
      return res
        .status(200)
        .json({ success: true, message: "data update successfully" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },
  //done
  deleteEmployee: async (req, res) => {
    const { eid } = req.params;

    try {
      const deletedEmployee = await prisma.employee.delete({
        where: {
          id: Number(eid),
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "data delete", data: deletedEmployee });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },

  // charts APIs

  statusChart: async (req, res) => {
    try {
      const statuses = await prisma.employeeStatus.findMany();
      const totalEmployees = await prisma.employee.count();

      const chartData = await Promise.all(
        statuses.map(async (status) => {
          const employeesCount = await prisma.employee.count({
            where: {
              employeeStatusId: status.id,
            },
          });

          const percentage = (employeesCount / totalEmployees) * 100;

          return {
            status: status.status,
            count: employeesCount,
            percentage: percentage.toFixed(2), // Adjust decimal places as needed
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          totalEmployees,
          chartData,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },

  salaryChart: async (req, res) => {
    const { gap } = req.query;
    try {
      // Get the minimum and maximum salary values from the database
      const minmax = await prisma.employee.aggregate({
        _max: { SalaryDetails: true },
      });
      let maxSalary = minmax._max.SalaryDetails;
      // console.log("minSalary", minSalary);
      // console.log("maxSalary", maxSalary);
      // Define the dynamic salary ranges with a step of 50000
      const step = Number(gap);
      const salaryRanges = [];
      for (let i = 0; i <= maxSalary; i += step) {
        salaryRanges.push({ min: i, max: i + step - 1 });
      }
      const totalEmployees = await prisma.employee.count();
      // Fetch employees within each salary range
      const salaryChartData = await Promise.all(
        salaryRanges.map(async (range) => {
          const employeesCount = await prisma.employee.count({
            where: {
              SalaryDetails: {
                gte: range.min,
                lte: range.max,
              },
            },
          });
          const percentage = (employeesCount / totalEmployees) * 100;
          return {
            range: `${range.min} - ${range.max}`,
            count: employeesCount,
            percentage: percentage.toFixed(2), // Adjust decimal places as needed
          };
        })
      );

      res.status(200).json({
        salaryChartData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },

  locationChart: async (req, res) => {
    try {
      const locations = await prisma.employee.groupBy({
        by: ["Address"],
        _count: {
          _all: true,
        },
      });

      const totalEmployees = await prisma.employee.count();

      const locationChartData = locations.map((location) => {
        const employeesCount = location._count._all;
        const percentage = (employeesCount / totalEmployees) * 100;

        return {
          location: location.Address,
          count: employeesCount,
          percentage: percentage.toFixed(2), // Adjust decimal places as needed
        };
      });

      res.status(200).json({
        success: true,
        data: {
          totalEmployees,
          locationChartData,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },
};
module.exports = employeeController;
