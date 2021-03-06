var scene;
var camera;

var mTime = 0.0;
var mTimeStep = (1/60);
var mDuration = 20;
// Global mesh object of the cube
var cubeMesh;
var data_coords = [];
var data_map = d3.map();

var scene, renderer;
			var mouseX = 0, mouseY = 0;

// ui interactions are updating this which is what the animateScene uses
var ui_current_state = d3.map();
var data_mapped = d3.map()
var device_per_street_map = d3.map()
var device_latlng = d3.map()
//setting defult values for ui
ui_current_state.set("component", "loudness")
ui_current_state.set("data_needs_to_filter", 0)
ui_current_state.set("data_map_buffr_ind", [1]);
// // loading the data / starting with loading the locations
function loadData(){
	d3.queue()
		.defer(d3.csv,"locationsinter.csv", parseLocations) //locations_nest
    .defer(d3.csv,"res2.csv", parseSamples)
    .await(callbackDataLoaded)
}


var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");




requestStream = new (function(){
	this.line = function(){

	};
	this.totaltime = 49200000;
	this.dt_intervals = 164;
	this.dt = 0;
	this.frame_counter = 0;
	this.frequency = .5;
	this.frame_interval = 0.5
	this.duration = 10

});





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

	var max_Base = d3.max(sample_data, function(d){
    return d.Base
  })
  var min_Base = d3.min(sample_data, function(d){
    return d.Base
  })


	var max_Voice = d3.max(sample_data, function(d){
    return d.Voice
  })
  var min_Voice = d3.min(sample_data, function(d){
    return d.Voice
  })



	var max_Leqdba = d3.max(sample_data, function(d){
    return d.Leqdba
  })
  var min_Leqdba = d3.min(sample_data, function(d){
    return d.Leqdba
  })

	var max_Lmaxdba = d3.max(sample_data, function(d){
		return d.Lmaxdba
	})
	var min_Lmaxdba = d3.min(sample_data, function(d){
		return d.Lmaxdba
	})


	var max_Lmindba = d3.max(sample_data, function(d){
		return d.Lmindba
	})
	var min_Lmindba = d3.min(sample_data, function(d){
		return d.Lmindba
	})


  var min_time = d3.min(sample_data,function(d){
    return d.time;
  })
  var max_time = d3.max(sample_data,function(d){
    return d.time;
  })
  ui_current_state.set("rangestart", min_time)
  ui_current_state.set("rangeend", max_time)
	var color_scale_map = d3.map()
  scalerConfig = new (function(){
		this.lat_scale = d3.scaleLinear().range([frameConfig.padding_bottom,frameConfig.height - frameConfig.padding_top]).domain([lat_min, lat_max]);
		this.lng_scale = d3.scaleLinear().range([frameConfig.width-frameConfig.padding_left,frameConfig.padding_right]).domain([lon_min, lon_max]);
    this.High_scale = d3.scalePow().range([0, 4]).domain([40, 800]);
		this.Base_scale = d3.scalePow().range([0, 4]).domain([40, 800]);
		this.Voice_scale = d3.scalePow().range([0, 4]).domain([40, 800]);
		// this.Leqdba_scale = d3.scaleLog().range([0, 4]).domain([min_Leqdba, max_Leqdba]);
		// this.Lmaxdba_scale = d3.scaleLog().range([0, 4]).domain([min_Lmaxdba, max_Lmaxdba]);
		// this.Lmindba_scale = d3.scaleLog().range([0, 4]).domain([min_Lmindba, max_Lmindba]);

		this.Leqdba_scale = d3.scaleLog().range([1, 2]).domain([min_Leqdba, max_Leqdba]);
		this.Lmaxdba_scale = d3.scaleLog().range([2, 3]).domain([min_Lmaxdba, max_Lmaxdba]);
		this.Lmindba_scale = d3.scaleLog().range([0, 1]).domain([min_Lmindba, max_Lmindba]);
    this.Components_scale_Loudness = d3.scaleOrdinal()
      .range(["#bd0026", "#ffffb2", "#fd8d3c"])
      .domain(["Base","Voice","High"]);
		this.Components_scale_Frequency = d3.scaleOrdinal()
      .range(["#bd0026", "#ffffb2", "#fd8d3c"])
      .domain(["Lmindba","Leqdba","Lmaxdba"]);
    this.time_range = [min_time,max_time];
		this.color_scale_map = color_scale_map;
	})
	scalerConfig.color_scale_map.set("frequency", scalerConfig.Components_scale_Frequency);
	scalerConfig.color_scale_map.set("loudness", scalerConfig.Components_scale_Loudness)
  var nested_samples = d3.nest()
    .key(function(d){
      return d.DeviceId;
    })
    .entries(sample_data);

  nested_samples.forEach(function(dev_d){
    var devic_id = dev_d.key;
    var device_mapped_id_value = d3.map();


		var sorted_values = dev_d.values.sort(function(a,b){
			return d3.descending(a.time, b.time);
		})
    sorted_values.forEach(function(d){
      var device_mapped_values = d3.map();
      device_mapped_values.set("Base",d.Base);
			device_mapped_values.set("Voice",d.Voice);
      device_mapped_values.set("Leqdba",d.Leqdba);
      device_mapped_values.set("Lmaxdba",d.Lmaxdba);
      device_mapped_values.set("Lmindba",d.Lmindba);
      device_mapped_values.set("High",d.High);
      device_mapped_id_value.set(d.time, device_mapped_values);
    })


  samples_mapped.set(devic_id,device_mapped_id_value)
  })

  var nested_data = d3.nest()
    .key(function(d) { return d.street; })
    .entries(csv_data);

  ui_current_state.set("rangestart", min_time);
  ui_current_state.set("rangeend", max_time);




	nested_data.forEach(function(each_street){
		var street_name = each_street.key;
		var dev_ids = each_street.values.map(function(v){return v.id;})
		each_street.values.forEach(function(each_point){
			each_point.x = scalerConfig.lng_scale(each_point.lon)
			each_point.y = scalerConfig.lat_scale(each_point.lat)
			device_latlng.set(each_point.id, [each_point.x,each_point.y])
			data_coords.push({
				'device_id': each_point.id,
				'x': scalerConfig.lng_scale(each_point.lon),
				'y': scalerConfig.lat_scale(each_point.lat),
				'name': street_name,
				// 'device_values': samples_mapped.get(each_point.id)
			})
		})
		device_per_street_map.set(street_name,dev_ids)
	})

  initializeScene(nested_data);
	// Animate the scene
	animateScene();
}


