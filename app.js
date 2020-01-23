const quorum_util = require("./quorum_util.js");

quorum_util.init();



try {
    quorum_util.contractInteraction
.getContractInstance("0x35bD965239255991876f5073737F892Ced70D1FC").then(middle_earth =>{
    quorum_util.getAccountByIndex(0).then( account=>{
        middle_earth.methods.addMe("ahmet",150).send({
            from: account.address,
            gas: 500000
        }).then((transaction, error) =>{
            if (error){
                throw new Error(error);
            }
            console.log(transaction.transactionHash);
        });
    })

}).catch(error =>{
    throw new Error(error);
})
} catch (error) {
    console.log(error);
}



// quorum_util.getAccountByIndex(0).then(current_account => {
//     quorum_util.directDeployContract("middle_earth.sol", current_account.address);
// });