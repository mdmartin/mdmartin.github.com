var camera, scene, renderer;
var camera2, scene2, renderer2;
var target = new THREE.Vector3();
var target2 = new THREE.Vector3();
var alpha, gamma, beta;

// change these to control the start position and rotation of camera
var CAMERASTART = 90;      // or 90, 180, 270
var DEGREEINC = .1;       //rate of horizontal rotation of camera
var LATINC = 0; //vertical rotation of camera
var FOV = 75;  // camera field of view

// another method of calculating rotation; not used now
var degreecount = 0;    //counter for rotation of camera
var lon = CAMERASTART; //horizontal pos of camera
var lat = 0;  // vertical pos of camera 
var phi = 0, theta = 0;
var elements = []; //array for pano currently displays

//css objects
var object1, object2;

// Called when the pano images are loaded; should make startup smoother
function startExperience (){
	//alert('start experience2');
init();		// to set up panos
animate();  // called each frame to rotate camera
}

			
// initiatlize: two sets of pano images
function init() {

	camera = new THREE.PerspectiveCamera( FOV, window.innerWidth / window.innerHeight, 1, 1000 );
	camera2 = new THREE.PerspectiveCamera( FOV, window.innerWidth / window.innerHeight, 1, 1000 );

	scene = new THREE.Scene();
	scene2 = new THREE.Scene();
	if (window.DeviceOrientationEvent) {
	  // your code
	 	window.addEventListener('deviceorientation', capture_orientation, false);
	} else {
	 	alert('device orientation not supported');
	  // add fallback code here, as necessary
	}

	var sides1 = [
		{
			url: 'resources/images/aJWBP.0001.png',
			position: new THREE.Vector3( -512, 0, 0 ),
			rotation: new THREE.Euler( 0, Math.PI / 2, 0 )
		},
		{
			url: 'resources/images/aJWBP.0003.png',
			position: new THREE.Vector3( 512, 0, 0 ),
			rotation: new THREE.Euler( 0, -Math.PI / 2, 0 )
		},
		{
			url: 'resources/images/aJWBP.0004.png',
			position: new THREE.Vector3( 0,  -512, 0 ),
			rotation: new THREE.Euler( -Math.PI / 2, 0, Math.PI )
		},
		{
			url: 'resources/images/aJWBP.0005.png',
			position: new THREE.Vector3( 0, 512, 0 ),
			rotation: new THREE.Euler( Math.PI / 2, 0, Math.PI )
		},
		{
			url: 'resources/images/aJWBP.0000.png',
			position: new THREE.Vector3( 0, 0,  512 ),
			rotation: new THREE.Euler( 0, Math.PI, 0 )
		},
		{
			url: 'resources/images/aJWBP.0002.png',
			position: new THREE.Vector3( 0, 0, -512 ),
			rotation: new THREE.Euler( 0, 0, 0 )
		}
	];
	
	var sides2 = [
		{
			url: 'resources/images/aYMCA_old_timey1.0001.png',
			position: new THREE.Vector3( -512, 0, 0 ),
			rotation: new THREE.Euler( 0, Math.PI / 2, 0 )
		},
		{
			url: 'resources/images/aYMCA_old_timey1.0003.png',
			position: new THREE.Vector3( 512, 0, 0 ),
			rotation: new THREE.Euler( 0, -Math.PI / 2, 0 )
		},
		{
			url: 'resources/images/aYMCA_old_timey1.0004.png',
			position: new THREE.Vector3( 0,  -512, 0 ),
			rotation: new THREE.Euler( -Math.PI / 2, 0, Math.PI )
		},
		{
			url: 'resources/images/aYMCA_old_timey1.0005.png',
			position: new THREE.Vector3( 0, 512, 0 ),
			rotation: new THREE.Euler( Math.PI / 2, 0, Math.PI )
		},
		{
			url: 'resources/images/aYMCA_old_timey1.0000.png',
			position: new THREE.Vector3( 0, 0,  512 ),
			rotation: new THREE.Euler( 0, Math.PI, 0 )
		},
		{
			url: 'resources/images/aYMCA_old_timey1.0002.png',
			position: new THREE.Vector3( 0, 0, -512 ),
			rotation: new THREE.Euler( 0, 0, 0 )
		}
	];

	// now create the Skybox and scale it to avoid collision with the divs
	
	var sc = new THREE.Object3D();
	sc.scale.set(10.0, 10.0, 10.0);

	for ( var i = 0; i < sides1.length; i ++ ) {

		var side = sides1[ i ];

		var element = document.createElement( 'img' );
		element.width = 1026; // 2 pixels extra to close the gap.
		element.src = side.url;  //this loads the image
		elements.push(element);

		object1 = new THREE.CSS3DObject( element );
		object1.position = side.position;
		object1.rotation = side.rotation;
		scene.add( object1 );
		
	}	

	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	var myPano1 = document.getElementById('pano1');
	myPano1.appendChild( renderer.domElement );

	myPano1.addEventListener( 'mousedown', onDocumentMouseDown, false );

	myPano1.addEventListener( 'touchstart', onDocumentTouchStart, false );
	myPano1.addEventListener( 'touchmove', onDocumentTouchMove, false );
	
	
	for ( var i = 0; i < sides1.length; i ++ ) {

		var side = sides2[ i ];

		var element = document.createElement( 'img' );
		element.width = 1026; // 2 pixels extra to close the gap.
		element.src = side.url;  //this loads the image
		elements.push(element);

		object2 = new THREE.CSS3DObject( element );
		object2.position = side.position;
		object2.rotation = side.rotation;
		scene2.add( object2 );
		
	}	
	
	///////
                
	var mayor = document.createElement( 'img' );
	mayor.width = 450;
	mayor.src = 'resources/images/Wave01.png';
	objectM = new THREE.CSS3DObject( mayor );
	objectM.position = new THREE.Vector3( -500, 0, 0 );
	objectM.rotation = new THREE.Euler( 0, Math.PI / 2, 0 );
	scene2.add( objectM );
	
	///////

	renderer2 = new THREE.CSS3DRenderer();
	renderer2.setSize( window.innerWidth, window.innerHeight );
	var myPano2 = document.getElementById('pano2');
	myPano2.appendChild( renderer2.domElement );

	myPano2.addEventListener( 'mousedown', onDocumentMouseDown, false );

	myPano2.addEventListener( 'touchstart', onDocumentTouchStart, false );
	myPano2.addEventListener( 'touchmove', onDocumentTouchMove, false );

	
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	camera2.aspect = window.innerWidth / window.innerHeight;
	camera2.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer2.setSize( window.innerWidth, window.innerHeight );

}

