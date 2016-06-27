/* global THREE, addXYZValues, calculateNormal */

const squares = 10000;
const offset = Math.sqrt(squares) / 2;

function addColors(vector) {
  if (vector.y > 10) {
    return new THREE.Vector3(0.8, 0.8, 0.8);
  } else if (vector.y > 5) {
    return new THREE.Vector3(0.54, 0.27, 0.074);
  }
  return new THREE.Vector3(0.1, 0.8, 0.1);
}

function calculatePositions() {
  const positions = [];
  for (let j = 0, len = squares / Math.sqrt(squares); j < len; j++) {
    for (let i = 0; i < len; i++) {
      const v1 = new THREE.Vector3(i - offset, Math.random() < 0.0002 ? 20 : 0, j - offset);
      const v2 = new THREE.Vector3(i + 1 - offset, 0, j - offset);
      const v3 = new THREE.Vector3(i - offset, 0, j + 1 - offset);
      const v4 = new THREE.Vector3(i + 1 - offset, 0, j + 1 - offset);
      addXYZValues(positions, v1);
      addXYZValues(positions, v2);
      addXYZValues(positions, v3);
      addXYZValues(positions, v2);
      addXYZValues(positions, v3);
      addXYZValues(positions, v4);
    }
  }
  return positions;
}

function calculateNormals(positions) {
  const normals = [];
  for (let i = 0; i < positions.length; i += 18) {
    const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
    const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
    const v4 = new THREE.Vector3(positions[i + 15], positions[i + 16], positions[i + 17]);

    const triangle1Normal = calculateNormal(v1, v2, v3);
    const triangle2Normal = calculateNormal(v2, v3, v4);

    addXYZValues(normals, triangle1Normal);
    addXYZValues(normals, triangle1Normal);
    addXYZValues(normals, triangle1Normal);
    addXYZValues(normals, triangle2Normal);
    addXYZValues(normals, triangle2Normal);
    addXYZValues(normals, triangle2Normal);
  }
  return normals;
}

function calculateColors(positions) {
  const colors = [];
  for (let i = 0; i < positions.length; i += 18) {
    const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
    const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
    const v4 = new THREE.Vector3(positions[i + 9], positions[i + 10], positions[i + 11]);
    addXYZValues(colors, addColors(v1));
    addXYZValues(colors, addColors(v2));
    addXYZValues(colors, addColors(v3));
    addXYZValues(colors, addColors(v2));
    addXYZValues(colors, addColors(v3));
    addXYZValues(colors, addColors(v4));
  }
  return colors;
}

window.calculatePositions = calculatePositions;
window.calculateNormals = calculateNormals;
window.calculateColors = calculateColors;
