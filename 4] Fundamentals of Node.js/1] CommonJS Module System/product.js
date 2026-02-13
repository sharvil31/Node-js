function product(...nums) {
return nums.reduce((curr, acc) => acc * curr, 1)
}

module.exports = product;