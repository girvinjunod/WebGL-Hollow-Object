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

const rxSlider = document.getElementById('rotate-rx')
const rySlider = document.getElementById('rotate-rz')
const rzSlider = document.getElementById('rotate-ry')

const sxSlider = document.getElementById('scale-sx')
const sySlider = document.getElementById('scale-sy')
const szSlider = document.getElementById('scale-sz')

const txSlider = document.getElementById('translate-tx')
const tySlider = document.getElementById('translate-ty')
const tzSlider = document.getElementById('translate-tz')



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
    const shaderProgram = await initShaderFiles(gl, 'vert2d.glsl', 'frag.glsl')
    const shaderProgram3D = await initShaderFiles(gl, 'vert3d.glsl', 'frag.glsl')
  
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    const renderer = new Renderer3D()
    renderer.orthoSize = [2, 2, 2];
    renderer.camPosition = [0, 0, 0];
  
    const glObject = new GLObject3D(shaderProgram3D, gl);
    // glObject.setPoints([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]]);
    // glObject.setColorArray([[1.0, 0.0, 0.0, 1.0]]);
    // glObject.setTopology([[0, 1, 2, 3]], [[1.0, 0.0, 0.0, 1.0]]);
    let cube_coor = get_cube_coordinates()
    let cube_topo = []
    let cube_color = []
    for (let i=0;i<cube_coor.length;i+=4){
        let temp = []
        for (let pl=0;pl<4;pl++){
            temp.push(i + pl)
        }
        cube_topo.push(temp);
        cube_color.push([0, 0, 0, 1])
    }

    glObject.setPoints(cube_coor)
    glObject.setTopology(cube_topo, cube_color)

    // glObject.setTransform(0, 0, 0, 0, 0, 0, 1, 1, 1)
    glObject.setTransform(0, 0, 0, parseInt(rxSlider.value), parseInt(rySlider.value), parseInt(rzSlider.value), 1, 1, 1)
    renderer.addObject(glObject);
  
    function render() {
        gl.clearColor(1,1,1,1)
        gl.clear(gl.COLOR_BUFFER_BIT)
  
        renderer.render();
        requestAnimationFrame(render)
    }
  
    requestAnimationFrame(render)
    let updateTransform = () => {
      glObject.setTransform(
          parseFloat(txSlider.value), parseFloat(tySlider.value), -parseFloat(tzSlider.value),
          parseFloat(rxSlider.value), parseFloat(rySlider.value), parseFloat(rzSlider.value),
          parseFloat(sxSlider.value), parseFloat(sySlider.value), parseFloat(szSlider.value))
    }

    txSlider.oninput = updateTransform
    tySlider.oninput = updateTransform
    tzSlider.oninput = updateTransform
    rxSlider.oninput = updateTransform
    rySlider.oninput = updateTransform
    rzSlider.oninput = updateTransform
    sxSlider.oninput = updateTransform
    sySlider.oninput = updateTransform
    szSlider.oninput = updateTransform


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