loadData();



function initializeScene(data){

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
	camera = new THREE.PerspectiveCamera( frameConfig.fov, frameConfig.aspect, frameConfig.near, frameConfig.far );
	// camera = new THREE.CubeCamera( frameConfig.near, frameConfig.far, 128 );
// camera = new THREE.PerspectiveCamera((frameConfig.width / - 2) - 1 , (frameConfig.width / 2) + 1, frameConfig.height / 3, frameConfig.height / - 3, 1, 1000 )

  controls = new THREE.OrbitControls(camera);
  controls.enableZoom = true;
	controls.addEventListener( 'change', renderScene );
	window.addEventListener( 'resize', onWindowResize, false );
	var boxGeometry = new THREE.BoxGeometry(frameConfig.width, frameConfig.height, 0.01);
	var mapTexture = new THREE.ImageUtils.loadTexture('ph8.png');
	var boxMaterial = new THREE.MeshBasicMaterial({
		map: mapTexture,
		side:THREE.DoubleSide

	});

	boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.position.set(frameConfig.width/2,frameConfig.height/2,0.0);
	scene.add(boxMesh);


	group = new THREE.Group();
  // surfaveGroup = new THREE.Group()
  lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });
  street_lines_group = new THREE.Group();
	street_lines_group_voice = new THREE.Group();
	street_lines_group_base = new THREE.Group();


	street_lines_object_group = new THREE.Group();
	street_lines_object_group_voice = new THREE.Group();
	street_lines_object_group_base = new THREE.Group();


	axis_lines_group = new THREE.Group();


  street_surf_group = new THREE.Group();
	street_surf_group2 = new THREE.Group();
	street_surf_group3 = new THREE.Group();

