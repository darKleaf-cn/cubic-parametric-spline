/* Inspired by https://github.com/armancodv/tdma */ 

function tdma(a, b, c, d) {
  let n = b.length - 1;
  let m = d[0].length;
  let x = new Array(n + 1).fill(0).map(() => new Array(m));
  for (let i = 1; i <= n; i++) {
    const q = a[i] / b[i - 1];
    b[i] = b[i] - c[i - 1] * q;
    d[i][0] = d[i][0] - d[i - 1][0] * q;
    d[i][1] = d[i][1] - d[i - 1][1] * q;

  }
  let q0 = d[n][0] / b[n];
  let q1 = d[n][1] / b[n];
  x[n][0] = q0;
  x[n][1] = q1;
  for (i = n - 1; i >= 0; i--) {
    q0 = (d[i][0] - c[i] * q0) / b[i];
    x[i][0] = q0;
    q1 = (d[i][1] - c[i] * q1) / b[i];
    x[i][1] = q1;
  }
  return x;
};

function coefficientMatrixToDigonals(coefficientMatrix) {
  let a = [];
  let b = [];
  let c = [];
  let n = coefficientMatrix.length - 1;
  a[0] = 0;
  c[n] = 0;
  for (let i = 0; i <= n; i++) {
    if (i !== 0) a[i] = coefficientMatrix[i][i - 1];
    b[i] = coefficientMatrix[i][i];
    if (i !== n) c[i] = coefficientMatrix[i][i + 1];
  }
  return {
    a: a,
    b: b,
    c: c
  };
};

function solver(coefficientMatrix, rigthHandSideVector) {
  const result = coefficientMatrixToDigonals(coefficientMatrix);
  return tdma(result.a, result.b, result.c, rigthHandSideVector);
}

export default solver;