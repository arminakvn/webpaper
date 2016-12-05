var scene;
var camera;

var mTime = 0.0;
var mTimeStep = (1/60);
var mDuration = 20;
// Global mesh object of the cube
var cubeMesh;
var data_coords = [];
var data_map = d3.map();



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
    this.High_scale = d3.scaleLinear().range([0, 4]).domain([min_High, max_High]);
		this.Base_scale = d3.scaleLinear().range([0, 4]).domain([min_Base, max_Base]);
		this.Voice_scale = d3.scaleLinear().range([0, 4]).domain([min_Voice, max_Voice]);
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
// camera = new THREE.PerspectiveCamera((frameConfig.width / - 2) - 1 , (frameConfig.width / 2) + 1, frameConfig.height / 3, frameConfig.height / - 3, 1, 1000 )

  controls = new THREE.OrbitControls(camera);
  controls.enableZoom = true;
controls.addEventListener( 'change', renderScene );
window.addEventListener( 'resize', onWindowResize, false );
	// setting the box geometry for the background / under;ying image


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


  street_curves_group = new THREE.Group();









// creating the line from iteration through the data


	data.forEach(function(coord){
    var lineGroup = new THREE.Group();
		var lineGroupVoice = new THREE.Group();
		var lineGroupBase = new THREE.Group();


    var curveGeometry = new THREE.Geometry();


		var sorted_streets = coord.values.sort(function(a,b){
			return d3.descending(a.instreet_rank, b.instreet_rank);
		})







		// var dstnce = (new THREE.Vector3(sorted_streets[0].x,sorted_streets[0].y,2)).distanceTo(new THREE.Vector3(sorted_streets[sorted_streets.length-1].x,sorted_streets[sorted_streets.length-1].y,2));
		// var _before = getPointInBetweenByLen
		var lineColorGroup = new THREE.Group();
		var lineColorGroupVoice = new THREE.Group();
		var lineColorGroupBase = new THREE.Group();
		for (iii = 0; iii < sorted_streets.length-1; iii++){

			var lineGeometry = new THREE.Geometry();
			var lineGeometryVoice = new THREE.Geometry();
			var lineGeometryBase = new THREE.Geometry();
			var svector_array = [];
			var svector_array_Voice = [];
			var svector_array_Base = [];
			var dstnce = (new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0)).distanceTo(new THREE.Vector3(sorted_streets[iii +1].x,sorted_streets[iii +1].y,0));
			var _before = getPointInBetweenByLen(new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0),new THREE.Vector3(sorted_streets[iii +1].x,sorted_streets[iii +1].y,0),-1 * dstnce / 2)
			var _after = getPointInBetweenByLen(new THREE.Vector3(sorted_streets[iii].x,sorted_streets[iii].y,0),new THREE.Vector3(sorted_streets[iii +1].x,sorted_streets[iii +1].y,0),1 * dstnce / 2)
			// console.log(sorted_streets[iii],sorted_streets[iii+1],dstnce, _before, _after)
			// add the two to array and make the spline points and addthat to lineGeometry and make the line
			svector_array.push(_before)
			svector_array.push(_after)
			// svector_array_Voice.push(_before)
			// svector_array_Voice.push(_after)
			var spline = new THREE.SplineCurve3(svector_array)
			var splinePoints = spline.getPoints(frameConfig.numPoints);
			var splineVoice = new THREE.SplineCurve3(svector_array)
			var splinePointsVoice = spline.getPoints(frameConfig.numPoints);
			var splineBase = new THREE.SplineCurve3(svector_array)
			var splinePointsBase = spline.getPoints(frameConfig.numPoints);

			for(var i = 0; i < splinePoints.length; i++){
			    lineGeometry.vertices.push(splinePoints[i]);
			}
			for(var i = 0; i < splinePointsVoice.length; i++){
					lineGeometryVoice.vertices.push(splinePointsVoice[i]);
			}

			for(var i = 0; i < splinePointsVoice.length; i++){
					lineGeometryBase.vertices.push(splinePointsBase[i]);
			}


			var current_component = ui_current_state.get("component");
			var colorScale = scalerConfig.color_scale_map.get(current_component);
				var lineMaterial = new THREE.LineBasicMaterial({
		      color: "#bd0026", // scalerConfig.Components_scale_Frequency.get("High"),// colorScale(current_component),
		      linewidth:2,
		    });

				var lineMaterialVoice = new THREE.LineBasicMaterial({
		      color:"#ffffb2",// scalerConfig.Components_scale_Frequency.get("Voice"),//"#fd8d3c",
		      linewidth:2,
		    });

				var lineMaterialBase = new THREE.LineBasicMaterial({
		      color:"#fd8d3c",// scalerConfig.Components_scale_Frequency.get("Voice"),//"#fd8d3c",
		      linewidth:2,
		    });
	      var line = new THREE.Line(lineGeometry, lineMaterial);
				var lineVoice = new THREE.Line(lineGeometryVoice, lineMaterialVoice);
				var lineBase = new THREE.Line(lineGeometryBase, lineMaterialBase);
				line.name = sorted_streets[iii].id;
				lineVoice.name = sorted_streets[iii].id;
				lineBase.name = sorted_streets[iii].id;
	      lineColorGroup.add(line);
				lineColorGroupVoice.add(lineVoice)
				lineColorGroupBase.add(lineBase)

				lineColorGroup.name = sorted_streets[iii].street;
				lineColorGroupVoice.name = sorted_streets[iii].street;
				lineColorGroupBase.name = sorted_streets[iii].street;

				lineColorGroup.numberOfNodesInStreet = sorted_streets.length;
				lineColorGroupVoice.numberOfNodesInStreet = sorted_streets.length;
				lineColorGroupBase.numberOfNodesInStreet = sorted_streets.length;

		}
		lineGroup.add(lineColorGroup);
		lineGroupVoice.add(lineColorGroupVoice)
		lineGroupBase.add(lineColorGroupBase)

		//
		// sorted_streets.forEach(function(e){
		//
		//
		//
		//
		// 	var pointMeasuredVect = new THREE.Vector3(e.x, e.y, 2)
		// 	svector_array.push(pointMeasuredVect)
		//
		//
		// })
		// var spline = new THREE.SplineCurve3(svector_array)
		// var splinePoints = spline.getPoints(frameConfig.numPoints);
		// for(var i = 0; i < splinePoints.length; i++){
		//     lineGeometry.vertices.push(splinePoints[i]);
		// }
		//
		//
		//
    // sorted_streets.forEach(function(e){
		// 	var current_component = ui_current_state.get("component");
		// 	var colorScale = scalerConfig.color_scale_map.get(current_component);
		// 		var lineMaterial = new THREE.LineBasicMaterial({
		//       color: colorScale(current_component),
		//       linewidth:2,
		//     });
	  //     var line = new THREE.Line(lineGeometry, lineMaterial);
		// 		line.name = e.id;
	  //     lineColorGroup.add(line)
		// 		lineColorGroup.name = e.street;
		// 		lineGroup.add(lineColorGroup);
		//
		//
    // })
    street_lines_group.add(lineGroup)
		street_lines_group_voice.add(lineGroupVoice)
		street_lines_group_base.add(lineGroupBase)
  })

	// var streets_device_line_segs = d3.map()
	// var lineGroup_2 = new THREE.Group();
  // device_per_street_map.keys().forEach(function(each_street_key){
	//
	//
  //   var lineGeometry2 = new THREE.Geometry();
  //   var curveGeometry2 = new THREE.Geometry();
	// 	var device_line_segs = d3.map();
  //   var devices = device_per_street_map.get(each_street_key);
	// 	// console.log("devices",devices)
	//
	// 	var spline = new THREE.SplineCurve3()
	//
	// 	for (dvi=0; dvi < devices.length-1; dvi++) {
	// 		// var devices_data_array = samples_mapped.get(first_device);
	// 		var first_device = devices[dvi];
	// 		var second_device = devices[dvi + 1];
	// 		// console.log("first_device", first_device)
	// 		var dev1_latlong = device_latlng.get(first_device);
	// 		var dev2_latlong = device_latlng.get(second_device);
	// 		var vec1 = new THREE.Vector3(dev1_latlong[0], dev1_latlong[1], 2)
	// 		var vec2 = new THREE.Vector3(dev2_latlong[0], dev2_latlong[1], 2)
	// 		var between_point = getPointInBetweenByPerc(vec1, vec2, 0.5)
	// 		var before_point = getPointInBetweenByPerc(vec1, vec2, -0.5)
	//
	// 		// make two scalers based on these two:
	// 		// get the range in range with making a line and getting the bbox for it to be used for scale
	//
	//
	// 		var lineSeg = new THREE.Line3(before_point, between_point);
	// 		var dstnce = before_point.distanceTo(between_point)//lineSeg.distance()
	// 		device_line_segs.set(first_device, lineSeg)
	//
	//
	//
	// 		var dist_scale = d3.scaleLinear().range([0,dstnce]).domain([0, 164]);
	// 		var current_component = ui_current_state.get("component");
	// 		var lineColorGroup = new THREE.Group();
	// 		var phereGeometry = new THREE.SphereGeometry()
	// 		var vector_array = [];
	// 		lineGeometry2.vertices.push(before_point)
	// 		for (eps = 0; eps < 164; eps++){
	// 			var eps_point = getPointInBetweenByPerc(lineSeg.start, lineSeg.end, dist_scale(eps));
	// 			// console.log("eps_point", eps_point);
	// 			// var pointMeasuredVect = new THREE.Vector3(e.x, e.y, 2)
	// 			// vector_array.push(pointMeasuredVect)
	// 			lineGeometry2.vertices.push(eps_point);
	// 			var colorScale = scalerConfig.color_scale_map.get(current_component);
	//
	// 			var lineMaterial = new THREE.LineBasicMaterial({
	// 	      color: colorScale(current_component),
	// 	      linewidth:4,
	// 	    });
	// 			lineGeometry2.vertices.push(between_point)
	//
	//       var line = new THREE.Line(lineGeometry2, lineMaterial);
	//
	//
	//       lineGroup_2.add(line)
	// 		}
	// 	}
	//
	// 	streets_device_line_segs.set(each_street_key,device_line_segs);
	//
  // })

  // lineGeometry.vertices.push(new THREE.Vector3(coord.x, coord.y, 2));
  // var line = new THREE.Line(lineGeometry, lineMaterial);
  // lineGroup.add(line)
  camera.position.set(5.5*frameConfig.width/10, -frameConfig.height/3, frameConfig.camera_z);
  camera.lookAt(new THREE.Vector3(5.5*frameConfig.width/10, frameConfig.height/2, 0));
  camera.rotation.y = 15 * Math.PI / 180
  scene.add(camera);

  scene.add(street_lines_group);
	scene.add(street_lines_group_voice);
	scene.add(street_lines_group_base);
	// console.log("street_lines_group", street_lines_group)
  // scene.add(street_curves_group);
  // scene.add(lineGroup_2);
	// console.log("streets_device_line_segs",streets_device_line_segs)



}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  renderScene();

}



