const express = require("express");
const router = express.Router();

router.get("/conciertos", function (req, res) {
  let db = req.app.locals.db;

  db.collection("conciertos")
    .find()
    .toArray(function (error, datos) {
      if (error !== null) {
        res.send({ mensaje: "Ha habido un error. " + error });
      } else {
        res.send(datos);
      }
    });
});

module.exports = router;
