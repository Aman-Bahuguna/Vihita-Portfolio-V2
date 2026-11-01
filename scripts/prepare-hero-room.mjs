// Usage: node scripts/prepare-hero-room.mjs /path/to/extracted-attachment
// Offline-only dependency: Python 3 with Pillow. No conversion runs in the browser.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Box3, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, Texture, TextureLoader, Vector3 } from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const source = process.argv[2];
if (!source) throw new Error('Provide the extracted attachment directory.');
const output = resolve('public/models/tiny-room');
mkdirSync(output, { recursive: true });

execFileSync('python', ['-c', `
import sys
from pathlib import Path
from PIL import Image
source, output = Path(sys.argv[1]) / 'textures', Path(sys.argv[2])
def image(name, size, mode='RGB'):
    return Image.open(source / name).convert(mode).resize((size, size), Image.Resampling.LANCZOS)
for kind in ['room', 'equipment']:
    diffuse = image(kind + '_material_diffuse.jpg', 1024, 'RGBA')
    if kind == 'equipment':
        diffuse.putalpha(image('equipment_material_opacity.jpg', 1024, 'L'))
    diffuse.save(output / (kind + '-color.webp'), quality=86, method=6)
    image(kind + '_material_normal.jpg', 512).save(output / (kind + '-normal.webp'), quality=90, method=6)
    ao = image(kind + '_material_occlusion.jpg', 512, 'L')
    rough = image(kind + '_material_roughness.jpg', 512, 'L')
    metal = image('equipment_material_metalic.jpg', 512, 'L') if kind == 'equipment' else Image.new('L', (512,512), 0)
    Image.merge('RGB', (ao, rough, metal)).save(output / (kind + '-orm.webp'), quality=90, method=6)
ray = image('ray_material_diffuse.jpg', 256, 'RGBA')
ray.putalpha(image('ray_material_opacity.jpg', 256, 'L'))
ray.save(output / 'ray-color.webp', quality=85, method=6)
`, source, output], { stdio: 'inherit' });

// The FBX's material links are incomplete; attach the supplied PBR atlases explicitly.
TextureLoader.prototype.load = () => new Texture();
const file = readFileSync(resolve(source, 'source/isometric_room_lowpoly.fbx'));
const fbx = new FBXLoader().parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength), '');
fbx.updateMatrixWorld(true);
const bounds = new Box3().setFromObject(fbx);
const center = bounds.getCenter(new Vector3());
const scale = 6 / Math.max(...bounds.getSize(new Vector3()).toArray());
const batches = new Map();
fbx.traverse((object) => {
  if (!object.isMesh) return;
  const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
  geometry.translate(-center.x, -center.y, -center.z).scale(scale, scale, scale);
  for (const name of Object.keys(geometry.attributes)) {
    if (!['position', 'normal', 'uv'].includes(name)) geometry.deleteAttribute(name);
  }
  // glTF uses top-left texture coordinates, unlike FBX/Three's default texture upload.
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
  const name = object.material.name.replace('_material', '');
  if (!batches.has(name)) batches.set(name, []);
  batches.get(name).push(geometry);
});
const scene = new Group();
scene.name = 'Supplied tiny isometric room';
for (const [name, geometries] of batches) {
  const geometry = mergeVertices(mergeGeometries(geometries), 0.00001);
  const material = name === 'ray'
    ? new MeshBasicMaterial({ transparent: true, depthWrite: false })
    : new MeshStandardMaterial({ roughness: 1, metalness: 1 });
  material.name = name;
  const mesh = new Mesh(geometry, material);
  mesh.name = name;
  scene.add(mesh);
}
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => { this.result = result; this.onloadend?.(); });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = `data:${blob.type};base64,${Buffer.from(result).toString('base64')}`;
      this.onloadend?.();
    });
  }
};
const gltf = await new GLTFExporter().parseAsync(scene);
let binary = Buffer.from(gltf.buffers[0].uri.split(',')[1], 'base64');
const addBytes = (bytes) => {
  const offset = Math.ceil(binary.length / 4) * 4;
  binary = Buffer.concat([binary, Buffer.alloc(offset - binary.length), bytes]);
  const index = gltf.bufferViews.length;
  gltf.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length });
  return index;
};
gltf.images = [];
gltf.textures = [];
gltf.samplers = [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }];
gltf.extensionsUsed = [...new Set([...(gltf.extensionsUsed || []), 'EXT_texture_webp'])];
gltf.extensionsRequired = ['EXT_texture_webp'];
const texture = (name) => {
  const bytes = readFileSync(resolve(output, `${name}.webp`));
  const image = gltf.images.length;
  gltf.images.push({ bufferView: addBytes(bytes), mimeType: 'image/webp', name });
  const index = gltf.textures.length;
  gltf.textures.push({ sampler: 0, extensions: { EXT_texture_webp: { source: image } } });
  return { index };
};
for (const material of gltf.materials) {
  const pbr = material.pbrMetallicRoughness;
  pbr.baseColorTexture = texture(`${material.name}-color`);
  if (material.name === 'ray') {
    material.alphaMode = 'BLEND';
    material.doubleSided = true;
  } else {
    const orm = texture(`${material.name}-orm`);
    pbr.metallicRoughnessTexture = orm;
    material.occlusionTexture = { ...orm, strength: 0.65 };
    material.normalTexture = { ...texture(`${material.name}-normal`), scale: 0.55 };
    if (material.name === 'equipment') {
      material.alphaMode = 'MASK';
      material.alphaCutoff = 0.45;
      material.doubleSided = true;
    }
  }
}
delete gltf.buffers[0].uri;
gltf.buffers[0].byteLength = binary.length;
gltf.asset.generator = 'Three.js GLTFExporter; optimized supplied tiny-isometric-room FBX';
const json = Buffer.from(JSON.stringify(gltf));
const paddedJson = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]);
const paddedBinary = Buffer.concat([binary, Buffer.alloc((4 - binary.length % 4) % 4)]);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + paddedJson.length + 8 + paddedBinary.length, 8);
const chunkHeader = (length, type) => {
  const result = Buffer.alloc(8);
  result.writeUInt32LE(length, 0);
  result.writeUInt32LE(type, 4);
  return result;
};
writeFileSync(resolve(output, 'room.glb'), Buffer.concat([
  header, chunkHeader(paddedJson.length, 0x4e4f534a), paddedJson,
  chunkHeader(paddedBinary.length, 0x004e4942), paddedBinary,
]));
for (const image of gltf.images) unlinkSync(resolve(output, `${image.name}.webp`));
console.log(`Created ${output}/room.glb: ${(header.readUInt32LE(8) / 1024).toFixed(0)} KiB, ${scene.children.length} mesh batches.`);
