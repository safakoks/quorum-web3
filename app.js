
const quorum_util = require("./quorum_util.js");
var terminal = quorum_util.terminal

quorum_util.init();

try {

    //input for connection
    //account ve contracts falan değişecek connection a göre :)

    var optionList = [
        'Create New Account' ,
        'List Accounts' ,
        'Deploy Contract' ,
        'Send Private Transaction'
    ] ;
    
    terminal.singleColumnMenu(optionList , function( error , response ) {
        terminal.cyan(`\nYou selected : ${response.selectedText}\n`)
        switch (response.selectedIndex) {
            case 0:
                quorum_util.createAccount();
                break;
        
            default:
                break;
        }
        process.exit() ;
    } ) ;
    // quorum_util.checkConnection();



    // quorum_util.getAccountByIndex(0).then( account => {
    //    var contractAddress = "0x35bD965239255991876f5073737F892Ced70D1FC";
    //     var accountAddress = account.address;
    //     quorum_util.contractInteraction.callFunc({
    //         contractAddress : contractAddress,
    //         accountAddress : accountAddress,
    //         methodName : "getElfContent",
    //     }).then( result => {
    //         console.log(result);
    //     }).catch( error =>{
    //         throw new Error(error)
    //     })
    // })
    



} catch (error) {
    console.log(error);
}
