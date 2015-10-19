// Cursor movement
// Thanks to AMAZING CODE from Nik Rowell
// http://codepen.io/nikrowell/pen/BNdaKV
// Ultraviolet
// ------------------------------------------------------
// Inspired by the album "Save Your Heart" by Lights and Motion
// http://labs.nikrowell.com/lightsandmotion/ultraviolet
// http://deepelmdigital.com/album/save-your-heart
var ctx,
    hue,
    buffer,
    target = {},
    tendrils = [],
    settings = {};

settings.debug = false;
settings.friction = 0.5;
settings.trails = 20;
settings.size = 60;
settings.dampening = 0.25;
settings.tension = 0.98;
Math.TWO_PI = Math.PI * 2;

// ========================================================================================
// Oscillator
// ----------------------------------------------------------------------------------------

function Oscillator(options) {
  this.init(options || {});
}

Oscillator.prototype = (function() {

  var value = 0;

  return {
    init: function(options) {
      this.phase = options.phase || 0;
      this.offset = options.offset || 0;
      this.frequency = options.frequency || 0.001;
      this.amplitude = options.amplitude || 1;
    },

    update: function() {
      this.phase += this.frequency;
      value = this.offset + Math.sin(this.phase) * this.amplitude;
      return value;
    },

    value: function() {
      return value;
    }
  };

})();

// ========================================================================================
// Tendril
// ----------------------------------------------------------------------------------------

function Tendril(options) {
  this.init(options || {});
}

Tendril.prototype = (function() {

  function Node() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
  }

  return {
    init: function(options) {

      this.spring = options.spring + (Math.random() * 0.1) - 0.05;
      this.friction = settings.friction + (Math.random() * 0.01) - 0.005;
      this.nodes = [];

      for(var i = 0, node; i < settings.size; i++) {
        node = new Node();
        node.x = target.x;
        node.y = target.y;
        this.nodes.push(node);
      }
    },

    update: function() {
      var spring = this.spring,
      node = this.nodes[0];
      node.vx += (target.x - node.x) * spring;
      node.vy += (target.y - node.y) * spring;

      for(var prev, i = 0, n = this.nodes.length; i < n; i++) {
        node = this.nodes[i];
        if(i > 0) {
          prev = this.nodes[i - 1];
          node.vx += (prev.x - node.x) * spring;
          node.vy += (prev.y - node.y) * spring;
          node.vx += prev.vx * settings.dampening;
          node.vy += prev.vy * settings.dampening;
        }
        node.vx *= this.friction;
        node.vy *= this.friction;
        node.x += node.vx;
        node.y += node.vy;
        spring *= settings.tension;
      }
    },
    draw: function() {
      var x = this.nodes[0].x,
          y = this.nodes[0].y,
          a, b;
      ctx.beginPath();
      ctx.moveTo(x, y);

      for(var i = 1, n = this.nodes.length - 2; i < n; i++) {
        a = this.nodes[i];
        b = this.nodes[i + 1];
        x = (a.x + b.x) * 0.5;
        y = (a.y + b.y) * 0.5;
        ctx.quadraticCurveTo(a.x, a.y, x, y);
      }

      a = this.nodes[i];
      b = this.nodes[i + 1];
      ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
      ctx.stroke();
      ctx.closePath();
    }
  };
})();

// ----------------------------------------------------------------------------------------

function reset() {
  tendrils = [];

  for(var i = 0; i < settings.trails; i++) {
    tendrils.push(new Tendril({
      spring: 0.45 + 0.025 * (i / settings.trails)
    }));
  }
}

function loop() {
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = 'rgba(8,5,16,0.4)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = 'hsla(' + Math.round(hue.update()) + ',90%,50%,0.5)';
  ctx.lineWidth = 2;

  for(var i = 0, tendril; i < settings.trails; i++) {
    tendril = tendrils[i];
    tendril.update();
    tendril.draw();
  }

  requestAnimFrame(loop);
}

function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

function mousemove(event) {
  target.x = event.clientX
  target.y = event.clientY;
}


function exp_desktop() {
  var body = $('body'),
      win = $(window),
      content = $('#content');

  // Insert styles
  var stylesheet = $("<style type=\"text\/css\">#lg-canvas{position:fixed;z-index:10;top:0;left:0;width:100%;height:100%}<\/style>"),
      cvs = $("<canvas id=\"lg-canvas\"></canvas>");

  body.append(stylesheet);
  body.append(cvs);


  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(fn) { window.setTimeout(fn, 1000 / 60) };
  })();

    ctx = document.getElementById('lg-canvas').getContext('2d');

  hue = new Oscillator({
    phase: Math.random() * Math.TWO_PI,
    amplitude: 85,
    frequency: 0.020,
    offset: 285
  });

  document.body.addEventListener('orientationchange', resize);
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', mousemove);
  target.x = $(window).width()/2;
  target.y = 300;
  resize();
  reset();
  loop();
};