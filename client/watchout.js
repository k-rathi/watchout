// start slingin' some d3 here.

svgOptions = {
  height: 950,
  width: 500
};

gameBoardOptions = {
  transform: `translate(${svgOptions.width-50}, 20)`,
  height: 100,
  width: 300,
  x: svgOptions.width, //width
  y: 50 //height
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

var enemyData = [];

var svg = d3.select('body')
  .append('svg')
  .attr('height', svgOptions.width+'px')
  .attr('width', svgOptions.height+'px')
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

var texts =
 gameboard.append('svg:text')
  .append('svg:tspan')
  .attr('x', 50)
  .attr('dy', 30)
  .text(function(d) { return `Current Score: ${gameStats.score}`})
  .append('svg:tspan')
  .attr('x', 50)
  .attr('dy', 30)
  .text(function(d) { return `High Score: ${gameStats.bestScore}`})
  .append('svg:tspan')
  .attr('x', 50)
  .attr('dy', 30)
  .text(function(d) { return `Collisions: ${gameStats.collisions}`})

var enemies =
  gameboard.append('circle')


function CollisionDetection()

function updateScoreboard() {

}

function updateBestScore() {
  if()
}
function updateGameboard(data) {
  // update gamestats

  //input gamestats into gameboard on update
  gameboard
    .data(gameStats)

    .enter()

}

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
generateBalls();

function render() {
  var enemies = svg.selectAll('circle.enemy')
    .data(enemyData, function(d) { return d.id; });

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
    _.each(enemies, function(enemy) {
      var radiusSum = parseFloat(enemy.attr('r')) + player.r;
      var xDiff = parseFloat(enemy.attr('cx')) - player.x;
      var yDiff = parseFloat(enemy.attr('cy')) - player.y;
      var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff,2));
      if (separation < radiusSum) {
        callback(player, enemy);
      }
    });
  }
  function onCollision() {
    gameStats.score = 0;
    updateBestScore();

  }
}

render();

function startGame() {
  function gameTurn() {
    var enemyPositions = generateBalls();
    render();
  }
  function increaseScore() {
    gameStats.score++;
    updateGameboard();
    if(gameStats.bestScore < gameStats.score)  {
      gameStats.bestScore = gameStats.score;
    }
  };
  gameTurn();
  setInterval(gameTurn, 2000);
  setInterval(increaseScore, 500);
}

class Player {
  constructor(gameOptions){
    this.gameOptions = gameOptions;
    this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
    this.fill = '#ff6600';
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.r = 5;
  }
  render(to){
    this.el = to.append('svg:path')
                .attr('d', this.path)
                .attr('fill', this.fill);
    this.transform = {
      x: this.gameOptions.width * 0.5,
      y: this.gameOptions.height * 0.5
    };
    this.setupDragging();
    //this?
  }


}

startGame();
