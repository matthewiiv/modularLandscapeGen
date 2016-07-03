/* global THREE, addXYZValues, calculateNormal */

const vertices = 4225;
const squares = 4096;
// Number between 1 & infinity
const smoothingFactor = 3;

// const landscapeVar = 0.5;
// const landscapeVarAdj = landscapeVar / 2;
const offset = Math.sqrt(squares) / 2;

function addColors(vector) {
  if (vector.y > 9) {
    return new THREE.Vector3(0.8, 0.8, 0.8);
  } else if (vector.y > 6) {
    return new THREE.Vector3(0.4, 0.4, 0.4);
  } else if (vector.y > 3) {
    return new THREE.Vector3(0.54, 0.27, 0.074);
  }
  return new THREE.Vector3(0.1, 0.8, 0.1);
}

function diamondThisArray(array, indexArray) {
  if (array[array.length - 1].indexOf(null) === - 1) {
    return array;
  }
  const firstStackArray = indexArray[0];
  const yArray = array;
  const nextIndexArray = indexArray;
  nextIndexArray.shift();
  const max = firstStackArray.length - 1;
  const mid = max / 2;
  const xref1 = firstStackArray[0][0][0];
  const zref1 = firstStackArray[0][0][1];
  const xref2 = firstStackArray[0][max][0];
  const zref2 = firstStackArray[0][max][1];
  const xref3 = firstStackArray[max][0][0];
  const zref3 = firstStackArray[max][0][1];
  const xref4 = firstStackArray[max][max][0];
  const zref4 = firstStackArray[max][max][1];

  const xChange1 = firstStackArray[0][mid][0];
  const zChange1 = firstStackArray[0][mid][1];
  const xChange2 = firstStackArray[mid][0][0];
  const zChange2 = firstStackArray[mid][0][1];
  const xChange3 = firstStackArray[mid][max][0];
  const zChange3 = firstStackArray[mid][max][1];
  const xChange4 = firstStackArray[max][mid][0];
  const zChange4 = firstStackArray[max][mid][1];
  const xChange5 = firstStackArray[mid][mid][0];

  let variation = 0;
  if (yArray[xChange1][zChange1] === null) {
    variation = (Math.random() - 0.5) * (firstStackArray.length / smoothingFactor);
    yArray[xChange1][zChange1] = (yArray[xref1][zref1] + yArray[xref2][zref2]) / 2 + variation;
  }
  const zChange5 = firstStackArray[mid][mid][1];
  if (yArray[xChange2][zChange2] === null) {
    variation = (Math.random() - 0.5) * (firstStackArray.length / smoothingFactor);
    yArray[xChange2][zChange2] = (yArray[xref1][zref1] + yArray[xref3][zref3]) / 2 + variation;
  }
  if (yArray[xChange3][zChange3] === null) {
    variation = (Math.random() - 0.5) * (firstStackArray.length / smoothingFactor);
    yArray[xChange3][zChange3] = (yArray[xref2][zref2] + yArray[xref4][zref4]) / 2 + variation;
  }
  if (yArray[xChange4][zChange4] === null) {
    variation = (Math.random() - 0.5) * (firstStackArray.length / smoothingFactor);
    yArray[xChange4][zChange4] = (yArray[xref3][zref3] + yArray[xref4][zref4]) / 2 + variation;
  }
  variation = (Math.random() - 0.5) * (firstStackArray.length / smoothingFactor);
  yArray[xChange5][zChange5] = (yArray[xref1][zref1] + yArray[xref2][zref2] +
  yArray[xref1][zref1] + yArray[xref2][zref2]) / 4 + variation;

  const array1 = [];
  for (let i = 0; i < mid + 1; i++) {
    array1.push(firstStackArray[i].slice(0, mid + 1));
  }
  const array2 = [];
  for (let i = 0; i < mid + 1; i++) {
    array2.push(firstStackArray[i].slice(mid));
  }
  const array3 = [];
  for (let i = mid; i < max + 1; i++) {
    array3.push(firstStackArray[i].slice(0, mid + 1));
  }
  const array4 = [];
  for (let i = mid; i < max + 1; i++) {
    array4.push(firstStackArray[i].slice(mid));
  }
  nextIndexArray.push(array1, array2, array3, array4);
  return diamondThisArray(yArray, nextIndexArray);
}


function calculatePositions() {
  const positions = [];
  const indexFull = [];
  const initialPositions = [];
  const indexPositions = [];

  for (let i = 0; i < Math.sqrt(vertices); i++) {
    const row = [];
    for (let j = 0; j < Math.sqrt(vertices); j++) {
      row.push(null);
    }
    initialPositions.push(row);
  }
  for (let i = 0; i < Math.sqrt(vertices); i++) {
    const row = [];
    for (let j = 0; j < Math.sqrt(vertices); j++) {
      row.push([i, j]);
    }
    indexPositions.push(row);
  }

  initialPositions[0][0] = 1;
  initialPositions[0][Math.sqrt(vertices) - 1] = 1;
  initialPositions[Math.sqrt(vertices) - 1][0] = 1;
  initialPositions[Math.sqrt(vertices) - 1][Math.sqrt(vertices) - 1] = 1;
  indexFull.push(indexPositions);
  const heights = diamondThisArray(initialPositions, indexFull);
  console.log(heights);

  for (let j = 0, len = squares / Math.sqrt(squares); j < len; j++) {
    for (let i = 0; i < len; i++) {
      const v1 = new THREE.Vector3(i - offset, heights[j][i], j - offset);
      const v2 = new THREE.Vector3(i + 1 - offset, heights[j][i + 1], j - offset);
      const v3 = new THREE.Vector3(i - offset, heights[j + 1][i], j + 1 - offset);
      const v4 = new THREE.Vector3(i + 1 - offset, heights[j + 1][i + 1], j + 1 - offset);
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
