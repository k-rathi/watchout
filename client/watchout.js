// start slingin' some d3 here.

svgOptions = {
  height: 800,
  width: 1000,
  nEnemies: 30,
  padding: 20
};

gameBoardOptions = {
  transform: `translate(${svgOptions.width-400}, 20)`,
  height: 100,
  width: 300
};

axes = {
  x : d3.scale.linear().domain([0,100]).range([0, svgOptions.width]),
  y : d3.scale.linear().domain([0,100]).range([0, svgOptions.height])
};

gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

var svg = d3.select('body')
  .append('svg:svg')
  .attr('height', svgOptions.height+'px')
  .attr('width', svgOptions.width+'px')
  .style('background-color', "red");
  // .enter()

var gameboard = svg
  .append('g')
  .attr('stroke-width', '2px')
  .attr('transform', gameBoardOptions.transform)
  .attr('height', gameBoardOptions.height)
  .attr('width', gameBoardOptions.width);

var rectangle = gameboard
  .append('rect')
  .attr('fill', 'rgba(220,220,220, .4)')
  .attr('height', gameBoardOptions.height)
  .attr('width', gameBoardOptions.width);

 var text1 = gameboard.append('svg:text')
  .append('svg:tspan')
    .attr('id', "current-score")
    .attr('x', 50)
    .attr('dy', 30)
    .text(`Current Score: ${gameStats.score}`);

  var text2 = gameboard.append('svg:text').append('svg:tspan')
    .attr('id', 'best-score')
    .attr('x', 50)
    .attr('dy', 60)
    .text(`High Score: ${gameStats.bestScore}`);

  var text3 = gameboard.append('svg:text')
  .append('svg:tspan')
    .attr('id', 'collisions')
    .attr('x', 50)
    .attr('dy', 90)
    .text(`Collisions: ${gameStats.collisions}`);


class Player {
  constructor(gameOptions){
    this.gameOptions = gameOptions;
    this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
    this.fill = 'orange';
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.r = 5;
  }
  render(to){
    this.el = to.append('svg:path')
                .attr('d', this.path)
                .attr('fill', this.fill);
    this.transform({
      x: this.gameOptions.width * 0.5,
      y: this.gameOptions.height * 0.5
    });
    this.setupDragging();
    return this;
  }
  getX(){
    return this.x;
  }
  setX(x){
    var minX = this.gameOptions.padding;
    var maxX = this.gameOptions.width - this.gameOptions.padding;
    if (x <= minX){ x = minX};
    if (x >= maxX){ x = maxX};
    return this.x = x;
  }
  getY(){
    return this.y;
  }
  setY(y){
    var minY = this.gameOptions.padding;
    var maxY = this.gameOptions.height -this.gameOptions.padding;
    if (y <= minY){ y = minY}
    if (y >= maxY){ y = maxY}
    return this.y = y;
  }
  transform(opts){
    this.angle = opts.angle || this.angle;
    this.setX(opts.x) || this.x;
    this.setY(opts.y) || this.y;
    this.el.attr('transform',
      `rotate(${this.angle},${this.getX()},${this.getY()}), translate(${this.getX()},${this.getY()})`);

    // not finished yet
  }
  moveAbsolute(x, y) {
    this.transform({x: x, y: y});
  }

  moveRelative(dx, dy) {
    this.transform({x: this.getX()+dx, y: this.getY()+dy, angle: 360 * (Math.atan2(dy,dx)/(Math.PI*2))});
  }

  setupDragging(){
    var dragMove = function(){
      return this.moveRelative(d3.event.dx, d3.event.dy);
    }.bind(this);
    var drag = d3.behavior.drag().on('drag', dragMove);
    return drag.call(this.el);
  }
}

var player = new Player(svgOptions).render(svg);

var enemies =
  gameboard.append('circle');

function updateBestScore() {
  console.log('running');
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  console.log(gameStats.bestScore);
  d3.select('#best-score')
    .text(`High Score: ${gameStats.bestScore}`);
 }

function updateCurrentScore() {
  d3.select('#current-score')
    .text(`Current Score: ${gameStats.score}`);
}

function updateCollisions() {
  d3.select('#collisions')
    .text(`Collisions: ${gameStats.collisions}`);
}

var enemyData = [];

function generateBalls() {
  for(var i = 0; i < 30; i++) {
    var newBall = {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
    enemyData.push(newBall);
  }
}

function updateBalls() {
  var enemies = svg.selectAll('circle.enemy');
  var newEnemyData = [];
  for(var i = 0; i < 30; i++) {
    var newBall = {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
    newEnemyData.push(newBall);
  }
  enemyData = newEnemyData;
}

function render(enemy_data) {
  var enemies = svg.selectAll('circle.enemy')
    .data(enemy_data, function(d) { return d.id; });
  enemies.enter()
    .append('svg:circle')
      .attr('class', 'enemy')
      .attr('cx', (enemy) => axes.x(enemy.x))
      .attr('cy', (enemy) => axes.y(enemy.y))
      .attr('fill', 'black')
      .attr('r', 10);
  enemies.exit()
    .remove();

  function checkCollision(enemy, callback) {
    var radiusSum = parseFloat(enemy.attr('r')) + player.r;
    var xDiff = parseFloat(enemy.attr('cx')) - player.x;
    var yDiff = parseFloat(enemy.attr('cy')) - player.y;
    var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff,2));
    if (separation < radiusSum) {
      callback(player, enemy);
    }
  }

  function onCollision() {
    updateBestScore();
    gameStats.score = 0;
    updateCurrentScore();
    gameStats.collisions ++;
    updateCollisions();
  }

  function collisionCheck(endPosition) {
    var enemy = d3.select(this)
    var startPosition = {
      x : parseFloat(enemy.attr('cx')),
      y : parseFloat(enemy.attr('cy'))
    }
    var endData = {
      x: axes.x(endPosition.x),
      y: axes.y(endPosition.y)
    }
    return function(t) {
      checkCollision(enemy, onCollision);
      enemyNext = {
        x: startPosition.x + (endData.x - startPosition.x) * t,
        y: startPosition.y + (endData.y - startPosition.y) * t
      }
      enemy.attr('cx', enemyNext.x)
          .attr('cy', enemyNext.y)
    }
  }
    enemies
      .transition()
        .duration(500)
        .attr('r', 10)
      .transition()
        .duration(2000)
        .tween('custom',  collisionCheck)
}

function startGame() {
  generateBalls();
  function gameTurn() {
    updateBalls();
    render(enemyData);
  }
  function increaseScore() {
    gameStats.score++;
    updateCurrentScore();
    updateBestScore();
  }
  gameTurn();
  setInterval(gameTurn, 2000);
  setInterval(increaseScore, 500);
}

startGame();
