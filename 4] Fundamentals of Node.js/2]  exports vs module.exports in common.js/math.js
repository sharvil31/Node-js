function sum(...nums) {
  return nums.reduce((curr, acc) => acc + curr, 0);
}

function product(...nums) {
  return nums.reduce((curr, acc) => acc * curr, 1);
}

module.exports = {
  sum,
  product,
};
