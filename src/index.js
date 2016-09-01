import THREEx from 'Threex.keyboardstate';
var scene,
    camera,
    controls,
    fieldOfView,
  	aspectRatio,
  	nearPlane,
  	farPlane,
    directionalLight,
    hemisphereLight,
    renderer,
		container,
    HEIGHT,
  	WIDTH,
    windowHalfX,
    windowHalfY,
    keyboard;

//Material
var whiteMat = new THREE.MeshPhongMaterial ({
    color: 0xffffff,
    shading:THREE.FlatShading
});
var blueMat = new THREE.MeshPhongMaterial ({
    color: 0x4aa5da,
    shading:THREE.FlatShading
});

var greyMat = new THREE.MeshPhongMaterial ({
   color: 0x999999,
   shading:THREE.FlatShading
 });
 var orangeMat = new THREE.MeshPhongMaterial ({
     color: 0xef704f,
     shading:THREE.FlatShading
});
var yellowMat = new THREE.MeshPhongMaterial ({
  color: 0xffde79,
  shading:THREE.FlatShading
});
var blackMat = new THREE.MeshPhongMaterial ({
  color: 0x000000,
  shading:THREE.FlatShading
});

//场景
var floor,player,game,sky;

function createWorld(){
  floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5000,5000),
    new THREE.MeshPhongMaterial({color: 0xebe5e7,shading:THREE.FlatShading}));
  floor.rotation.x = -Math.PI/2;
  floor.position.y = 0;
  floor.castShadow =true;
  floor.receiveShadow = true;
  scene.add(floor);

  // SKYDOME
	var vertexShader = document.getElementById( 'vertexShader' ).textContent;
	var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	var uniforms = {
		topColor: 	 { type: "c", value: new THREE.Color( 0x0077ff ) },
		bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
		offset:		 { type: "f", value: 400 },
		exponent:	 { type: "f", value: 0.6 }
	};
  //0x00aaff
  //0xaabbff
  var skycolor = new THREE.Color(0x00aaff);
	uniforms.topColor.value.copy(skycolor);
  //球形
	var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
	var skyMat = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		side: THREE.BackSide
	} );
	sky = new THREE.Mesh( skyGeo, skyMat );
	scene.add( sky );

}

function createLights(){
  //环境光
  hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);
  //方向光

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);

  directionalLight.position.set(500,400,500);
  directionalLight.shadow.camera.far = 5000;
  directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 2048;
  var d = 800;
	directionalLight.shadow.camera.left = -d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = -d;
  directionalLight.castShadow = true;
  //directionalLight.shadow.bias = -0.0001;
  scene.add(hemisphereLight);
  scene.add(directionalLight);
}
function createSomething(){


    //jd building
    var jdBulding = new THREE.Group();
    //left
    var cube1 = makeCube(blueMat,50,100,100,-150,50,100);
    //bottom
    var cube2 = makeCube(whiteMat,305,25,110,-25,12,100);
    var cube3 = makeCube(whiteMat,55,33,110,-150,77,100);
    var cube4 = makeCube(blueMat,50,130,100,-50,80,100);
    var cube5 = makeCube(whiteMat,250,25,110,-52,113,100);
    var cube6 = makeCube(blueMat,100,130,100,75,80,100);
    var cube7 = makeCube(whiteMat,125,20,110,-86,41,100);
    var cube8 = makeCube(whiteMat,105,35,110,75,55,100);
    //top
    var cube9 = makeCube(whiteMat,205,35,110,25,160,100);
    jdBulding.add(cube1,cube2,cube3,cube4,cube5,cube6,cube7,cube8,cube9);
    scene.add(jdBulding);


}
//玩家
var Player = function(){


  this.playerGroup = new THREE.Group();
  this.body = makeCube(yellowMat,30,80,40,0,0,0);
  //face
  this.face = new THREE.Group();
  //eyes
  var eyeGeom = new THREE.BoxGeometry(10,10,2);
  var irisGeom = new THREE.BoxGeometry(2,2,1);
  this.leftEye = new THREE.Mesh(eyeGeom, whiteMat);
  this.leftEye.position.x = this.body.position.x - 10;
  this.leftEye.position.y = this.body.position.y + 25;
  this.leftEye.position.z = this.body.position.z + 25;
  this.rightEye = new THREE.Mesh(eyeGeom, whiteMat);
  this.rightEye.position.x = this.body.position.x + 10;
  this.rightEye.position.y = this.body.position.y + 25;
  this.rightEye.position.z = this.body.position.z + 25;
  //
  this.leftIris = new THREE.Mesh(irisGeom, blackMat);
  this.leftIris.position.x = this.leftEye.position.x;
  this.leftIris.position.y = this.leftEye.position.y;
  this.leftIris.position.z = this.leftEye.position.z + 1;

  this.rightIris = new THREE.Mesh(irisGeom, blackMat);
  this.rightIris.position.x = this.rightEye.position.x;
  this.rightIris.position.y = this.rightEye.position.y;
  this.rightIris.position.z = this.rightEye.position.z + 1;

  this.face.add(this.leftEye);
  this.face.add(this.leftIris);
  this.face.add(this.rightEye);
  this.face.add(this.rightIris);


  this.playerGroup.add(this.body);
  this.playerGroup.add(this.face);

  this.playerGroup.traverse( function ( object ) {
		if ( object instanceof THREE.Mesh ) {
			object.castShadow = true;
			object.receiveShadow = true;
		}
	});
  this.init();

}
//
Player.prototype.init = function(){

    //设置开始的位置
    this.mapIndex = 143;
    var position = game.getPos(this.mapIndex);
    this.playerGroup.position.x = position.x
    this.playerGroup.position.y = 40;
    this.playerGroup.position.z = position.z;
    //carmer.lookAt(this.playerGroup.position);
    //设置方向
    this.direction = 'top';
    this.turn();
    scene.add(this.playerGroup);


}
/*
 * 移动
 * cur  : 当前位置
 * count : 步数
 */
