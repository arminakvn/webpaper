var scene;
var camera;


// Global mesh object of the cube
var cubeMesh;
var data_coords = [];
var data_map = d3.map();



// ui interactions are updating this which is what the animateScene uses
var ui_current_state = d3.map();
var data_mapped = d3.map()
var device_per_street_map = d3.map()
//setting defult values for ui
ui_current_state.set("component", "loudness")
ui_current_state.set("data_needs_to_filter", 0)

// // loading the data / starting with loading the locations
function loadData(){
	d3.queue()
		.defer(d3.csv,"locations_nest.csv", parseLocations)
    .defer(d3.csv,"res2.csv", parseSamples)
    .await(callbackDataLoaded)
}

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var samples_mapped = d3.map()

// function
function callbackDataLoaded(err, csv_data, sample_data){
  var lat_min = d3.min(csv_data,function(d){
    return d.lat;
  })
  var lat_max = d3.max(csv_data,function(d){
    return d.lat;
  })
  var lon_min = d3.min(csv_data,function(d){
    return d.lon;
  })
  var lon_max = d3.max(csv_data,function(d){
    return d.lon;
  })
  var max_High = d3.max(sample_data, function(d){
    return d.High
  })
  var min_High = d3.min(sample_data, function(d){
    return d.High
  })

  var min_time = d3.min(sample_data,function(d){
    return d.time;
  })
  var max_time = d3.max(sample_data,function(d){
    return d.time;
  })
  ui_current_state.set("rangestart", min_time)
  ui_current_state.set("rangeend", max_time)
  scalerConfig = new (function(){
		this.lat_scale = d3.scaleLinear().range([frameConfig.padding_bottom,frameConfig.height - frameConfig.padding_top]).domain([lat_min, lat_max]);
		this.lng_scale = d3.scaleLinear().range([frameConfig.width-frameConfig.padding_left,frameConfig.padding_right]).domain([lon_min, lon_max]);
    this.High_scale = d3.scaleLinear().range([0, frameConfig.height]).domain([min_High, max_High]);
    this.Components_scale = d3.scaleOrdinal()
      .range(["#bd0026", "#ffffb2", "#fd8d3c"])
      .domain(["loudness","frequency"]);
    this.time_range = [min_time,max_time];
	})

  var nested_samples = d3.nest()
    .key(function(d){
      return d.DeviceId;
    })
    .entries(sample_data);

  nested_samples.forEach(function(dev_d){
    var devic_id = dev_d.key;
    var device_mapped_id_value = d3.map();

    dev_d.values.forEach(function(d){
      var device_mapped_values = d3.map();
      device_mapped_values.set("High",d.High);
      device_mapped_values.set("Leqdba",d.Leqdba);
      device_mapped_values.set("Lmaxdba",d.Lmaxdba);
      device_mapped_values.set("Lmindba",d.Lmindba);
      device_mapped_values.set("Voice",d.Voice);
      device_mapped_id_value.set(d.time, device_mapped_values);
    })


  samples_mapped.set(devic_id,device_mapped_id_value)
  })

  var nested_data = d3.nest()
    .key(function(d) { return d.street; })
    .entries(csv_data);

  ui_current_state.set("rangestart", min_time);
  ui_current_state.set("rangeend", max_time);
  initializeScene(nested_data);
	// Animate the scene
	animateScene();
}


loadData();

