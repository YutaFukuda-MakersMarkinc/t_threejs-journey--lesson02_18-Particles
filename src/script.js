import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * パーティクル（ポイントマテリアル）の基本

//1.パーティクルの作成
//1-1 SphereBufferGeometryの作成
//1-1-1 ジオメトリ※ベースになる形
const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32)

//1-1-2 マテリアル※パーティクルの生成
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.02 //※パーティクルの大きさを指定
particlesMaterial.sizeAttenuation = true //※falseにするとパーティクルが小さくなる

//1-2 three.js内の「ポイント」を使用※ジオメトリをパーティクルで作成
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)
 */

//2. パーティクルジオメトリをfor文で繰り返し生成する
const particlesGeometry = new THREE.BufferGeometry()
//const count = 500
const count = 20000

const positions = new Float32Array(count * 3)

//5. ディファレントカラー
//5-1. パーティクルとポジションと同時にカラー値も生成

const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
    )

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
    )


//2-2 マテリアル※パーティクルの生成
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.1 //※パーティクルの大きさを指定
particlesMaterial.sizeAttenuation = true //※falseにするとパーティクルが小さくなる

//2-4 PontMaterialの色を変更
//particlesMaterial.color = new THREE.Color('#ff88cc')

//5-2 ランダムカラーの実装
particlesMaterial.vertexColors = true


//2-5 textureLoaderの読み込み、particlesMaterialにmapでテクスチャを貼り付け
const particleTexture = textureLoader.load("/textures/particles/2.png")
particlesMaterial.map = particleTexture
//particlesMaterial.alphaTest = 0.001

//2-6 パーティクルを透過させる
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture

//2-7 パーティクルの深さ設定(これでも透過可能)
//particlesMaterial.depthTest = false

/**
//3. BoxBufferGeometryを作成
//3-1 BoxBufferGeometryを作成
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshBasicMaterial()
)
*/

//3-2 パーティクルのdepthwriteを無効にする
//ボックスバッファジオメトリにパーティクルが重なる
particlesMaterial.depthWrite = false

//4. ブレンディング
//パーティクル同士が重なった時、合成される
particlesMaterial.blending = THREE.AdditiveBlending

//2-3 three.js内の「ポイント」を使用※ジオメトリをパーティクルで作成
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //6. アニメーションの実装
    //6-1. パーティクルが右方向に回る
    //particles.rotation.y = elapsedTime * 0.2

    //6-2 パーティクルを平面上に並べる
    for(let i = 0; i < count; i++){
        const i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    //6-3 平面に並べたパーティクルが上下する
    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()