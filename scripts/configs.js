frameConfig = new (function() {
  this.height = 50;
  this.width = 100;
  this.bbox_reference_topleft_y = 34.085700;
  this.bbox_reference_bottom_left_x = -119.291728;
  this.bbox_reference_bottom_left_y = 34.091616;
  this.bbox_reference_top_right_x = -117.284403;
  this.fow = 200
  this.camera_z = 10
  this.padding_right = 42
  this.padding_left = 41
  this.padding_top = 9
  this.padding_bottom = 5
});

componentsConfig = new (function(){
  this.components_map = d3.map()
})

componentsConfig.components_map.set("Loudness", ["Lmaxdba","Leqdba","Lmindba"])
componentsConfig.components_map.set("Frequency", ["High","Voice"])
