const quorum_util = require("./quorum_util.js");


function createMethod(objMethod){
    return new Promise((resolve, reject)=> {
        try {
            getContractInstance(objMethod.contractAddress).then((contractIns) => {
                if(objMethod.parameters){
                    resolve(contractIns.methods[objMethod.methodName]
                        .apply(this,objMethod.parameters));
                }
                else{
                    resolve(contractIns.methods[objMethod.methodName]());
                }
        }) 
        } catch (error) {
            reject(error)
        }
    })
}
function callFunc(objFunc){
    return createMethod({
        contractAddress:objFunc.contractAddress,
        parameters : objFunc.parameters,
        methodName : objFunc.methodName
    }).then((contractMethod) => {
        return new Promise( (resolve, reject) => {
            try {
                resolve(contractMethod.call({
                    from : objFunc.accountAddress,
                }))
            } catch (error) {
                reject(error)
            }
        })
    })
}

function invokeFunc(objFunc){
   return createMethod({
       contractAddress:objFunc.contractAddress,
       parameters : objFunc.parameters,
       methodName : objFunc.methodName
   }).then((contractMethod) => {
        return new Promise( (resolve, reject) => {
            try {
                contractMethod.send({
                    from : objFunc.accountAddress,
                    gas : 8000000
                }).then( result => {
                    resolve(result);
                })
            } catch (error) {
                reject(error)
            }
        })
    }
    );
}




function getContractInstance(contractAddress){
    return new Promise((resolve, reject)=>{
        quorum_util.getABI(contractAddress).then( ABI =>{
            try {
                if ( ABI == undefined){
                    throw new Error("ABI Tanımı Boş")
                }
                resolve(new quorum_util.web3.eth.Contract(ABI, contractAddress))
            } catch (error) {
                reject(error);
            }
        })
    })
}


module.exports.getContractInstance = getContractInstance;
module.exports.invokeFunc = invokeFunc;
module.exports.callFunc = callFunc;