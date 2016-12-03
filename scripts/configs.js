frameConfig = new (function() {
  this.height = 50;
  this.width = 100;
  this.bbox_reference_topleft_y = 34.085700;
  this.bbox_reference_bottom_left_x = -119.291728;
  this.bbox_reference_bottom_left_y = 34.091616;
  this.bbox_reference_top_right_x = -117.284403;
  this.far = 150 // Camera frustum far plane
  this.fov = 37 // Camera frustum vertical field of view.
  this.near = 1 // Camera frustum near plane.
  this.aspect = this.width / this.height // Camera frustum aspect ratio
  this.camera_z = 10
  this.padding_right = 42
  this.padding_left = 41
  this.padding_top = 9
  this.padding_bottom = 5
});

componentsConfig = new (function(){
  this.components_map = d3.map()
})

componentsConfig.components_map.set("loudness", ["Lmaxdba","Leqdba","Lmindba"])
componentsConfig.components_map.set("frequency", ["Base","Voice","High"])