Player.prototype.move = function(count){
  var _this = this;
  this.isMove = true;
  //时间轴
  this.tl = new TimelineMax({onComplete:function(){
    _this.isMove = false;
  }});
  var position =this.playerGroup.position;
  var rotation = this.playerGroup.rotation;
  //var scale = this.playerGroup.scale;
  var duration = 0.25;

  while (count > 0) {
    if(this.direction == 'right'){
        this.tl.to(position,duration,{x:'+=50',y:'80'});
        this.mapIndex+=1;
        var right = game.tileMaps[this.mapIndex + 1];
        var top = game.tileMaps[this.mapIndex - game.tileStep];
        var bottom = game.tileMaps[this.mapIndex + game.tileStep];
        if(!right && top){
          this.direction = 'top';
          this.tl.to(rotation,duration,{y:'+='+Math.PI/2});
        }else if(!right && bottom){
          this.direction = 'bottom';
          this.tl.to(rotation,duration,{y:'-='+Math.PI/2});
        }

    }else if(this.direction == 'left'){
        this.tl.to(position,0.25,{x:'-=50',y:'80'});
        this.mapIndex-=1;
        var left = game.tileMaps[this.mapIndex-1];
        var top = game.tileMaps[this.mapIndex - game.tileStep];
        var bottom = game.tileMaps[this.mapIndex + game.tileStep];
        if(!left && top){
          this.direction = 'top';
          this.tl.to(rotation,duration,{y:'-='+Math.PI/2});
        }else if(!left && bottom){
          this.direction = 'bottom';
          this.tl.to(rotation,duration,{y:'+='+Math.PI/2});
        }
    }else if(this.direction == 'top'){

        this.tl.to(position,0.25,{z:'-=50',y:'80'});

        this.mapIndex-=20;

        var left = game.tileMaps[this.mapIndex-1];
        var top = game.tileMaps[this.mapIndex-20];
        var right = game.tileMaps[this.mapIndex+1];
        if(!top && left){
          this.direction = 'left';
          this.tl.to(rotation,duration,{y:'+='+Math.PI/2});
        }else if(!top && right){
          this.direction = 'right';
          this.tl.to(rotation,duration,{y:'-='+Math.PI/2});
        }
    }else if(this.direction == 'bottom'){
        this.tl.to(this.playerGroup.position,0.25,{z:'+=50',y:'80'});
        this.mapIndex += 20;
        var left = game.tileMaps[this.mapIndex-1];
        var bottom = game.tileMaps[this.mapIndex+20];
        var right = game.tileMaps[this.mapIndex+1];
        if(!bottom && left){
          this.direction = 'left';
          this.tl.to(rotation,duration,{y:'-='+Math.PI/2});
        }else if(!bottom && right){
          this.direction = 'right';
          this.tl.to(rotation,duration,{y:'+='+Math.PI/2});
        }
    }
    this.tl.to(position,duration/3,{y:'40'});
      console.log(this.playerGroup.position)
    count--;
  }
}
//转向
Player.prototype.turn = function(){

  var roation = this.playerGroup.rotation;
   if(this.direction == 'left'){
     roation.y = -Math.PI/2;
   }
   if(this.direction == 'right'){
     roation.y = Math.PI/2;
   }
   if(this.direction == 'top'){
     roation.y = Math.PI;
   }
   if(this.direction == 'bottom'){
     roation.rotation.y = -Math.PI * 2;
   }
}