// creating the line from iteration through the data


	data.forEach(function(coord){
    var lineGroup = new THREE.Group();
		var lineGroupVoice = new THREE.Group();
		var lineGroupBase = new THREE.Group();

		var objectGroup = new THREE.Group();
		var objectGroupVoice = new THREE.Group();
		var objectGroupBase = new THREE.Group();

		var axisStreetGroups = new THREE.Group();
		var surfStreetGroups = new THREE.Group();
		var surfStreetGroups2 = new THREE.Group();
		var surfStreetGroups3 = new THREE.Group();


		var lineStreetGroupsHigh = new THREE.Group();
		var lineStreetGroupsVoice = new THREE.Group();
		var lineStreetGroupsBase = new THREE.Group();

    var curveGeometry = new THREE.Geometry();


		var sorted_streets = coord.values.sort(function(a,b){
			return d3.descending(a.instreet_rank, b.instreet_rank);
		})

		var svector_array = [];
		var svector_array_Voice = [];
		var svector_array_Base = [];

		var axis_svector_array = [];
		var surf_svector_array = [];

		// svector_array.push(_this_point_buffer)
		for (iii = 0; iii < sorted_streets.length; iii++){


			var lineColorGroup = new THREE.Group();
			var lineColorGroupVoice = new THREE.Group();
			var lineColorGroupBase = new THREE.Group();

			var objectColorGroup = new THREE.Group();
			var objectColorGroupVoice = new THREE.Group();
			var objectColorGroupBase = new THREE.Group();

			var axisColorGroup = new THREE.Group();
			var surfColorGroup = new THREE.Group();
			var surfColorGroup2 = new THREE.Group();
			var surfColorGroup3 = new THREE.Group();

			var lineGeometry = new THREE.Geometry();
			var lineGeometryVoice = new THREE.Geometry();
			var lineGeometryBase = new THREE.Geometry();


			var axisGeometry = new THREE.Geometry();

			var _this_point_axis_base = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,-1);
			var _this_point_axis_head = _this_point_axis_base.clone();
			// axis_svector_array.push
			axisGeometry.vertices.push(_this_point_axis_base,_this_point_axis_head)

			// if


			var axisMaterial = new THREE.LineBasicMaterial({
				color: "#fffff", // scalerConfig.Components_scale_Frequency.get("High"),// colorScale(current_component),
				linewidth:4,
			});



			var axis_line = new THREE.Line(axisGeometry, lineMaterial)
			// axisStreetGroups.add(axis_line)

			var _this_point = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);
			var _this_point_voice = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);
			var _this_point_base = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);

			var _this_point_buffer = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);
			var _this_point_buffer_voice = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);
			var _this_point_buffer_base = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);

			if (iii == 0){
				var _this_point_buffer_surf = new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y,-1);
				var _this_point_surf = new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y,0);
				surf_svector_array.push(_this_point_buffer_surf,_this_point_surf);


				var _this_point_buffer = new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y,-1);
				var _this_point_buffer_voice = new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y,-1);
				var _this_point_buffer_base = new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y,-1);
				svector_array.push(_this_point_buffer)
				svector_array_Voice.push(_this_point_buffer_voice)
				svector_array_Base.push(_this_point_buffer_base)
			} else if (iii == sorted_streets.length-1) {
				var _last_point_buffer = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,-1);
				var _last_point_buffer_voice = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,-1);
				var _last_point_buffer_base = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,-1);
				svector_array.push(_last_point_buffer)
				svector_array_Voice.push(_last_point_buffer_voice)
				svector_array_Base.push(_last_point_buffer_base)
				var _last_point_buffer_surf = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);
				surf_svector_array.push(_last_point_buffer_surf)
				for (var j=sorted_streets.length-1; j > 0;j--){
					var _add_point_buffer_surf = new THREE.Vector3(sorted_streets[j].x,sorted_streets[j].y,-1);
					surf_svector_array.push(_add_point_buffer_surf)
				}
			} else {
				_this_point_surf = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);
				surf_svector_array.push(_this_point)
			}

			svector_array.push(_this_point)
			svector_array_Voice.push(_this_point_voice)
			svector_array_Base.push(_this_point_base)

			// axis_svector_array.push(_this_point_axis_base)
			// axis_svector_array.push(_this_point_axis_head)



			var spline = new THREE.SplineCurve3(svector_array)
			var splinePoints = spline.getPoints(sorted_streets.length+1);
			var splineVoice = new THREE.SplineCurve3(svector_array_Voice)
			var splinePointsVoice = splineVoice.getPoints(sorted_streets.length+1);
			var splineBase = new THREE.SplineCurve3(svector_array_Base)
			var splinePointsBase = splineBase.getPoints(sorted_streets.length+1);


			//
			//
			// for(var in=0; in < sorted_streets.length; in++){
			//
			//
			//
			// }



			for(var i = 0; i < splinePoints.length; i++){
			    lineGeometry.vertices.push(splinePoints[i]);
			}

			for (vi = 0; vi < splinePoints.length-2; vi++){
				lineGeometry.faces.push( new THREE.Face3( 0, vi+1, vi+2) );
			}


			for(var i = 0; i < splinePointsVoice.length; i++){
					lineGeometryVoice.vertices.push(splinePointsVoice[i]);
			}

			for (vi = 0; vi < splinePoints.length-2; vi++){
				lineGeometryVoice.faces.push( new THREE.Face3( 0, vi+1, vi+2) );
			}



			for(var i = 0; i < splinePointsVoice.length; i++){
					lineGeometryBase.vertices.push(splinePointsBase[i]);
			}

			for (vi = 0; vi < splinePoints.length-2; vi++){
				lineGeometryBase.faces.push( new THREE.Face3( 0, vi+1, vi+2) );
			}


