import { initShaderFiles } from './utils/shader';
import GLObject3D from './Object3D';
import Renderer3D from './Renderer3D';

let projectionIdx = 0
let objects = []

const resizeCanvas = (gl) => {
  gl.canvas.width = (1 / 2) * window.innerWidth
  gl.canvas.height = window.innerHeight
}

const canvas = document.querySelector('#glCanvas')
const gl = canvas.getContext('webgl2')
const renderer = new Renderer3D(gl)

var shaderProgram;
var shaderProgram3D;
var glObject;
var shadeToggle = true;

const rxSlider = document.getElementById('rotate-rx')
const rySlider = document.getElementById('rotate-rz')
const rzSlider = document.getElementById('rotate-ry')

const sxSlider = document.getElementById('scale-sx')
const sySlider = document.getElementById('scale-sy')
const szSlider = document.getElementById('scale-sz')

const txSlider = document.getElementById('translate-tx')
const tySlider = document.getElementById('translate-ty')
const tzSlider = document.getElementById('translate-tz')

const projectionSelector = document.getElementById('projection-selector')

const cameraRotate = document.getElementById('rotate-camera')
const cameraRadius = document.getElementById('radius-camera')
const cameraFOV = document.getElementById('camera-fov')

let shadingRadio = document.getElementsByName('shade');
for (var i = 0; i < shadingRadio.length; i++) {
  shadingRadio[i].addEventListener('change', function (e) {
    if (e.target.id== "on") {
      shadeToggle = true
      glObject.shadeToggle = true
    } else{
      shadeToggle = false
      glObject.shadeToggle = false
    }
  })
}

function get_cube_coordinates(){
  let bblock = [
      [0, 0, 0],
      [0.1, 0.1, 0],
      [0.1, 0.9, 0],
      [0, 1, 0],

      [0, 0, 0],
      [0, 0.1, 0.1],
      [0, 0.9, 0.1],
      [0, 1, 0],

      [0.1, 0.1, 0],
      [0.1, 0.1, 0.1],
      [0.1, 0.9, 0.1],
      [0.1, 0.9, 0],

      [0, 0.1, 0.1],
      [0.1, 0.1, 0.1],
      [0.1, 0.9, 0.1],
      [0, 0.9, 0.1],
  ];
  let temp = JSON.parse(JSON.stringify(bblock))
  for (let i=0;i<temp.length;i++){
      temp[i][0] -= 2 * (temp[i][0] - 0.5)
  }
  bblock = bblock.concat(temp)

  temp = JSON.parse(JSON.stringify(bblock))
  for (let i=0;i<temp.length;i++){
      temp[i][2] -= 2 * (temp[i][2] - 0.5)
  }
  bblock = bblock.concat(temp)

  temp = JSON.parse(JSON.stringify(bblock))
  for (let i=0;i<temp.length;i++){
      temp[i][0] = temp[i][0] - 0.5
      temp[i][1] = temp[i][1] - 0.5
      let cur = temp[i][0]
      temp[i][0] = -temp[i][1] + 0.5
      temp[i][1] = cur + 0.5
  }
  let temp2 = JSON.parse(JSON.stringify(bblock));
  for (let i=0;i<temp2.length;i++){
      temp2[i][1] = temp2[i][1] - 0.5;
      temp2[i][2] = temp2[i][2] - 0.5;
      let cur = temp2[i][1];
      temp2[i][1] = -temp2[i][2] + 0.5;
      temp2[i][2] = cur + 0.5;
  }
  bblock = bblock.concat(temp);
  bblock = bblock.concat(temp2);
  
  return bblock
}

