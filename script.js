const canvas = document.querySelector('#glCanvas')
const gl = canvas.getContext('webgl')

let bufferId = gl.createBuffer() // point/vertex buffer
let cBufferId = gl.createBuffer() // color buffer

const MAX_NUM_VERTICES = 20000
const CLOSEST_POINT_THRESHOLD = 0.02

let projectionIdx = 0

const resizeCanvas = (gl) => {
  gl.canvas.width = (6 / 12) * window.innerWidth
  gl.canvas.height = (12 / 12) * window.innerWidth
}

function Maximum2Value(A, B) {
  if (Math.abs(A) > Math.abs(B)) {
    return A
  } else {
    return B
  }
}


window.onload = function main() {
  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      'Unable to initialize WebGL. Your browser or machine may not support it.'
    )
    return
  }
  resizeCanvas(gl)
  window.addEventListener('resize', () => resizeCanvas(gl), false)


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


  // Set canvas context
  gl.viewport(0, 0, canvas.width, canvas.height) // set viewport
  gl.clearColor(0.6, 0.75, 0.9, 1) // background color
  gl.clear(gl.COLOR_BUFFER_BIT) // remove old drawing

  // Initialize shaders
  let program = initShaders(gl)
  gl.useProgram(program)

  // Initialize position and color buffers. Buffers move vertex and other data to the GPU.
  // gl.bindBuffer   : sets that buffer as the buffer to be worked on
  // gl.bufferData   : copies data into the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
  gl.bufferData(gl.ARRAY_BUFFER, 8 * MAX_NUM_VERTICES, gl.STATIC_DRAW)
  let vPos = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPos)

  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId)
  gl.bufferData(gl.ARRAY_BUFFER, 16 * MAX_NUM_VERTICES, gl.STATIC_DRAW)
  let vColor = gl.getAttribLocation(program, 'vColor')
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vColor)
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT)

  // START: Draw line
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(linePoints))
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId)
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(lineColors))


}

function initShaders(gl) {
  // Vertex shader program
  let vertElmt = document.getElementById('vertex-shader')
  let vertShdr = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertShdr, vertElmt.text)
  gl.compileShader(vertShdr)

  // Fragment shader program
  let fragElmt = document.getElementById('fragment-shader')
  let fragShdr = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragShdr, fragElmt.text)
  gl.compileShader(fragShdr)

  // Attach shader to program and link program to WebGL
  let program = gl.createProgram()
  gl.attachShader(program, vertShdr)
  gl.attachShader(program, fragShdr)
  gl.linkProgram(program)

  return program
}

function flatten(v) {
  // Create a flat (1D) Float32Array from list of vertices/colors
  let flatArr

  if (Array.isArray(v[0])) {
    flatArr = new Float32Array(v.length * v[0].length)
    let idxFlatArr = 0

    for (let i = 0; i < v.length; i++) {
      for (let j = 0; j < v[i].length; j++) {
        flatArr[idxFlatArr] = v[i][j]
        idxFlatArr += 1
      }
    }
  } else {
    flatArr = new Float32Array(v.length)
    for (let i = 0; i < v.length; i++) {
      flatArr[i] = v[i]
    }
  }

  return flatArr
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
