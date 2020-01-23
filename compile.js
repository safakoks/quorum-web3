const solc = require('solc');
const file_util = require('./file_util.js')


function compile(contractFile){
    var compiledContract = solc.compile(file_util.readContract(contractFile),1);
    return compiledContract.contracts[Object.keys(compiledContract.contracts)[0]];
}

module.exports.compile = compile;