/*
 *  game
 */
 var Game = function(){
   //地图
   this.tileMaps = [];
   //每格大小20
   this.tileStep = 20;
   //大小50
   this.tileSize = 50;

   this.createMap();

 }
 //根据地图数组坐标得到位置信息
 Game.prototype.getPos = function(id){

   var line = Math.ceil(id/this.tileStep) || 1;
   var p =  id % this.tileStep;
   var origin =  this.tileStep/2;
   var posx;
   var posy = 0;
   var posz;
   posx = Math.abs((origin - p) * this.tileSize );
   posz = Math.abs((origin - line) * this.tileSize );
   //左右
   if(p < origin){
     posx = (posx - 25) * -1;
   }else{
     posx = posx  + 25
   }
   //前后
   if(line < origin ){
     posz = (posz + 25) * -1;
   }else{
     posz = (posz - 25)
   }
   return new THREE.Vector3(posx,posy,posz)
 }
 Game.prototype.createMap = function(){
   this.tileMaps=[
           1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
           0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,
           0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,
           0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
           0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
           0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
           0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
   ];

   for(var i=0;i<this.tileMaps.length;i++){

     if(this.tileMaps[i] == 1){

       var pos = this.getPos(i);
       var mesh = makeCube(greyMat,this.tileSize,5,this.tileSize,pos.x,pos.y,pos.z,0,0,0);
       scene.add(mesh);

     }

   }

 }

function initGame(){
  game = new Game();
  player = new Player();
  //debug
  window.player = player;
  window.game = game;

  keyboard	= new THREEx.KeyboardState()
  //camera.position = player.playerGroup.position;
}


var cubeCamera;
function init(){
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 75;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  cubeCamera = new THREE.CubeCamera( nearPlane, farPlane, 256 );
  camera.position.x = -600;
  camera.position.z =-450;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  //
  controls = new THREE.OrbitControls( camera, renderer.domElement);


}

function render(){

  if (controls) controls.update();
  camera.position.x +=1;

  renderer.render(scene, camera);
}
//
function update(){
  $("#dev-info").html('<p>位置:'+player.mapIndex+'</p><p>步数:'+random+'</p>');
}
var random = 0
function loop(now) {
  if( keyboard.pressed('space') ){
    if(!player.isMove){
      random = THREE.Math.randInt(1,6);
      player.move(random);
      update();
    }
  }

  render();
  requestAnimationFrame( loop );
}

function makeCube(mat, w, h, d, posX, posY, posZ, rotX=0, rotY=0, rotZ=0) {
  var geom = new THREE.BoxGeometry(w, h, d);
  var mesh = new THREE.Mesh(geom, mat);
  mesh.position.x = posX;
  mesh.position.y = posY;
  mesh.position.z = posZ;
  mesh.rotation.x = rotX;
  mesh.rotation.y = rotY;
  mesh.rotation.z = rotZ;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}


//辅助
function helper(){
  var size =500;
  var step = 20;
  var gridHelper = new THREE.GridHelper( size, step,0x0000ff, 0x808080 );
  scene.add( gridHelper );
  var dlHelper = new THREE.DirectionalLightHelper(directionalLight,100);
  scene.add(dlHelper);
  // var caremerHelp = new THREE.CameraHelper(directionalLight.shadow.camera);
  // scene.add(caremerHelp);

}

init();
createLights();
createWorld();

initGame();
createSomething();
loop();
helper();
