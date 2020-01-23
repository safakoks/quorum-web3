const quorum_util = require("./quorum_util.js");

function getContractInstance(contractAddress){
    return new Promise((resolve, reject)=>{
        quorum_util.getABI(contractAddress).then( ABI =>{
            try {
                resolve(new quorum_util.web3.eth.Contract(ABI, contractAddress))
            } catch (error) {
                reject(error);
            }
        })
    })
}


module.exports.getContractInstance = getContractInstance;