var myFunctionVar; // used for the setInterval function in scrolling

function onDocumentMouseDown( event ) {
	var centerX = window.innerWidth / 2; 
	var centerY = window.innerHeight / 2;
	var movementX = event.clientX || 0;
	var movementY = event.clientY || 0;

	event.preventDefault();
	var myPano1 = document.getElementById('pano1');
	myPano1.addEventListener( 'mouseup', onDocumentMouseUp, false );
	var myPano2 = document.getElementById('pano2');
	myPano2.addEventListener( 'mouseup', onDocumentMouseUp, false );

	movementX = movementX - centerX;
	movementY = movementY - centerY;
	
	myFunctionVar = setInterval(function() { 
			if (Math.abs(movementX)>100) {
				if (movementX>0) {
					lon += .25;
					}
				else {
					lon -= .5;
					}
			};
			
			if (Math.abs(movementY)>100) {
			if (movementY>0) {
					lat -= 0.12;
					}
				else {
					lat += 0.12;
					}
			}
	}, 10);	
}


function onDocumentMouseUp( event ) {
	clearInterval(myFunctionVar);
	var myPano1 = document.getElementById('pano1');
	myPano1.removeEventListener( 'mouseup', onDocumentMouseUp );
	var myPano2 = document.getElementById('pano2');
	myPano2.removeEventListener( 'mouseup', onDocumentMouseUp );

}

var touchX, touchY; // used for scrolling in touch screen platforms

function onDocumentTouchStart( event ) {

	event.preventDefault();

	var touch = event.touches[ 0 ];
	
	touchX = touch.screenX;
	touchY = touch.screenY;
}

function onDocumentTouchMove( event ) {

	event.preventDefault();

	var touch = event.touches[ 0 ];

	lon -= ( touch.screenX - touchX ) * 0.1;
	lat += ( touch.screenY - touchY ) * 0.1;

	touchX = touch.screenX;
	touchY = touch.screenY;

}

function capture_orientation (event) {
	alpha = event.alpha;
	beta = event.beta;
	gamma = event.gamma;
	// alert('Orientation - Alpha: '+alpha+', Beta: '+beta+', Gamma: '+gamma);
}

function animate() {

	requestAnimationFrame( animate );

	//lon +=  DEGREEINC;
	degreecount += 1;
	
	// lat = Math.max( - 85, Math.min( 85, lat ) );
	// lat += LATINC;
	
	phi = THREE.Math.degToRad( 180 - gamma );
	theta = - THREE.Math.degToRad( alpha + 180 );
	
	// phi = THREE.Math.degToRad( 90 - lat );
	// theta = THREE.Math.degToRad( lon );

	target.x = Math.sin( phi ) * Math.cos( theta );
	target.y = Math.cos( phi );
	target.z = Math.sin( phi ) * Math.sin( theta );

	camera.lookAt( target );
	camera2.lookAt( target );

	renderer.render( scene, camera );
	renderer2.render( scene2, camera2 );

}