// for (iii = 0; iii < sorted_streets.length-1; iii++){
			var current_component = ui_current_state.get("component");
			var colorScale = scalerConfig.color_scale_map.get(current_component);
				var lineMaterial = new THREE.LineBasicMaterial({
		      color: "#bd0026", // scalerConfig.Components_scale_Frequency.get("High"),// colorScale(current_component),
		      linewidth:1,
		    });

				var objectMaterial = new THREE.MeshBasicMaterial({
           vertexColors:THREE.VertexColors,
           side:THREE.DoubleSide,
					 shading: THREE.SmoothShading,
					combine: THREE.NoBlending,
					//  vertexColors: THREE.FaceColors,
					 color: "#bd0026",
					 transparent: true,
					 opacity: 0.5,
					 linewidth:8,
					 depthWrite: true, depthTest: false
					//  alphaTest: 0.5
				});

				var objectMaterial2 = new THREE.MeshBasicMaterial({
           vertexColors:THREE.VertexColors,
           side:THREE.DoubleSide,
					 shading: THREE.SmoothShading,
					 combine: THREE.NoBlending,
					//  vertexColors: THREE.FaceColors,
					 color: "#ffffb2",
					 transparent: true,
					 linewidth:5,
					 opacity: 0.5,
					 depthWrite: true, depthTest: false
					//  alphaTest: 0.5
				});

				var objectMaterial3 = new THREE.MeshBasicMaterial({
           vertexColors:THREE.VertexColors,
           side:THREE.DoubleSide,
					 shading: THREE.SmoothShading,
					combine: THREE.NoBlending,
					//  vertexColors: THREE.FaceColors,
					 color: "#fd8d3c",
					 transparent: true,
					 linewidth:5,
					 opacity: 0.5,
					 depthWrite: true, depthTest: false
					//  alphaTest: 0.5
				});






				axis_line.name = sorted_streets[iii].id;



				axisStreetGroups.add(axis_line)



				// axis_lines_group.add(axisStreetGroups)





				axisColorGroup.name = sorted_streets[iii].street



				// console.log(object)
				// scene.add(object)

		}
		var surfGeometry = new THREE.Geometry();
		var splineSurf = new THREE.SplineCurve3(surf_svector_array);
		var splinePointsSurf = splineSurf.getPoints(2*sorted_streets.length-1);


		for(var i = 0; i < splinePointsSurf.length; i++){
				surfGeometry.vertices.push(splinePointsSurf[i]);
		}


		for (var inn=0; inn < sorted_streets.length; inn++){

			if (inn==0){
				surfGeometry.faces.push( new THREE.Face3( inn, inn+1, 2*sorted_streets.length-1));

			} else if (inn==sorted_streets.length-1){
				surfGeometry.faces.push( new THREE.Face3( inn, inn+1, inn+2));
			} else {
				surfGeometry.faces.push( new THREE.Face3( inn, inn+1, 2*sorted_streets.length-inn));
				surfGeometry.faces.push( new THREE.Face3( inn+1, 2*sorted_streets.length-inn-1, 2*sorted_streets.length-inn));

				// surfGeometry.faces.push( new THREE.Face3( inn, inn+2, (2*sorted_streets.length-1)-(inn+1)));
			}

		}

		var surfGeometry2 = surfGeometry.clone()
		var surfGeometry3 = surfGeometry.clone()

		var surfObject = new THREE.Mesh( surfGeometry, objectMaterial );
		var surfObject2 = new THREE.Mesh( surfGeometry2, objectMaterial2 );
		var surfObject3 = new THREE.Mesh( surfGeometry3, objectMaterial3 );

		surfObject.num_of_street_devices = sorted_streets.length;
		var userData={}
		for (dev_ind=0;dev_ind <sorted_streets.length;dev_ind++){
			userData[dev_ind] = sorted_streets[dev_ind].id
		}
		// for(var iiii=0; iiii < sorted_streets.length; iiii++){
		//
		// 	surfGeometry.name = sorted_streets[iiii].street;
		// }
		// console.log(sorted_streets[0].street)
		surfObject.name = sorted_streets[0].street;
		surfObject.userData = userData;



		axisColorGroup.add(axisStreetGroups)



		// axisGroups.add(axisStreetGroupsGroup);


		axis_lines_group.add(axisColorGroup)


		street_surf_group.add(surfObject)
		street_surf_group2.add(surfObject2)
		street_surf_group3.add(surfObject3)


  })


  camera.position.set(frameConfig.camera_x, frameConfig.camera_y, frameConfig.camera_z);
  camera.lookAt(new THREE.Vector3(0*5.5*frameConfig.width/10, frameConfig.height/2, 0));
  camera.rotation.y = frameConfig.camera_rotate_y
	camera.rotation.z = frameConfig.camera_rotate_z
	// camera.rotation.x = frameConfig.camera_rotate_x
  scene.add(camera);

  // scene.add(street_lines_group);
	// scene.add(street_lines_group_voice);
	// scene.add(street_lines_group_base);
	// scene.add(street_lines_object_group_voice);
	// scene.add(street_lines_object_group_base);
	// scene.add(street_lines_object_group);

	scene.add(street_surf_group);

	scene.add(street_surf_group3);
	// scene.add(axis_lines_group);