function initializeScene(data){
	data.forEach(function(each_street){
    var street_name = each_street.key;
    var dev_ids = each_street.values.map(function(v){return v.id;})
    each_street.values.forEach(function(each_point){
      each_point.x = scalerConfig.lng_scale(each_point.lon)
      each_point.y = scalerConfig.lat_scale(each_point.lat)
      data_coords.push({
        'device_id': each_point.id,
  			'x': scalerConfig.lng_scale(each_point.lon),
  			'y': scalerConfig.lat_scale(each_point.lat),
        'name': street_name,
        'device_values': samples_mapped.get(each_point.id)
  		})
    })
    device_per_street_map.set(street_name,dev_ids)
	})



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
	camera = new THREE.PerspectiveCamera( 60, canvasWidth / canvasHeight, 1, frameConfig.fow );
// camera = new THREE.PerspectiveCamera((frameConfig.width / - 2) - 1 , (frameConfig.width / 2) + 1, frameConfig.height / 3, frameConfig.height / - 3, 1, 1000 )

  // controls = new THREE.OrbitControls(camera);
  // controls.enableZoom = true;
// controls.addEventListener( 'change', renderScene );
// window.addEventListener( 'resize', onWindowResize, false );
	// setting the box geometry for the background / under;ying image
	var boxGeometry = new THREE.BoxGeometry(frameConfig.width, frameConfig.height, 0.01);
	var mapTexture = new THREE.ImageUtils.loadTexture('ph8.png');
	var boxMaterial = new THREE.MeshBasicMaterial({
		map: mapTexture,
		side:THREE.DoubleSide

	});

	boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.position.set(frameConfig.width/2,frameConfig.height/2,0.02);
	scene.add(boxMesh);

  group = new THREE.Group();
  lineGroup = new THREE.Group();
  surfaveGroup = new THREE.Group()
  lineGeometry = new THREE.Geometry();
  lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });

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

  // possibly using curves later on, but line segments for now
  street_lines_group = new THREE.Group();
  street_curves_group = new THREE.Group();
  data.forEach(function(coord){
    var lineGroup = new THREE.Group();
    var lineMaterial = new THREE.LineBasicMaterial({
      color: "red",
      linewidth:4,
    });
    var lineGeometry = new THREE.Geometry();
    var curveGeometry = new THREE.Geometry();
    coord.values.forEach(function(e){
      lineGeometry.vertices.push(new THREE.Vector3(e.x, e.y, 2));
      var line = new THREE.LineSegments(lineGeometry, lineMaterial);
      lineGroup.add(line)
    })
    street_lines_group.add(lineGroup)
  })


  device_per_street_map.keys().forEach(function(each_street_key){
    var devices = device_per_street_map.get(each_street_key);
    devices.forEach(function(device){
      var device_values = samples_mapped.get(device);
      device_values.keys().forEach(function(d_times_key){
        if (filterValuesByTime(d_times_key) > 0) {
          var values_for_pointtime = device_values.get(d_times_key);
        }
      })
    })
  })

  // lineGeometry.vertices.push(new THREE.Vector3(coord.x, coord.y, 2));
  // var line = new THREE.Line(lineGeometry, lineMaterial);
  // lineGroup.add(line)
  camera.position.set(frameConfig.width/2, -frameConfig.height/3, frameConfig.camera_z);
  camera.lookAt(new THREE.Vector3(frameConfig.width/2, frameConfig.height/2, 0));
  scene.add(camera);

  scene.add(street_lines_group);
  scene.add(street_curves_group);
  scene.add(group);



}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  renderScene();

}



function animateScene(){
  if (ui_current_state.get("data_needs_to_filter") > 0){
    data  = filterData()
  } else {
  }
  for (ji = 0; ji < street_lines_group.children.length; ji++) {
    // group.children[j].material.color.setHex(0x1A75FF);
    for (j = 0; j < street_lines_group.children[ji].children.length; j++) {
      // console.log(street_lines_group.children[ji].children[j])
      for (v = 0; v < street_lines_group.children[ji].children[j].geometry.vertices.length; v++) {
          //here use
          // location
          // time frame we interested
          // attribute we want to
          // devide the number of observations we want to show to frame rotate to use as time intervale
          // scale the z value in each time interval
          //
        street_lines_group.children[ji].children[j].material.color = makeColorToUpdate();
          // street_lines_group.children[ji].children[j].material._needsUpdate = true;
        street_lines_group.children[ji].children[j].geometry.vertices[v].z = d3.randomUniform(0, 2)();
        street_lines_group.children[ji].children[j].geometry.verticesNeedUpdate = true;
      }
    }
  }
  for (j = 0; j < group.children.length; j++) {
    group.children[j].position.z += d3.randomUniform(-0.1, 0.1)();

  }
	requestAnimationFrame(animateScene);
  // controls.update();
	renderScene();
}


function renderScene(){
	renderer.render(scene, camera);
}


function makeColorToUpdate(){
  var color = new THREE.Color(
    scalerConfig.Components_scale(
      ui_current_state.get("component")
    )
  );
  return color
}

var day = d3.utcDay(new Date);


function updateDataForViz(data){
}
function updateViz(){
  console.log("ipdate")
  console.log(makeColorToUpdate())
}

// gui = new dat.GUI;
// params = new (function() {
//   this.speed = 1;
//   this.camX = 19;
//   this.camY = 21;
//   this.camFov = -2.1;
// });
// gui.add(params, 'camX', -90, 90).onChange(function(e) {
//   renderScene(e);
//   return;
// });
// gui.add(params, 'camY', -90, 90).onChange(function(e) {
//   return renderScene(e);
// });
// gui.add(params, 'camFov', -20, 79).onChange(function(e) {
//   return renderScene(e);
// });
// gui.add(params, 'speed', -5, 5).onChange(function(e) {
//   renderScene(e);
//   return;
// });