function animateScene(){
	// camera.lookAt(new THREE.Vector3(5.5*frameConfig.width/10, frameConfig.height/2, 0));


	if (requestStream.frame_counter > frameConfig.numPoints){
			requestStream.frame_counter = 1;
			var t = requestStream.frame_counter;
			// camera.position.x -= 0.01
			// camera.position.y -= 0.02
			// camera.position.z -= 0.01
			// camera.rotation.y -+ 1 * Math.PI / 180
	} else {
		var t = requestStream.frame_counter;
		// camera.position.x += 0.01
		// camera.position.y += 0.02
		// camera.position.z += 0.01
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

				var street_name =  street_lines_group.children[ji].children[j].numberOfNodesInStreet;

				// console.log(street_name)
				// console.log("bureakj",ddjk)
				for (v = 0; v < street_lines_group.children[ji].children[j].children[jiv].geometry.vertices.length; v++) {
						var datamap = samples_mapped.get(street_lines_group.children[ji].children[j].children[jiv].name)
						// console.log(samples_mapped,datamap,street_lines_group.children[ji].children[j].children[jiv].name)
						count = t-1;
						var vir_v = v - count - 1;

						if (vir_v < 0){
							var bufferIndex = vir_v + street_lines_group.children[ji].children[j].children[jiv].geometry.vertices.length - 1;
						}
						else if (vir_v < street_lines_group.children[ji].children[j].children[jiv].geometry.vertices.length - 1){
							var bufferIndex = vir_v;
						}	else {
							var bufferIndex = vir_v;
						}
						// console.log(requestStream.frame_counter,v,count, t, vir_v, bufferIndex)
						var va = datamap.get(datamap.keys()[bufferIndex])
						var High = va.get("High")
						var Voice = va.get("Voice")
						var Base = va.get("Base")
						// if (High > 0) {}

						// street_lines_group.children[ji].children[j].children[jiv].material._needsUpdate = true;
						street_lines_group.children[ji].children[j].children[jiv].material.color = makeColorToUpdate()

					street_lines_group.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.High_scale(High) ;
					street_lines_group.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;

					street_lines_group_voice.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.Voice_scale(Voice) ;
					street_lines_group_voice.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;

					street_lines_group_base.children[ji].children[j].children[jiv].geometry.vertices[v].z = scalerConfig.Base_scale(Base) ;
					street_lines_group_base.children[ji].children[j].children[jiv].geometry.verticesNeedUpdate = true;


				}



			}



    }
  }
  for (j = 0; j < group.children.length; j++) {
    group.children[j].position.z += d3.randomUniform(-0.1, 0.1)();

  }





	update();  //stuff above


 	renderScene();

 mTime += mTimeStep;
 mTime %= mDuration;
requestStream.frame_counter += 1;
 requestAnimationFrame(animateScene);
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
