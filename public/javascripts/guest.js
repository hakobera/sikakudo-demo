window.onload = function () {
  var socket = new io.connect(),
    outImg = document.getElementById('out');

  socket.on('facecast', function (message) {
    render(message);
  });

  function render(data) {
    outImg.src = data;
  }
};