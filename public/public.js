
/* const QRCode = require("qrcode") */
 
QRCode.toCanvas( document.getElementById("canvas2"), 'Probando', function (error) {
  if (error) console.error(error)
  console.log('success!');
})