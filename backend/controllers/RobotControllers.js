const path = require("path");
const fs = require("fs");
const robotModel = require("../models/robotModel");
const { emitUpdate } = require("../sockets");

exports.getRobotDetails = async (req, res) => {
  try {
    const robot = await robotModel.getRobotById(req.params.id);
    if (!robot) {
      return res.status(404).json({ message: "Robot not found" });
    }
    res.json(robot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRobotDetails = async (req, res) => {
  const { id } = req.params;
  const {
    deb,
    challenge1,
    challenge2,
    challenge3,
    challenge4,
    challenge5,
    fin,
  } = req.query;

  const data = {
    deb: parseInt(deb),
    challenge1: parseInt(challenge1),
    challenge2: parseInt(challenge2, 10),
    challenge3: parseInt(challenge3, 10),
    challenge4: parseInt(challenge4, 10),
    challenge5: parseInt(challenge5, 10),
    fin: parseInt(fin, 10),
  };

  try {
    await robotModel.updateRobotById(id, data);
    emitUpdate("robotUpdate", { ...data });
    res.json({ message: "Robot updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveRobot = async (req, res) => {
  const robot = req.body;
  const filePath = path.join(__dirname, "..", "data", "robots.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading file");
    }

    let robots = [];
    if (data) {
      robots = JSON.parse(data);
    }

    robots.push(robot);

    fs.writeFile(filePath, JSON.stringify(robots, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error writing file");
      }

      res.status(200).send("Robot saved successfully");
    });
  });
};
