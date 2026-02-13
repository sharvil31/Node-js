function sum(...nums) {
return nums.reduce((curr, acc) => acc + curr, 0)
}

module.exports = sum;