

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container,stats;

var camera, scene1, scene2, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();


function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  renderer = new THREE.WebGLRenderer( { antialias: true } );

  //

  camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 25000 );
  camera.position.z = 1500;

  scene1 = new THREE.Scene();
  scene2 = new THREE.Scene();

  scene1.fog = new THREE.Fog( 0xf2f7ff, 1, 25000 );
  scene2.fog = scene1.fog;

  scene1.add( new THREE.AmbientLight( 0xeef0ff ) );
  scene2.add( new THREE.AmbientLight( 0xeef0ff ) );

  var light1 = new THREE.DirectionalLight( 0xffffff, 2 );
  light1.position.set( 1, 1, 1 );
  scene1.add( light1 );

  var light2 = new THREE.DirectionalLight( 0xffffff, 2 );
  light2.position.set( 1, 1, 1 );
  scene2.add( light2 );

  // GROUND

  var textureLoader = new THREE.TextureLoader();

  var maxAnisotropy = renderer.getMaxAnisotropy();

  var texture1 = textureLoader.load( "http://192.168.153.95/threejs/textures/crate.gif" );
  var material1 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture1 } );

  texture1.anisotropy = maxAnisotropy;
  texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
  texture1.repeat.set( 512, 512 );

  var texture2 = textureLoader.load( "http://192.168.153.95/threejs/textures/crate.gif" );
  var material2 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture2 } );

  texture2.anisotropy = 1;
  texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
  texture2.repeat.set( 512, 512 );

  if ( maxAnisotropy > 0 ) {

    document.getElementById( "val_left" ).innerHTML = texture1.anisotropy;
    document.getElementById( "val_right" ).innerHTML = texture2.anisotropy;

  } else {

    document.getElementById( "val_left" ).innerHTML = "not supported";
    document.getElementById( "val_right" ).innerHTML =  "not supported";

  }

  //

  var geometry = new THREE.PlaneBufferGeometry( 100, 100 );

  var mesh1 = new THREE.Mesh( geometry, material1 );
  mesh1.rotation.x = - Math.PI / 2;
  mesh1.scale.set( 1000, 1000, 1000 );

  var mesh2 = new THREE.Mesh( geometry, material2 );
  mesh2.rotation.x = - Math.PI / 2;
  mesh2.scale.set( 1000, 1000, 1000 );

  scene1.add( mesh1 );
  scene2.add( mesh2 );

  // RENDERER

  renderer.setClearColor( scene1.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  renderer.autoClear = false;

  renderer.domElement.style.position = "relative";
  container.appendChild( renderer.domElement );

  // STATS1




  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}


function onDocumentMouseMove(event) {

  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );

}


function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {

  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y = THREE.Math.clamp( camera.position.y + ( - ( mouseY - 200 ) - camera.position.y ) * .05, 50, 1000 );

  camera.lookAt( scene1.position );

  renderer.clear();
  renderer.setScissorTest( true );

  renderer.setScissor( 0, 0, SCREEN_WIDTH/2 - 2, SCREEN_HEIGHT );
  renderer.render( scene1, camera );

  renderer.setScissor( SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2 - 2, SCREEN_HEIGHT  );
  renderer.render( scene2, camera );

  renderer.setScissorTest( false );


}
