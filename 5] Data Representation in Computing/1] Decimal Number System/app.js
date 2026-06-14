const digitList1 = [2, 4, 6, 5];
const digitList2 = [7, 3, 2];

const num1 = 2 * 1 + 4 * 10 + 6 * 100 + 5 * 1000;

// console.log(num1);

const digitsToNumber = (digits) => {
  let res = 0;
  digits.forEach((digit, index) => {
    const num = digit * Math.pow(10, index);
    res += num;
  });
  return res;
};

console.log(digitsToNumber(digitList1));
console.log(digitsToNumber(digitList2));