scene.add(street_surf_group2);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  renderScene();

}



function animateScene(){

// console.log(axis_lines_group)
// console.log(lkjnsdlk)


	if (requestStream.frame_counter > frameConfig.numPoints-1){
			requestStream.frame_counter = 1;
			var t = requestStream.frame_counter;
	} else {
		var t = requestStream.frame_counter;
	}

	// console.log("t",t,street_lines_group)
  if (ui_current_state.get("data_needs_to_filter") > 0){
    data  = filterData()
  } else {
  }

console.log(street_surf_group)
// console.log(kjwekj)
	for (var sn = 0; sn < street_surf_group.children.length; sn++){
		for (var vert = 0; vert < street_surf_group.children[sn].geometry.vertices.length; vert++){



			count = t;
			var vir_v = vert - count - 1;

			if (vir_v < 0){
				var bufferIndex = vir_v + frameConfig.numPoints;
			}
			else if (vir_v < street_surf_group.children[sn].num_of_street_devices - 1){
				var bufferIndex = vir_v;
			}	else {
				var bufferIndex = vir_v;
			}

										var colorLeqdba = new THREE.Color(
											"#42f453"
									  );

										var colorLmaxdba = new THREE.Color(
											"#4280f4"
									  );

										var colorLmindba = new THREE.Color(
											"#f4424e"
									  );




			if (vert == 0){

				// var va = datamap.get(datamap.keys()[bufferIndex]);
				// ui_current_state.set("data_map_buffr_ind", [datamap.keys()[bufferIndex]]);



				// console.log(lsdj)

				var deviceid = street_surf_group.children[sn].userData[vert]

				datamap = samples_mapped.get(deviceid)

				var va = datamap.get(datamap.keys()[bufferIndex]);
				ui_current_state.set("data_map_buffr_ind", [datamap.keys()[bufferIndex]]);
				updateDynamicText()

				var Leqdba = va.get("Leqdba")
				var Lmaxdba = va.get("Lmaxdba")
				var Lmindba = va.get("Lmindba")
				axis_lines_group.children[sn].children[vert].children[0].geometry.vertices[1].z = scalerConfig.Lmaxdba_scale(Lmaxdba)
				street_surf_group.children[sn].geometry.vertices[1].z = scalerConfig.Leqdba_scale(Leqdba)
				street_surf_group2.children[sn].geometry.vertices[1].z = scalerConfig.Lmaxdba_scale(Lmaxdba)
				street_surf_group3.children[sn].geometry.vertices[1].z = scalerConfig.Lmindba_scale(Lmindba)
				street_surf_group.children[sn].geometry.vertices[0].z = 1;
				street_surf_group2.children[sn].geometry.vertices[0].z = 2;
				street_surf_group3.children[sn].geometry.vertices[0].z = 0;

			} else if (vert == street_surf_group.children[sn].geometry.vertices.length / 2){
				var deviceid = street_surf_group.children[sn].userData[street_surf_group.children[sn].num_of_street_devices-1]

				datamap = samples_mapped.get(deviceid)

				var va = datamap.get(datamap.keys()[bufferIndex]);
				ui_current_state.set("data_map_buffr_ind", [datamap.keys()[bufferIndex]]);
				updateDynamicText()

				var Leqdba = va.get("Leqdba")
											var Lmaxdba = va.get("Lmaxdba")
											var Lmindba = va.get("Lmindba")


					street_surf_group.children[sn].geometry.vertices[vert].z = scalerConfig.Leqdba_scale(Leqdba);
					street_surf_group2.children[sn].geometry.vertices[vert].z = scalerConfig.Lmaxdba_scale(Lmaxdba)
					street_surf_group3.children[sn].geometry.vertices[vert].z = scalerConfig.Lmindba_scale(Lmindba)


			} else if (vert > (street_surf_group.children[sn].geometry.vertices.length / 2)-1){
				street_surf_group.children[sn].geometry.vertices[vert].z = 1;
				street_surf_group2.children[sn].geometry.vertices[vert].z = 2;
				street_surf_group3.children[sn].geometry.vertices[vert].z = 0;

					// street_surf_group.children[sn].geometry.vertices[vert].z = 0;

			} else {
				var deviceid = street_surf_group.children[sn].userData[vert]
				datamap = samples_mapped.get(deviceid)

				var va = datamap.get(datamap.keys()[bufferIndex]);
				ui_current_state.set("data_map_buffr_ind", [datamap.keys()[bufferIndex]]);

				var Leqdba = va.get("Leqdba")
											var Lmaxdba = va.get("Lmaxdba")
											var Lmindba = va.get("Lmindba")
				updateDynamicText()

				street_surf_group.children[sn].geometry.vertices[vert].z = scalerConfig.Leqdba_scale(Leqdba)
				street_surf_group2.children[sn].geometry.vertices[vert].z = scalerConfig.Lmaxdba_scale(Lmaxdba)
				street_surf_group3.children[sn].geometry.vertices[vert].z = scalerConfig.Lmindba_scale(Lmindba)


				axis_lines_group.children[sn].children[0].children[vert].geometry.vertices[1].z = scalerConfig.Lmaxdba_scale(Lmaxdba)
				console.log(axis_lines_group)
				// console.log(dndn)


axis_lines_group.children[sn].children[0].children[vert].geometry.verticesNeedUpdate = true;

			}
street_surf_group.children[sn].geometry.verticesNeedUpdate = true;
street_surf_group2.children[sn].geometry.verticesNeedUpdate = true;
street_surf_group3.children[sn].geometry.verticesNeedUpdate = true;

		}

	}
	// console.log(kjwekj)






	update();  //stuff above


 	renderScene();

 mTime += mTimeStep;
 mTime %= mDuration;
 // console.log(mTime)
requestStream.frame_counter += 1;

	// if

	setTimeout(function(){

			requestAnimationFrame(animateScene);

	}, 100);


 // requestAnimationFrame(tick);



}

