const routes = require('express').Router();
const dbHandler = require("../../databaseHandler");

routes.post('/', (req, res) => {
  const userData = req.body;
  console.log(userData);
  
  dbHandler.addScheduledClass(userData.ClassID, userData.UserID);
  res.json({message : "Schedule-pair sent to database"});
});

module.exports = routes;