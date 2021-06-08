import solver from "./matrix.js";

class SPLINE {
  constructor(p, p_) {
    this.p = p;
    this.p_ = p_;
    this.n = p.length;
    this.s = this.n - 1;
    this.t = new Array(this.s).fill(0);
    this.m = new Array(this.n).fill(0).map(() => new Array(this.n).fill(0));
    this.C_y = [];
    this.A = [];
    this.B = [];
    this.C = [];
    this.D = [];
    this.samples_t = [];
    this.samples_s = [];
    this.init();
  }
  init() {
    this.caculate_t();
    this.caculate_matrix();
    this.caculate_C_y();
    this.caculate_vector_cut();
    this.caculate_parameter();
  }
  caculate_t() {
    for (let i = 0; i < this.s; i++)
      this.t[i] = Math.sqrt((this.p[i + 1][0] - this.p[i][0]) ** 2 + (this.p[i + 1][1] - this.p[i][1]) ** 2);
    return this.t;
  }
  caculate_matrix() {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (i == 0 && j == 0 || i == this.n - 1 && j == this.n - 1)
          this.m[i][j] = 1;
        else if (i == 0 && j == 1 || i == this.n - 1 && j == this.n - 2)
          this.m[i][j] = 0;
        else if (i == j)
          this.m[i][j] = 2 * (this.t[i] + this.t[i - 1]);
        else if (i + 1 == j)
          this.m[i][j] = this.t[i - 1];
        else if (i - 1 == j)
          this.m[i][j] = this.t[i];
      }
    }
    return this.m;
  }
  caculate_C_y() {
    for (let i = 0; i < this.n; i++) {
      if (i == 0)
        this.C_y.push(this.p_[i]);
      else if (i == this.n - 1)
        this.C_y.push(this.p_[i]);
      else {
        const tempX = this.t[i - 1] * this.t[i] * (3 * (this.p[i + 1][0] - this.p[i][0]) / this.t[i] ** 2 + 3 * (this.p[i][0] - this.p[i - 1][0]) / this.t[i - 1] ** 2);
        const tempY = this.t[i - 1] * this.t[i] * (3 * (this.p[i + 1][1] - this.p[i][1]) / this.t[i] ** 2 + 3 * (this.p[i][1] - this.p[i - 1][1]) / this.t[i - 1] ** 2);
        this.C_y.push([tempX, tempY]);
      }
    }
    this.C_y = Array.from(this.C_y);
    return this.C_y
  }
  caculate_vector_cut() {
    const temp = solver(this.m, this.C_y);
    this.p_ = Array.from(temp);
    return temp;
  }
  caculate_parameter() {
    for (let i = 0; i < this.s; i++) {
      const Ax = 2 * (this.p[i][0] - this.p[i + 1][0]) / this.t[i] ** 3 + (this.p_[i + 1][0] + this.p_[i][0]) / this.t[i] ** 2;
      const Ay = 2 * (this.p[i][1] - this.p[i + 1][1]) / this.t[i] ** 3 + (this.p_[i + 1][1] + this.p_[i][1]) / this.t[i] ** 2;
      this.A.push([Ax, Ay])
      const Bx = 3 * (this.p[i + 1][0] - this.p[i][0]) / this.t[i] ** 2 - (2 * this.p_[i][0] + this.p_[i + 1][0]) / this.t[i];
      const By = 3 * (this.p[i + 1][1] - this.p[i][1]) / this.t[i] ** 2 - (2 * this.p_[i][1] + this.p_[i + 1][1]) / this.t[i];
      this.B.push([Bx, By]);
      const C = this.p_[i];
      this.C.push(C);
      const D = this.p[i];
      this.D.push(D);
    }
    return this.A, this.B, this.C, this.D;
  }

  grasp_sample() {
    for (let i = 0; i < this.s; i++) {
      const arr = [];
      for (let j = 0; j < this.t[i]; j++) {
        arr.push(j);
      }
      const sample_t = arr;
      const sample_s = [];
      for (let t of sample_t) {
        const S_tx = this.A[i][0] * t ** 3 + this.B[i][0] * t ** 2 + this.C[i][0] * t + this.D[i][0];
        const S_ty = this.A[i][1] * t ** 3 + this.B[i][1] * t ** 2 + this.C[i][1] * t + this.D[i][1];
        sample_s.push([S_tx, S_ty]);
      }
      this.samples_t.push.apply(this.samples_t, sample_t);
      this.samples_s.push.apply(this.samples_s, sample_s);
    }
    this.samples_t.push(this.t[-1]);
    this.samples_t = Array.from(this.samples_t);
    this.samples_s = Array.from(this.samples_s);
  }
  caculate_point(i, t) {
    const S_tx = this.A[i][0] * t ** 3 + this.B[i][0] * t ** 2 + this.C[i][0] * t + this.D[i][0];
    const S_ty = this.A[i][1] * t ** 3 + this.B[i][1] * t ** 2 + this.C[i][1] * t + this.D[i][1];
    return { x: S_tx, y: S_ty };
  }
}

export default SPLINE;