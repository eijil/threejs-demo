
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
  	windowHalfY;


var floor;
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
function createFloor(){
  floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1000,1000),
    new THREE.MeshPhongMaterial({color: 0xebe5e7,shading:THREE.FlatShading}));
  floor.rotation.x = -Math.PI/2;
  floor.position.y = 0;
  floor.castShadow =true;
  floor.receiveShadow = true;
  scene.add(floor);

}

function createLights(){
  //环境光
  hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .5);
  //方向光
  directionalLight = new THREE.DirectionalLight(0xffffff, .8);
  directionalLight.position.set(550,500,700);
  directionalLight.shadow.camera.far = 5000;
  directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 2048;
  var d = 500;
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


    var test = makeCube(orangeMat,50,150,50,-225,75,-100,0,0,0);
    scene.add(test);

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

//创建路径
function createMap(){
  var tileMaps=[
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
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
  var tileSize = 50;
  //行
  var line = 1;
  //原点第10行
  var origin =10;
  //每行20个
  var step = 20;
  var posx;
  var posy  = 0;
  var posz;

  for(var i=0;i<tileMaps.length;i++){

    if(tileMaps[i] == 1){
      //计算位置
      var index = i - (line-1) * step;
      posx = Math.abs((origin - index) * tileSize );
      posz = Math.abs((origin - line) * tileSize );
      //左右
      if(index < origin){
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
      var mesh = makeCube(greyMat,tileSize,5,tileSize,posx,posy,posz,0,0,0);
      scene.add(mesh);

    }
    //
    i % step ==0 & i != 0 && line ++;
  }



}


function init(){
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 75;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  camera.position.x = 0;
  camera.position.z = 400;
  camera.position.y = 250;
  //camera.lookAt(new THREE.Vector3(0, 60, 0))
  camera.lookAt(camera.position)
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
  renderer.render(scene, camera);
}
//
function loop() {

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
}


init();
createLights();
createFloor();
createSomething();
createMap();
loop();
helper();
