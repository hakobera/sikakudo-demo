window.onload = function () {
  var SCREEN_WIDTH = 320;
  var SCREEN_HEIGHT = 240;

  var socket = io.connect();

  var personaImage = new Image();
  personaImage.src = "/images/persona.png";

  var srcStream = document.getElementById("src"),
    workCanvas = document.createElement('canvas'),
    workContext = workCanvas.getContext('2d'),
    destCanvas = document.getElementById("dest"),
    destContext = destCanvas.getContext('2d');

  workCanvas.width = SCREEN_WIDTH;
  workCanvas.height = SCREEN_HEIGHT;
  destCanvas.width = SCREEN_WIDTH;
  destCanvas.height = SCREEN_HEIGHT;

  navigator.webkitGetUserMedia("video", success, fail);

  function success(stream) {
    var url = webkitURL.createObjectURL(stream);
    srcStream.src = url;
    setInterval(draw, 500);
  }

  function fail(error) {
    alert("GetUserMedia() failed");
  }

  function draw() {
    workContext.drawImage(srcStream, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    destContext.drawImage(srcStream, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    var comp = ccv.detect_objects({"canvas":ccv.grayscale(workCanvas),
      "cascade":cascade,
      "interval":5,
      "min_neighbors":1 });

    for (var i = 0, length = comp.length; i < length; i++) {
      destContext.drawImage(personaImage, comp[i].x - 50, comp[i].y - 70, comp[i].width + 120, comp[i].height + 120);
    }

    socket.emit('face', destCanvas.toDataURL("image/jpeg"));
  }
};