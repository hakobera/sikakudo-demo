(function() {
  var src,
      dest,
      socket,
      width = 320,
      height = 240;

  var image = new Image();
  image.src = "/images/persona.jpg";

  function init() {
    src = document.getElementById("src");
    dest = document.getElementById("dest");
    navigator.webkitGetUserMedia("video", onGotStream, onFailedStream);

    var path = window.location.hostname + ':' + window.location.port;

    socket = new WebSocket('ws://' + path);
    //socket.binaryType = 'blob';
  }

  function onGotStream(stream) {
    var url = webkitURL.createObjectURL(stream);
    src.src = url;
    setInterval(draw, 1000);
  }

  function onFailedStream(error) {
    alert("onFailedStream");
  }

  function draw() {
    var canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    context.drawImage(src, 0,0,width,height);

    dest.width = width;
    dest.height = height;
    var context2 = dest.getContext("2d");
    context2.drawImage(src,0,0,width,height);

    var comp = ccv.detect_objects({"canvas" :ccv.grayscale(canvas),
      "cascade" : cascade,
      "interval" : 5,
      "min_neighbors" : 1 });

    var i = 0, length = comp.length;
    for (; i < length; i++) {
      context2.drawImage(image, comp[i].x-30, comp[i].y-30, comp[i].width+60, comp[i].height+60);
    }

    var dataUrl = dest.toDataURL("image/jpeg");
    socket.send(dataUrl);
  };

  document.addEventListener('DOMContentLoaded', init);

}());