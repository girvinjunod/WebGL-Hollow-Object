import { initShaderFiles } from './utils/shader';
import GLObject from './modules/GLObject';
import Renderer from './modules/Renderer';

let projectionIdx = 0

const resizeCanvas = (gl) => {
  gl.canvas.width = (1 / 2) * window.innerWidth
  gl.canvas.height = window.innerHeight
}


const canvas = document.querySelector('#glCanvas')
const gl = canvas.getContext('webgl2')
const renderer = new Renderer(gl)

let shaderProgram
let glObject

const rxSlider = document.getElementById('rotate-rx')
const rySlider = document.getElementById('rotate-rz')
const rzSlider = document.getElementById('rotate-ry')

const sxSlider = document.getElementById('scale-sx')
const sySlider = document.getElementById('scale-sy')
const szSlider = document.getElementById('scale-sz')

const txSlider = document.getElementById('translate-tx')
const tySlider = document.getElementById('translate-ty')
const tzSlider = document.getElementById('translate-tz')

const ambientSlider = document.getElementById('amb-light')

const projectionSelector = document.getElementById('projection-selector')

const cameraRotate = document.getElementById('rotate-camera')
const cameraRadius = document.getElementById('radius-camera')

let loadButton = document.getElementById('load')
let defaultButton = document.getElementById('default-btn')

let shadingRadio = document.getElementsByName('shade');
for (var i = 0; i < shadingRadio.length; i++) {
  shadingRadio[i].addEventListener('change', function (e) {
    if (e.target.id== "on") {
      // shadeToggle = true
      glObject.shadeToggle = true
    } else{
      // shadeToggle = false
      glObject.shadeToggle = false
    }
  })
}

let updateTransform = () => {
  glObject.setTransform(
      parseFloat(txSlider.value), parseFloat(tySlider.value), -parseFloat(tzSlider.value),
      parseFloat(rxSlider.value), parseFloat(rySlider.value), parseFloat(rzSlider.value),
      parseFloat(sxSlider.value), parseFloat(sySlider.value), parseFloat(szSlider.value))
}
window.onload = function() {

  
  async function main() {
    shaderProgram = await initShaderFiles(gl, 'vertexShader.glsl', 'fragmentShader.glsl')
    glObject = new GLObject(shaderProgram, gl);
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
  
    const renderer = new Renderer(gl)
    renderer.orthoSize = [2, 2, 2];
    renderer.camPosition = [0, 0, 0];

    await fetch('./hollow-objs/hypercube.json').then(response => {
      return response.json();
    }).then(data => {
        glObject.setPoints(data.coor)

        // glObject.setTopology(data.topo, data.color)
        // glObject.generateNormalsFromTopology()

        glObject.setNormalData(data.vn);
        glObject.setTopology(data.topo, data.color, data.vn_idx);
    }).catch(err => {
      console.log(err)
    });


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

    ambientSlider.oninput = () => {
      renderer._Ka = ambientSlider.value
    }

    projectionSelector.onchange = function() {
      renderer.projection = parseInt(projectionSelector.value);
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

  }

  main()

  projectionSelector.addEventListener('change', (e) => {
    projectionIdx = e.target.value
    console.log(`Selected projection: ${projectionIdx}`)
  })


  
  loadButton.addEventListener('change', loadFile)

 
  defaultButton.addEventListener('click', () => {
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
        renderer.camPosition = 0
      }
      else {
        cameraRadius.value = 2;
        renderer.camPosition = 2;
      }
      renderer.orthoSize = [2, 2, 2]
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
    glObject.setPoints(hollow.coor);
    if (hollow.vn !== undefined){
      glObject.setNormalData(hollow.vn);
    } 
      
    if (hollow.vn_idx === undefined) {
      glObject.setTopology(hollow.topo, hollow.color);
  } else {
      glObject.setTopology(hollow.topo, hollow.color, hollow.vn_idx);
  }
    // glObject.setTopology(hollow.topo, hollow.color);
  });
  reader.readAsText(document.getElementById('load').files[0]);
}
