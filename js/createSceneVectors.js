/* global THREE, addXYZValues, calculateNormal */

const vertices = 25;
const landscapeVar = 0.5;
const landscapeVarAdj = landscapeVar / 2;
//const offset = Math.sqrt(squares) / 2;

function addColors(vector) {
  if (vector.y > 10) {
    return new THREE.Vector3(0.8, 0.8, 0.8);
  } else if (vector.y > 5) {
    return new THREE.Vector3(0.54, 0.27, 0.074);
  }
  return new THREE.Vector3(0.1, 0.8, 0.1);
}

function diamondThisArray(array) {
  if (array[0][0].indexOf(null) === -1) {
    return array;
  }
  const outputArray = array;
  const stackTopArray = outputArray[0];
  outputArray.shift();
  const max = stackTopArray.length - 1;
  const mid = max / 2;
  let variation = Math.random() * landscapeVar - landscapeVarAdj;
  stackTopArray[0][mid] = (stackTopArray[0][0] + stackTopArray[0][max]) / 2 + variation;
  variation = Math.random() * landscapeVar - landscapeVarAdj;
  stackTopArray[mid][0] = (stackTopArray[0][0] + stackTopArray[max][0]) / 2 + variation;
  variation = Math.random() * landscapeVar - landscapeVarAdj;
  stackTopArray[max][mid] = (stackTopArray[max][0] + stackTopArray[max][max]) / 2 + variation;
  variation = Math.random() * landscapeVar - landscapeVarAdj;
  stackTopArray[mid][max] = (stackTopArray[0][max] + stackTopArray[max][max]) / 2 + variation;
  variation = Math.random() * landscapeVar - landscapeVarAdj;
  stackTopArray[mid][mid] = (stackTopArray[0][0] + stackTopArray[0][max] +
  stackTopArray[max][0] + stackTopArray[max][max]) / 4 + variation;

  if (stackTopArray.length > 2) {
    const array1 = [];
    for (let i = 0; i <= mid; i++) {
      array1.push(stackTopArray[i].slice(0, mid + 1));
    }
    const array2 = [];
    for (let i = 0; i <= mid; i++) {
      array2.push(stackTopArray[i].slice(mid, max + 1));
    }
    const array3 = [];
    for (let i = mid; i <= max; i++) {
      array3.push(stackTopArray[i].slice(0, mid + 1));
    }
    const array4 = [];
    for (let i = mid; i <= max; i++) {
      array4.push(stackTopArray[i].slice(mid, max + 1));
    }
    outputArray.push(array1, array2, array3, array4);
  } else {
    outputArray.push(stackTopArray);
  }
  return diamondThisArray(outputArray);
}

function reconstruct(array) {
  console.log(array)
  if (array.length === 1) {
    return array;
  }
  const stackTopArray = array[0].concat(array[1].concat(array[2].concat(array[3])));
  const heightArray = array;
  heightArray.shift();
  heightArray.shift();
  heightArray.shift();
  heightArray.shift();
  heightArray.push(stackTopArray);
  return reconstruct(heightArray);
}

function calculatePositions() {
  const positionsFull = [];
  const initialPositions = [];
  for (let i = 0; i < Math.sqrt(vertices); i++) {
    const row = [];
    for (let j = 0; j < Math.sqrt(vertices); j++) {
      row.push(null);
    }
    initialPositions.push(row);
  }

  initialPositions[0][0] = 1;
  initialPositions[0][Math.sqrt(vertices) - 1] = 1;
  initialPositions[Math.sqrt(vertices) - 1][0] = 1;
  initialPositions[Math.sqrt(vertices) - 1][Math.sqrt(vertices) - 1] = 1;
  positionsFull.push(initialPositions);
  const heights = diamondThisArray(positionsFull);
  const heightMap = reconstruct(heights);
  // console.log(heightMap);
  // for (let j = 0, len = squares / Math.sqrt(squares); j < len; j++) {
  //   for (let i = 0; i < len; i++) {
  //     const v1 = new THREE.Vector3(i - offset, Math.random() < 0.0002 ? 20 : 0, j - offset);
  //     const v2 = new THREE.Vector3(i + 1 - offset, 0, j - offset);
  //     const v3 = new THREE.Vector3(i - offset, 0, j + 1 - offset);
  //     const v4 = new THREE.Vector3(i + 1 - offset, 0, j + 1 - offset);
  //     addXYZValues(positions, v1);
  //     addXYZValues(positions, v2);
  //     addXYZValues(positions, v3);
  //     addXYZValues(positions, v2);
  //     addXYZValues(positions, v3);
  //     addXYZValues(positions, v4);
  //   }
  // }
  return initialPositions;
}

calculatePositions();

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