let updateTransform = () => {
  glObject.setTransform(
      parseFloat(txSlider.value), parseFloat(tySlider.value), -parseFloat(tzSlider.value),
      parseFloat(rxSlider.value), parseFloat(rySlider.value), parseFloat(rzSlider.value),
      parseFloat(sxSlider.value), parseFloat(sySlider.value), parseFloat(szSlider.value))
}
window.onload = function() {

  
  async function main() {
    shaderProgram3D = await initShaderFiles(gl, 'vert3d.glsl', 'frag.glsl')
    glObject = new GLObject3D(shaderProgram3D, gl);
    if (gl === null) {
      alert(
        'Unable to initialize WebGL. Your browser or machine may not support it.'
      )
      return
    }
    resizeCanvas(gl)
    window.addEventListener('resize', () => resizeCanvas(gl), false)

  
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    const renderer = new Renderer3D(gl)
    renderer.orthoSize = [2, 2, 200];
    renderer.camPosition = [0, 0, 0];
  
    let cube_coor = get_cube_coordinates()
    let cube_topo = []
    let cube_color = []
    for (let i=0;i<cube_coor.length;i+=4){
        let temp = []
        for (let pl=0;pl<4;pl++){
            temp.push(i + pl)
        }
        cube_topo.push(temp);
        cube_color.push([1, 0, 0, 1])
    }

    glObject.setPoints(cube_coor)
    glObject.setTopology(cube_topo, cube_color)

    glObject.generateNormalsFromTopology()

    updateTransform()
    renderer.addObject(glObject);
  
    function render() {
        gl.clearColor(1,1,1,1)
        gl.clear(gl.COLOR_BUFFER_BIT)
  
        renderer.render();
        requestAnimationFrame(render)
    }
  
    requestAnimationFrame(render)

    txSlider.oninput = updateTransform
    tySlider.oninput = updateTransform
    tzSlider.oninput = updateTransform
    rxSlider.oninput = updateTransform
    rySlider.oninput = updateTransform
    rzSlider.oninput = updateTransform
    sxSlider.oninput = updateTransform
    sySlider.oninput = updateTransform
    szSlider.oninput = updateTransform

    projectionSelector.onchange = function() {
      renderer.projection = parseInt(projectionSelector.value);
      renderer.camFOV = parseInt(cameraFOV.value); 
      if (renderer.projection == 1){
        cameraRadius.value = 0;
        renderer.camPosition = 0;
      }
      else if (renderer.projection == 2){
        cameraRadius.value = 2;
        renderer.camPosition = 2;
      }
    }

    cameraRotate.oninput = function (){
      renderer.camRotation = parseInt(cameraRotate.value); 
    }
    cameraRadius.oninput = function (){
      renderer.camPosition = parseInt(cameraRadius.value); 
    }
    cameraFOV.oninput = function (){
      renderer.camFOV = parseInt(cameraFOV.value); 
    }

  }

  main()

  let projectionSelector = document.getElementById('projection-selector')
  projectionSelector.addEventListener('change', (e) => {
    projectionIdx = e.target.value
    console.log(`Selected projection: ${projectionIdx}`)
  })


  let loadButton = document.getElementById('load')
  loadButton.addEventListener('change', loadFile)

  let defaultButton = document.getElementById('default-btn')
  defaultButton.addEventListener('click', () => {
    //  SET ALL INPUT TO DEFAULT
      rxSlider.value = 0
      rySlider.value = 0
      rzSlider.value = 0
      txSlider.value = 0
      tySlider.value = 0
      tzSlider.value = 0
      sxSlider.value = 1
      sySlider.value = 1
      szSlider.value = 1
      cameraRotate.value = 0
      if (renderer.projection == 1){
        cameraRadius.value = 0;
        renderer.camPosition = 0;
      }
      else {
        cameraRadius.value = 2;
        renderer.camPosition = 2;
      }
      cameraFOV.value = 70
    // SET CAMERA
      renderer.camFOV = 70;
      renderer.orthoSize = [2, 2, 2];
      // renderer.camPosition = [0, 0, 0];
      renderer.camRotation = 0;
      glObject.setTransform(
        parseFloat(0), parseFloat(0), -parseFloat(0),
        parseFloat(0), parseFloat(0), parseFloat(0),
        parseFloat(1), parseFloat(1), parseFloat(1))
  })

  
}



//Help button
var modal = document.getElementById('modal')
var btn = document.getElementById('help-btn')
var span = document.getElementsByClassName('close')[0]
btn.onclick = function () {
  modal.style.display = 'block'
}
span.onclick = function () {
  modal.style.display = 'none'
}



// Load File
const loadFile = () => {
  var reader = new FileReader();
  reader.addEventListener('load', function() {
    var content = this.result
    var hollow = JSON.parse(content);
    console.log(hollow)
    glObject.setPoints(hollow.coor);
    glObject.setTopology(hollow.topo, hollow.color);
  });
  reader.readAsText(document.getElementById('load').files[0]);
}