function update(){
	// controls.update();
	// console.log(mTime);
}

function renderScene(){

	renderer.render(scene, camera);
}


function makeColorToUpdate(){
  var color = new THREE.Color(
		// c
    scalerConfig.Components_scale_Loudness(
      ui_current_state.get("component")
    )
  );
  return color
}

var day = d3.utcDay(new Date);


function updateDataForViz(data){
}
function updateViz(){
  // console.log("ipdate")
  // console.log(makeColorToUpdate())
}


function updateDynamicText(){
	console.log("in update dynamic text",ui_current_state.get("data_map_buffr_ind"))
	var dtext=$("#dynemictext").html("")
	var dtext=$("#dynemictext").html(ui_current_state.get("data_map_buffr_ind"))
	// .selectAll(".textClass")
	// var dtextEnter = dtext.data(ui_current_state.get("data_map_buffr_ind")).enter().append("g").attr("class","textClass").attr('transform', 'translate(' + 30 + ',' + 49 + ')')
	// // dtextExit = dtext.exit().remove()
	// dtext.append("text").text(function(d){return d;})
}

function onDocumentMouseMove( event ) {
				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;
			}
			function onDocumentTouchStart( event ) {
				if ( event.touches.length > 1 ) {
					event.preventDefault();
					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;
				}
			}
			function onDocumentTouchMove( event ) {
				if ( event.touches.length == 1 ) {
					event.preventDefault();
					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;
				}
			}
