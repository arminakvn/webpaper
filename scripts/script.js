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

// Initialize the scene 
initializeScene(); 

// Animate the scene 
animateScene(); 
var xRotation = 0.0; 
var yRotation = 0.0; 
var zRotation = 0.0; 







function initializeScene(frameConfig){
	frameConfig = new (function() {
	  this.height = 10;
	  this.width = 10;
	  this.bbox_reference_bottom_left_x = 34.085700;
	  this.bbox_reference_bottom_left_y = -118.291728;
	  this.bbox_reference_top_right_x = 34.091616;
	  this.bbox_reference_top_right_y = -118.284403;
	});
	console.log(frameConfig);
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
	
	camera.position.set(0,0,10);
	camera.lookAt(scene.position);
	
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
	boxMesh.position.set(0.0,0.0,4.0);
	scene.add(boxMesh);



   // setting up geometry for the visualization itself
   var triangleShape = new THREE.Shape();
	triangleShape.moveTo(-0.2, -2);
	triangleShape.lineTo(-0.2, 0);
	triangleShape.lineTo(0, 0);
	triangleShape.lineTo(0, -2);
	triangleShape.lineTo(-0.2, -2);
	 extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {amount: 5, bevelEnabled: false});
 extrudedMesh = new THREE.Mesh(extrudedGeometry, new THREE.MeshPhongMaterial({color: 0xff0000}));
scene.add(extrudedMesh);

   // var vizTexture = new THREE.textt
}


function animateScene(){
	xRotation += 0.01;
	yRotation += 0.03;
	zRotation += 0.00;
	extrudedMesh.rotation.set(xRotation, yRotation, zRotation);
	var triangleShape = new THREE.Shape();
	triangleShape.moveTo(xRotation, -2);
	triangleShape.lineTo(-0.2, 0);
	triangleShape.lineTo(0, xRotation);
	triangleShape.lineTo(0, -2);
	triangleShape.lineTo(-xRotation, -2);
	 extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {amount: d3.randomUniform(-1, 1)(), bevelEnabled: false});
 extrudedMesh = new THREE.Mesh(extrudedGeometry, new THREE.MeshPhongMaterial({color: 0xff0000}));
scene.add(extrudedMesh);

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