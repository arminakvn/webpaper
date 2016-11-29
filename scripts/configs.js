frameConfig = new (function() {
  this.height = 20;
  this.width = 20;
  this.bbox_reference_bottom_left_y = 34.085700;
  this.bbox_reference_bottom_left_x = -118.291728;
  this.bbox_reference_top_right_y = 34.091616;
  this.bbox_reference_top_right_x = -118.284403;
});

componentsConfig = new (function(){
  this.components_map = d3.map()
})

componentsConfig.components_map.set("Loudness", ["Lmaxdba","Leqdba","Lmindba"])
componentsConfig.components_map.set("Frequency", ["High","Voice"])
