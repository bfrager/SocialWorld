var circle = new THREE.Shape();
var radius = 6;

for (var i = 0; i < 16; i++) {
  var pct = (i + 1) / 16;
  var theta = pct * Math.PI * 2.0;
  var x = radius * Math.cos(theta);
  var y = radius * Math.sin(theta);
  if (i == 0) {
    circle.moveTo(x, y);
  } else {
    circle.lineTo(x, y);
  }
}

var geometry = circle.makeGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var mesh = new THREE.Mesh(geometry, material);
