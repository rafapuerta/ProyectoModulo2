const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/registrar", function (req, res) {
  let db = req.app.locals.db;
  db.collection("usuarios").insertOne(
    {
      nombre: req.body.nombre,
      apellido1: req.body.apellido1,
      apellido2: req.body.apellido2,
      dni: req.body.dni,
      telf: req.body.telf,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.email, 10),
    },
    function (error, datos) {
      if (error !== null) {
        res.send({ mensaje: "Ha habido un error. " + error });
      } else {
        res.send({ mensaje: "Cliente registrado correctamente" });
      }
    }
  );
});

router.get("/login", function (req, res) {
  let db = req.app.locals.db;

  db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray(function (error, datos) {
      if (error !== null) {
        res.send({ mensaje: "Ha habido un error. " + error });
      } else {
        res.send(datos);
      }
    });
});

router.get("/check/:email", function (req, res) {
  let db = req.app.locals.db;
console.log(req.params.email)
  db.collection("usuarios")
    .find({ email: req.params.email })
    .toArray(function (error, datos) {
      if (error !== null) {
        res.send({ mensaje: "Ha habido un error. " + error });
      } else {
        res.send(datos);
      }
    });
});

module.exports = router;
