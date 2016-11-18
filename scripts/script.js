// general vocabulary:
// lat is y
// lng is x

var scene;

             // Global camera object
var camera;

// The cube has to rotate around all three axes, so we need three rotation values.

// x, y and z rotation
var xRotation = 0.0;
var yRotation = 0.0;
var zRotation = 0.0;

// Global mesh object of the cube
var cubeMesh;


var xRotation = 0.0;
var yRotation = 0.0;
var zRotation = 0.0;
var data_coords = [];
var data_map = d3.map();



// loading the data / starting with loading the locations
function loadData(){
	d3.queue()
		.defer(d3.csv, "data/locations.csv")
    .await(dataLoaded);
}

function dataLoaded(err, data){
	// console.log("data load", data);
	// console.log("data load", data);\
	initializeScene(data);


	// console.log("data_coords", data_coords);
	// Initialize the scene


	// Animate the scene
	animateScene();
}


loadData();


function initializeScene(data){



	// configurations for the position of the image and bounding box of the visible extent


	frameConfig = new (function() {
	  this.height = 20;
	  this.width = 20;
	  this.bbox_reference_bottom_left_y = 34.085700;
	  this.bbox_reference_bottom_left_x = -118.291728;
	  this.bbox_reference_top_right_y = 34.091616;
	  this.bbox_reference_top_right_x = -118.284403;
	});

	// scales for mapping the points to the x y coordinates
	scalerConfig = new (function(){
		this.lat_min = d3.min(data,function(d){
			return d.lat;
		})
		this.lat_max = d3.max(data,function(d){
			return d.lat;
		})
		this.lon_min = d3.min(data,function(d){
			return d.lon;
		})
		this.lon_max = d3.max(data,function(d){
			return d.lon;
		})

		this.lat_scale = d3.scaleLinear().range([0, frameConfig.height]).domain([this.lat_min, this.lat_max]);
		this.lng_scale = d3.scaleLinear().range([0, frameConfig.width]).domain([this.lon_min,this.lon_max]);

	})


	data.forEach(function(each){
		data_coords.push({
			'x': scalerConfig.lng_scale(each.lon),
			'y': scalerConfig.lat_scale(each.lat)
		})

	})



	// console.log(scalerConfig.lat_min, scalerConfig.lat_max);
	// long_dif = frameConfig.bbox_reference_top_right_y - frameConfig.bbox_reference_bottom_left_y;






	// making the renderer

	// detecting if the browser supports webGL
	if(Detector.webgl){
		renderer = new THREE.WebGLRenderer({antialias:true});
	} else {
		renderer = new THREE.CanvasRenderer();
	}

	// setting renderer properties

	renderer.setClearColor(0x00000, 1);


	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;


	renderer.setSize(canvasWidth, canvasHeight);
	document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

	// setting up the scene and camera

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 100, canvasWidth / canvasHeight, 1, 100 );

	camera.position.set(frameConfig.width/2,frameConfig.height/2,10);
	// camera.lookAt(scene.position);

	controls = new THREE.OrbitControls(camera);
	scene.add(camera);


	// setting the box geometry for the background / under;ying image

	var boxGeometry = new THREE.BoxGeometry(frameConfig.width, frameConfig.height, 0.01);

	var mapTexture = new THREE.ImageUtils.loadTexture('ph2.png');

	var boxMaterial = new THREE.MeshBasicMaterial({
		map: mapTexture,
		side:THREE.DoubleSide

	});

	boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.position.set(frameConfig.width/2,frameConfig.height/2,0.02);
	scene.add(boxMesh);




//
group = new THREE.Group();
// making a small sphere as a market for the points and put it on the actuall locations
	data_coords.forEach(function(coord){
		var geometry = new THREE.SphereGeometry(0.1, 10, 10, 0, Math.PI * 2, 0, Math.PI * 2);
		var material = new THREE.MeshNormalMaterial();
		var cube = new THREE.Mesh(geometry, material);
		cube.position.x = coord.x;
		cube.position.y = coord.y;
		cube.position.z = 2;
    group.add(cube);


	})

scene.add(group);



//


   // setting up geometry for the visualization itself
   	var triangleShape = new THREE.Shape();

		// triangleShape.moveTo(-0.2, -2);
		// triangleShape.lineTo(-0.2, 0);
		// triangleShape.lineTo(0, 0);
		// triangleShape.lineTo(0, -2);
		// triangleShape.lineTo(-0.2, -2);
		triangleShape.moveTo(data_coords[0].x, data_coords[0].y);
		data_coords.shift();


		data_coords.forEach(function(coord){
			console.log("coord", coord)
			triangleShape.lineTo(coord.x, coord.y);
		})

	extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {amount: 15, bevelEnabled: false});
 	extrudedMesh = new THREE.Mesh(extrudedGeometry, new THREE.MeshPhongMaterial({color: 0xff0000}));
	// extrudedMesh.position.set(0,0,0)
	// scene.add(extrudedMesh);

   // var vizTexture = new THREE.textt
}


function animateScene(){
	xRotation += 0.01;
	yRotation += 0.03;
	zRotation += 0.00;
  console.log(group)
  // group.position.z += d3.randomUniform(-0.1, 0.1)();
  // var objectGroup = group[0].parent;

  for (j = 0; j < group.children.length; j++) {
    // group.children[j].material.color.setHex(0x1A75FF);
    group.children[j].position.z += d3.randomUniform(-0.1, 0.1)();

}
// 	extrudedMesh.rotation.set(xRotation, yRotation, zRotation);
// 	var triangleShape = new THREE.Shape();
// 	triangleShape.moveTo(xRotation, -2);
// 	triangleShape.lineTo(-0.2, 0);
// 	triangleShape.lineTo(0, xRotation);
// 	triangleShape.lineTo(0, -2);
// 	triangleShape.lineTo(-xRotation, -2);
// 	 extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {amount: d3.randomUniform(-1, 1)(), bevelEnabled: false});
//  extrudedMesh = new THREE.Mesh(extrudedGeometry, new THREE.MeshPhongMaterial({color: 0xff0000}));
// scene.add(extrudedMesh);
	requestAnimationFrame(animateScene);

	renderScene();


}


function renderScene(){
	// console.log(e)

	renderer.render(scene, camera);
}

gui = new dat.GUI;
params = new (function() {
  this.speed = 1;
  this.camX = 19;
  this.camY = 21;
  this.camFov = -2.1;
});
gui.add(params, 'camX', -90, 90).onChange(function(e) {
  renderScene(e);
  return;
});
gui.add(params, 'camY', -90, 90).onChange(function(e) {
  return renderScene(e);
});
gui.add(params, 'camFov', -20, 79).onChange(function(e) {
  return renderScene(e);
});
gui.add(params, 'speed', -5, 5).onChange(function(e) {
  renderScene(e);
  return;
});
