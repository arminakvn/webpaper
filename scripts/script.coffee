# window.onload = ->
#   # Get a reference to the canvas object
#   canvas = document.getElementById('myCanvas')
#   # Create an empty project and a view for the canvas:
#   paper.setup canvas
#   # Create a Paper.js Path to draw a line into it:
#   path = new (paper.Path)
#   # Give the stroke a color
#   path.strokeColor = 'black'
#   start = new (paper.Point)(100, 100)
#   # Move to start and draw a line from there
#   path.moveTo start
#   # Note that the plus operator on Point objects does not work
#   # in JavaScript. Instead, we need to call the add() function:
#   path.lineTo start.add([
#     200
#     -50
#   ])
#   # Draw the view now:
#   paper.view.draw()
#   return

createViz = (opts, verts) ->
  config = opts or
    height: 500
    width: 500
    linesHeight: 10
    linesWidth: 10
    color: 0xDD006C
  material = new (THREE.LineBasicMaterial)(
    color: config.color
    opacity: 0.2)
  VizObject = new (THREE.Object3D)
  VizGeo = new (THREE.Geometry)
  #width
  for vert in verts
    VizGeo.vertices.push new (THREE.Vector3)(vert[0], verts[1], verts[2])
  line = new (THREE.Line)(VizGeo, material, THREE.LinePieces)
  VizObject.add line
  VizObject








paper.install window

window.onload = ->
  scene = new (THREE.Scene)
  camera = new (THREE.PerspectiveCamera)(45, window.innerWidth / window.innerHeight, .1, 1000)
  renderer = new (THREE.WebGLRenderer)
  camera.lookAt new (THREE.Vector3)(0, 0, 0)  
  material = new (THREE.LineBasicMaterial)(color: 0xffffff)

  geometry = new (THREE.Geometry)
  geometry.vertices.push new (THREE.Vector3)(-10, 0, 0)
  geometry.vertices.push new (THREE.Vector3)(20, 10, 0)
  geometry.vertices.push new (THREE.Vector3)(10, 0, 0)
  geometry.vertices.push new (THREE.Vector3)(10, 10, 10)
  geometry.vertices.push new (THREE.Vector3)(10, 20, 20)
  geometry.vertices.push new (THREE.Vector3)(10, 30, 40)
  line = new (THREE.Line)(geometry, material)
  scene.add(line)




  # image loader
  loader = new (THREE.ImageLoader)
  loader.load 'ph1.png', ((image) ->
    # do something with it
    # like drawing a part of it on a canvas
    canvas = document.createElement('canvas')
    context = canvas.getContext('2d')
    context.drawImage image, 100, 100
    return
  ), ((xhr) ->
    console.log xhr.loaded / xhr.total * 100 + '% loaded'
    return
  ), (xhr) ->
    console.log 'An error happened'
    return





  animate = (r) ->
    # cube2.rotation.x += Math.PI * r / 60
    # stats.update()
    renderer.render scene, camera
    requestAnimationFrame animate
    return

  animateX = (x) ->
    camera.position.x = x
    renderer.render scene, camera
    requestAnimationFrame animate
    return
  animateY= (y) ->
    camera.position.y = y
    renderer.render scene, camera
    requestAnimationFrame animate
    return


  animateCameraFov= (f) ->
    camera.setFocalLength f
    renderer.render scene, camera
    requestAnimationFrame animate
    return
  # renderer.setClearColorHex 0xefefef
  renderer.setSize window.innerWidth, window.innerHeight
  renderer.shadowMapEnabled = true
  controls = new (THREE.OrbitControls)(camera)
  #Axis helper
  axes = new (THREE.AxisHelper)(100)
  scene.add axes
  #Mesh = geometry + material
  planeGeometry = new (THREE.PlaneGeometry)(60, 20)
  planeMaterial = new (THREE.MeshLambertMaterial)(0xffffff)
  plane = new (THREE.Mesh)(planeGeometry, planeMaterial)
  plane.rotation.x = -.5 * Math.PI
  plane.position.x = 15
  plane.receiveShadow = true
  scene.add plane
  cubeGeometry = new (THREE.CubeGeometry)(4, 4, 4)
  cubeMaterial = new (THREE.MeshBasicMaterial)(
    color: 0xaaaaaa
    wireframe: true)
  cube = new (THREE.Mesh)(cubeGeometry, cubeMaterial)
  cube.position.x = 0
  cube.position.z = 0
  cube.position.y = 2
  cube.castShadow = true
  scene.add cube
  #Add more cubes, experiment with different material properties + lights
  material2 = new (THREE.MeshLambertMaterial)(color: 0xff0000)
  material3 = new (THREE.MeshPhongMaterial)(color: 0xffff00)
  cubeGeo2 = new (THREE.CubeGeometry)(4, 4, 4)
  cubeGeo3 = new (THREE.CubeGeometry)(4, 4, 4)
  cube2 = new (THREE.Mesh)(cubeGeo2, material2)
  cube3 = new (THREE.Mesh)(cubeGeo3, material3)
  cube2.position.x = 10
  cube2.position.z = 0
  cube2.position.y = 2
  cube2.castShadow = true
  scene.add cube2
  cube3.position.x = 20
  cube3.position.z = 0
  cube3.position.y = 2
  cube3.castShadow = true
  scene.add cube3
  #Spot light
  spotLight = new (THREE.SpotLight)(0xffffff)
  spotLight.position.set -20, 60, 0
  spotLight.castShadow = true
  scene.add spotLight
  opts =
    height: 500
    width: 500
    linesHeight: 10
    linesWidth: 10
    color: 0xDD006C

  data = [[0,1,1], [0,4,5], [5,4,4]]
  viz = createViz(opts,data)
  scene.add viz
  camera.lookAt viz
  
  # Position and aim camera
  camera.position.x = -30
  #red
  camera.position.y = 40
  #green
  camera.position.z = 30
  camera.lookAt scene.position
  # Append renderer DOM element
  #Render
  document.getElementById('gl').appendChild renderer.domElement
  # stats = initStats()
  

  # ---
  # generated by js2coffee 2.2.0
  # ---
  # generated by js2coffee 2.2.0

  gui = new (dat.GUI)
  params = new (->
    @speed = 1
    @camX = 19
    @camY = 21
    @camFov = -2.1
    return
  )
  gui.add(params, 'camX', -90,90).onChange (e) ->
    animateX(e)
    console.log e
  gui.add(params, 'camY', -90,90).onChange (e) ->
    console.log e
    animateY(e)
  gui.add(params, 'camFov', -20,79).onChange (e) ->
    console.log e
    animateCameraFov(e)
  gui.add(params, 'speed', -5, 5).onChange (e) ->
    console.log e
    animate(e)
    # e is the update value
    # view.onFrame = (event) ->
    #   # On each frame, rotate the path by 3 degrees:
    #   path.rotate e
    #   return

    return
    console.log e
    return


    
    

  # ---
  # generated by js2coffee 2.2.0