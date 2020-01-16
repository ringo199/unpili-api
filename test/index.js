const { genFileName } = require('../utils/cryp')

let fileName = '测试中文'
let fileName2 = 'dsdadas'

console.log(genFileName(fileName));
console.log(genFileName(fileName2));
