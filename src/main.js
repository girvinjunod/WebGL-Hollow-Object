import { initShaderFiles } from './utils/shader';
import GLObject3D from './Object3D';
import Renderer3D from './Renderer3D';


const colors = [
  [ 0.0, 0.0, 0.0, 1.0 ],  // black
  [ 1.0, 0.0, 0.0, 1.0 ],  // red
  [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
  [ 0.0, 1.0, 0.0, 1.0 ],  // green
  [ 0.0, 0.0, 1.0, 1.0 ],  // blue
  [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
  [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
];

const Tool = {
  "DRAW" : 0,
  "MOVE" : 1
}

const Shape = {
  "LINE" : 0,
  "SQUARE" : 1,
  "POLYGON" : 2
}

let projectionIdx = 0
let objects = []

const resizeCanvas = (gl) => {
  gl.canvas.width = (6 / 12) * window.innerWidth
  gl.canvas.height = (12 / 12) * window.innerWidth
}

const canvas = document.querySelector('#glCanvas')
const gl = canvas.getContext('webgl2')

window.onload = function() {
  async function main() {
    if (gl === null) {
      alert(
        'Unable to initialize WebGL. Your browser or machine may not support it.'
      )
      return
    }
    resizeCanvas(gl)
    window.addEventListener('resize', () => resizeCanvas(gl), false)
    const triangleData = [200.0, 200.0, 400.0, 200.0, 200.0, 400.0]
    const shaderProgram = await initShaderFiles(gl, 'vert2d.glsl', 'frag.glsl')
    const shaderProgram3D = await initShaderFiles(gl, 'vert3d.glsl', 'frag.glsl')
  
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
  
    const renderer = new Renderer3D()
    renderer.orthoSize = [2, 2, 2];
    renderer.camPosition = [0, 0, 0];
  
    const glObject = new GLObject3D(0, shaderProgram3D, gl);
    glObject.setPoints([0, 0, 0, 1, 0, 0, 0, 1, 0]);
    glObject.setColorArray([1.0, 0.0, 0.0, 1.0]);
    glObject.setTransform(0, 0, 0, 0, 0, 0, 1, 1, 1);
    glObject.buildGeometry();
    renderer.addObject(glObject);
  
    function render(now) {
        gl.clearColor(1,1,1,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
  
        renderer.render();
        requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
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
    //reset to default
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
const loadFile = (e) => {
  const file = e.target.files[0]
  var reader = new FileReader()
  reader.addEventListener('load', function (e) {
    //do something
  })
  reader.readAsBinaryString(file)
}
