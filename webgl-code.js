var canvas;
var gl;

var posAttribute;
var timeUniform;
var aspectUniform;

var prog;
var vertexBuffer;

var time;
var aspect;

const framerate = 60.0;

function getShader(id, type) {
	var shader = gl.createShader(type);

	var shaderScript = document.getElementById(id);
	gl.shaderSource(shader, shaderScript.innerHTML);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		alert(gl.getShaderInfoLog(shader));

	return shader;
}

function setupShaders() {
	var vsh = getShader("vsh", gl.VERTEX_SHADER);
	var fsh = getShader("fsh", gl.FRAGMENT_SHADER);

	prog = gl.createProgram();
	gl.attachShader(prog, vsh);
	gl.attachShader(prog, fsh);
	gl.linkProgram(prog);

	if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
		alert("Cannot link program");

	gl.useProgram(prog);

	posAttribute = gl.getAttribLocation(prog, "pos");
	gl.enableVertexAttribArray(posAttribute);

	timeUniform = gl.getUniformLocation(prog, "time");
	aspectUniform = gl.getUniformLocation(prog, "aspect")
}

function setupBuffers() {
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	var vertices = [
		-1, -1,  0,
		-1,  1,  0,
		 1, -1,  0,
		 1, -1,  0,
		 1,  1,  0,
		-1,  1,  0,
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function draw() {
	time += 1 / framerate;
	aspect = canvas.clientWidth / canvas.clientHeight;

	gl.uniform1f(timeUniform, time);
	gl.uniform1f(aspectUniform, aspect);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(posAttribute, 3, gl.FLOAT, false, 3 * 4, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function setupWebGL() {
	canvas = document.getElementById("bg-live");

	canvas.width = canvas.clientWidth / 8;
	canvas.height = canvas.clientHeight / 8;

	try {
		gl = canvas.getContext("webgl");
	} catch (e) {}

	if(!gl)alert("Cannot initialize WebGL");

	setupShaders();
	setupBuffers();
	time = 0;

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	setInterval(draw, 1000 / framerate);
}