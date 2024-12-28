const robotModel = require("../models/robotModel");

exports.getRobotDetails = async (req, res) => {
  const { name } = req.params;
  try {
    const robot = await robotModel.getRobotByName(name);
    if (!robot) {
      return res.status(404).json({ message: "Robot not found" });
    }
    res.json(robot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
