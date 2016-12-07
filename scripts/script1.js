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

// // loading the data / starting with loading the locations
function loadData(){
	d3.queue()
		.defer(d3.csv,"locationsinter.csv", parseLocations) //locations_nest
    .defer(d3.csv,"res2.csv", parseSamples)
    .await(callbackDataLoaded)
}







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
    this.High_scale = d3.scaleLog().range([0, 4]).domain([min_High, max_High]);
		this.Base_scale = d3.scaleLog().range([0, 4]).domain([min_Base, max_Base]);
		this.Voice_scale = d3.scaleLog().range([0, 4]).domain([min_Voice, max_Voice]);
		this.Leqdba_scale = d3.scaleLog().range([0, 4]).domain([min_Leqdba, max_Leqdba]);
		this.Lmaxdba_scale = d3.scaleLog().range([0, 4]).domain([min_Lmaxdba, max_Lmaxdba]);
		this.Lmindba_scale = d3.scaleLog().range([0, 4]).domain([min_Lmindba, max_Lmindba]);
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

  // controls = new THREE.OrbitControls(camera);
  // controls.enableZoom = true;
// controls.addEventListener( 'change', renderScene );
// window.addEventListener( 'resize', onWindowResize, false );
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




  street_curves_group = new THREE.Group();

// creating the line from iteration through the data


	data.forEach(function(coord){
    var lineGroup = new THREE.Group();
		var lineGroupVoice = new THREE.Group();
		var lineGroupBase = new THREE.Group();

		var objectGroup = new THREE.Group();
		var objectGroupVoice = new THREE.Group();
		var objectGroupBase = new THREE.Group();

		var axisStreetGroups = new THREE.Group();

    var curveGeometry = new THREE.Geometry();


		var sorted_streets = coord.values.sort(function(a,b){
			return d3.descending(a.instreet_rank, b.instreet_rank);
		})

		var svector_array = [];
		var svector_array_Voice = [];
		var svector_array_Base = [];

		var axis_svector_array = [];

		// svector_array.push(_this_point_buffer)
		for (iii = 0; iii < sorted_streets.length; iii++){


			var lineColorGroup = new THREE.Group();
			var lineColorGroupVoice = new THREE.Group();
			var lineColorGroupBase = new THREE.Group();

			var objectColorGroup = new THREE.Group();
			var objectColorGroupVoice = new THREE.Group();
			var objectColorGroupBase = new THREE.Group();

			var axisColorGroup = new THREE.Group();

			var lineGeometry = new THREE.Geometry();
			var lineGeometryVoice = new THREE.Geometry();
			var lineGeometryBase = new THREE.Geometry();


			var axisGeometry = new THREE.Geometry();
			var _this_point_axis_base = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0);
			var _this_point_axis_head = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,1);
			// axis_svector_array.push
			axisGeometry.vertices.push(_this_point_axis_base,_this_point_axis_head)

			var axisMaterial = new THREE.LineBasicMaterial({
				color: "#ffffe6", // scalerConfig.Components_scale_Frequency.get("High"),// colorScale(current_component),
				linewidth:2,
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
				var _this_point_buffer = new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y+2,-1);
				var _this_point_buffer_voice = new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y,-1);
				var _this_point_buffer_base = new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y,-1);
				svector_array.push(_this_point_buffer)
				svector_array_Voice.push(_this_point_buffer_voice)
				svector_array_Base.push(_this_point_buffer_base)
			}

			svector_array.push(_this_point)
			svector_array_Voice.push(_this_point_voice)
			svector_array_Base.push(_this_point_base)

			// axis_svector_array.push(_this_point_axis_base)
			// axis_svector_array.push(_this_point_axis_head)

			if (iii == sorted_streets.length-1) {
				var _last_point_buffer = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,-1);
				var _last_point_buffer_voice = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,-1);
				var _last_point_buffer_base = new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,-1);
				svector_array.push(_last_point_buffer)
				svector_array_Voice.push(_last_point_buffer_voice)
				svector_array_Base.push(_last_point_buffer_base)
			}

			var spline = new THREE.SplineCurve3(svector_array)
			var splinePoints = spline.getPoints(sorted_streets.length+1);
			var splineVoice = new THREE.SplineCurve3(svector_array_Voice)
			var splinePointsVoice = spline.getPoints(sorted_streets.length+1);
			var splineBase = new THREE.SplineCurve3(svector_array_Base)
			var splinePointsBase = spline.getPoints(sorted_streets.length+1);


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
          //  vertexColors:THREE.VertexColors,
           side:THREE.DoubleSide,
					 shading: THREE.SmoothShading,
					//  combine: THREE.AddOperation,
					 vertexColors: THREE.FaceColors,
					 color: "#bd0026",
					 transparent: true,
					 opacity: 0.5,
					 depthWrite: true, depthTest: false
					//  alphaTest: 0.5
				});




				var lineMaterialVoice = new THREE.LineBasicMaterial({
		      color:"#ffffb2",// scalerConfig.Components_scale_Frequency.get("Voice"),//"#fd8d3c",
		      linewidth:1,
		    });

				var objectMaterialVoice = new THREE.MeshBasicMaterial({
					//  vertexColors:THREE.VertexColors,
					 side:THREE.DoubleSide,
					 shading: THREE.SmoothShading,
					//  combine: THREE.AddOperation,
					 color: "#ffffb2",
					 transparent: true,
					 vertexColors: THREE.FaceColors,
					 opacity: 0.5,
					 depthWrite: true, depthTest: false
					//  alphaTest: 0.5
				});


				var lineMaterialBase = new THREE.LineBasicMaterial({
		      color:"#fd8d3c",// scalerConfig.Components_scale_Frequency.get("Voice"),//"#fd8d3c",
		      linewidth:1,
		    });


				var objectMaterialBase = new THREE.MeshBasicMaterial({
					//  vertexColors:THREE.VertexColors,
					 side:THREE.DoubleSide,
					 shading: THREE.SmoothShading,
					 vertexColors: THREE.FaceColors,
					 combine: THREE.MixOperation,
					 color: "#fd8d3c",
					 transparent: true,
					 opacity: 0.5,
					 depthWrite: true, depthTest: false
					//  alphaTest: 0.5
				});

	      var line = new THREE.Line(lineGeometry, lineMaterial);
				var lineVoice = new THREE.Line(lineGeometryVoice, lineMaterialVoice);
				var lineBase = new THREE.Line(lineGeometryBase, lineMaterialBase);

				var object = new THREE.Mesh( lineGeometry, objectMaterial );
				var objectVoice = new THREE.Mesh( lineGeometryVoice, objectMaterialVoice );
				var objectBase = new THREE.Mesh( lineGeometryBase, objectMaterialBase );




				line.name = sorted_streets[iii].id;
				lineVoice.name = sorted_streets[iii].id;
				lineBase.name = sorted_streets[iii].id;

				axis_line.name = sorted_streets[iii].id;

	      lineColorGroup.add(line);
				lineColorGroupVoice.add(lineVoice)
				lineColorGroupBase.add(lineBase)

				objectColorGroup.add(object)
				objectColorGroupVoice.add(objectVoice)
				objectColorGroupBase.add(objectBase)


				axisStreetGroups.add(axis_line)
				// axis_lines_group.add(axisStreetGroups)

				objectColorGroup.name = sorted_streets[iii].street
				objectColorGroupVoice.name = sorted_streets[iii].street
				objectColorGroupBase.name = sorted_streets[iii].street


				axisColorGroup.name = sorted_streets[iii].street


				lineColorGroup.name = sorted_streets[iii].street;
				lineColorGroupVoice.name = sorted_streets[iii].street;
				lineColorGroupBase.name = sorted_streets[iii].street;

				lineColorGroup.numberOfNodesInStreet = sorted_streets.length;
				lineColorGroupVoice.numberOfNodesInStreet = sorted_streets.length;
				lineColorGroupBase.numberOfNodesInStreet = sorted_streets.length;
				// console.log(object)
				// scene.add(object)

		}
		axisColorGroup.add(axisStreetGroups)
		lineGroup.add(lineColorGroup);
		lineGroupVoice.add(lineColorGroupVoice)
		lineGroupBase.add(lineColorGroupBase)

		objectGroup.add(objectColorGroup)
		objectGroupVoice.add(objectColorGroupVoice)
		objectGroupBase.add(objectColorGroupBase)


		// axisGroups.add(axisStreetGroupsGroup);

    street_lines_group.add(lineGroup)
		street_lines_group_voice.add(lineGroupVoice)
		street_lines_group_base.add(lineGroupBase)

		street_lines_object_group.add(objectGroup)
		street_lines_object_group_voice.add(objectGroupVoice)
		street_lines_object_group_base.add(objectGroupBase)
		axis_lines_group.add(axisColorGroup)


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
	scene.add(street_lines_object_group_voice);
	scene.add(street_lines_object_group_base);
	scene.add(street_lines_object_group);
	scene.add(axis_lines_group);


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


	if (requestStream.frame_counter > frameConfig.numPoints){
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
  for (ji = 0; ji < street_lines_group.children.length; ji++) {
		// street id
    // group.children[j].material.color.setHex(0x1A75FF);
    for (j = 0; j < street_lines_group.children[ji].children.length; j++) {
			// device_id
      // console.log(street_lines_group.children[ji].children[j])

			for (jiv = 0; jiv < street_lines_group.children[ji].children[j].children.length; jiv++) {

				var street_num_of_devices =  street_lines_group.children[ji].children[j].numberOfNodesInStreet;

//
				for (v = 0; v < street_lines_group.children[ji].children[j].children[jiv].geometry.vertices.length; v++) {
						var datamap = samples_mapped.get(street_lines_group.children[ji].children[j].children[jiv].name)

						count = t-1;
						var vir_v = v - count - 1;

						if (vir_v < 0){
							var bufferIndex = vir_v + frameConfig.numPoints;
						}
						else if (vir_v < street_lines_group.children[ji].children[j].children[jiv].geometry.vertices.length - 2){
							var bufferIndex = vir_v;
						}	else {
							var bufferIndex = vir_v;
						}
						// console.log(requestStream.frame_counter,v,count, t, vir_v, bufferIndex)
						var va = datamap.get(datamap.keys()[bufferIndex]);
						ui_current_state.set("data_map_buffr_ind", bufferIndex);
						// console.log("vaa", datamap.keys()[bufferIndex])

						if (ui_current_state.get("component") == "frequency") {
							var High = va.get("High")
							var Voice = va.get("Voice")
							var Base = va.get("Base")

							var colorHigh = new THREE.Color(
								"#bd0026"
						  );

							var colorVoice = new THREE.Color(
								"#ffffb2"
						  );

							var colorBase = new THREE.Color(
								"#fd8d3c"
						  );
							if (v == 0){
									street_lines_group.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;
									street_lines_group_voice.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;
									street_lines_group_base.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;

							} else if (v == street_lines_group.children[ji].children[j].children[jiv].geometry.vertices.length - 1) {
								street_lines_group.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;
								street_lines_group_voice.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;
								street_lines_group_base.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;
							} else {
								street_lines_group.children[ji].children[j].children[jiv].material.color = colorHigh;
								street_lines_group_voice.children[ji].children[j].children[jiv].material.color = colorVoice;
								street_lines_group_base.children[ji].children[j].children[jiv].material.color = colorBase;
								for (h = 0; h < street_lines_group.children[ji].children[j].children[jiv].geometry.faces.length; h++){
									street_lines_group.children[ji].children[j].children[jiv].geometry.faces[h].color = colorHigh
									street_lines_group_voice.children[ji].children[j].children[jiv].geometry.faces[h].color = colorVoice
									street_lines_group_voice.children[ji].children[j].children[jiv].geometry.faces[h].color = colorBase
								}
										street_lines_group.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.High_scale(High) ;
									street_lines_object_group.children[ji].children[j].children[jiv].geometry.vertices[1].z = scalerConfig.Leqdba_scale(Leqdba)
									street_lines_group_voice.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.Voice_scale(Voice) ;
									street_lines_group_base.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.Base_scale(Base) ;

							}




							street_lines_group.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;


							street_lines_group_voice.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;



							street_lines_group_base.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;

							street_lines_object_group.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;
							street_lines_object_group_voice.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;
							street_lines_object_group_base.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;


						} else {

							var Leqdba = va.get("Leqdba")
							var Lmaxdba = va.get("Lmaxdba")
							var Lmindba = va.get("Base")
							var colorLeqdba = new THREE.Color(
								"#42f453"
						  );

							var colorLmaxdba = new THREE.Color(
								"#4280f4"
						  );

							var colorLmindba = new THREE.Color(
								"#f4424e"
						  );
							if (v == 0){
									street_lines_group.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;
									street_lines_group_voice.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;
									street_lines_group_base.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;

							} else if (v == street_lines_group.children[ji].children[j].children[jiv].geometry.vertices.length - 1) {
								street_lines_group.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;
								street_lines_group_voice.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;
								street_lines_group_base.children[ji].children[j].children[jiv].geometry.vertices[v].z = 0;
							} else {
									street_lines_group.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.Leqdba_scale(Leqdba)
									// console.log(axis_lines_group.children[ji].children[j].children[jiv])
									axis_lines_group.children[ji].children[j].children[jiv].geometry.vertices[1].z = scalerConfig.Leqdba_scale(Leqdba)
									// console.log(axis_lines_group);
									// // console.log(kjsds)


									for (h = 0; h < street_lines_group.children[ji].children[j].children[jiv].geometry.faces.length; h++){
										street_lines_group.children[ji].children[j].children[jiv].geometry.faces[h].color = colorLeqdba
										street_lines_group_voice.children[ji].children[j].children[jiv].geometry.faces[h].color = colorLmaxdba
										street_lines_group_voice.children[ji].children[j].children[jiv].geometry.faces[h].color = colorLmindba
									}

									// street_lines_object_group.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.Leqdba_scale(Leqdba)
									street_lines_group_voice.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.Lmaxdba_scale(Lmaxdba) ;
									street_lines_group_base.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.Lmindba_scale(Lmindba) ;

							}

							street_lines_object_group.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;
							street_lines_object_group_voice.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;
							street_lines_object_group_base.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;
							axis_lines_group.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;

							// console.log(street_lines_object_group.children[ji].children[j].children[jiv], street_lines_group)
							// console.log(jsdn)
							street_lines_group_base.children[ji].children[j].children[jiv].material.color = colorLmindba;

							street_lines_group_base.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;
							// console.log(dlsj)
							street_lines_group.children[ji].children[j].children[jiv].material.color = colorLeqdba;
							// street_lines_group.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.Leqdba_scale(Leqdba) ;
							street_lines_group.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;
							street_lines_group_base.children[ji].children[j].children[jiv].material.color = colorLmindba;

							street_lines_group_base.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;
							street_lines_group_voice.children[ji].children[j].children[jiv].material.color = colorLmaxdba;

							street_lines_group_voice.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;




							// console.log(dds)
						}

						// if (High > 0) {}

						// street_lines_group.children[ji].children[j].children[jiv].material._needsUpdate = true;





				}



			}



    }
  }





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
