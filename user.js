const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/registrar", function (req, res) {
  let db = req.app.locals.db;
  let email = req.body.email;
  db.collection("usuarios")
    .find({ email: email })
    .toArray(function (error, datos) {
      if (error !== null) {
        res.send({ mensaje: "Ha habido un error. " + error });
      } else {
        if (datos.length != 0) {
          res.send({ unico: false, mensaje: "Email ya registrado." });
        } else {
          db.collection("usuarios").insertOne(
            {
              nombre: req.body.nombre,
              apellido1: req.body.apellido1,
              apellido2: req.body.apellido2,
              dni: req.body.dni,
              telf: req.body.telf,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, 10),
            },
            function (error, datos) {
              if (error !== null) {
                res.send({ mensaje: "Ha habido un error. " + error });
              } else {
                res.send({
                  unico: true,
                  mensaje: "Cliente registrado correctamente.",
                });
              }
            }
          );
        }
      }
    });
});

router.put("/login", function (req, res) {
  let db = req.app.locals.db;

  db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray(function (error, datos) {
      if (error !== null) {
        res.send({ mensaje: "Ha habido un error. " + error });
      } else {
        if (datos.length == 0) {
          res.send({ error: true, mensaje: "e-mail no registrado" });
        } else {
          if (bcrypt.compareSync(req.body.password, datos[0].password)) {
            res.send({ error: false, mensaje: "Login correcto." });
          } else {
            res.send({ error: true, mensaje: "Contraseña Incorrecta" });
          }
        }
      }
    });
});

router.put("/perfil", function (req, res) {
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

router.put("/perfil/editar", function (req, res) {
  let db = req.app.locals.db;

  let email = req.body.email;
  let nombre = req.body.nombre;
  let apellido1 = req.body.apellido1;
  let apellido2 = req.body.apellido2;
  let dni = req.body.dni;
  let telf = req.body.telf;

  db.collection("usuarios").updateOne(
    { email: email },
    {
      $set: {
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        dni: dni,
        telf: telf,
      },
    },
    function (error, datos) {
      if (error !== null) {
        res.send({ mensaje: "Ha habido un error. " + error });
      } else {
        res.send({ mensaje: "Usuario editado correctamente" });
      }
    }
  );
});

router.delete("/perfil/borrar", function(req, res){
  let db = req.app.locals.db;
  
  db.collection("usuarios").deleteOne({email: req.body.email}, function (error, datos) {
    if (error !== null) {
      res.send({ mensaje: "Ha habido un error. " + error });
    } else {
      res.send({ mensaje: "Usuario eliminado correctamente" });
    }
  })
})

module.exports = router;
