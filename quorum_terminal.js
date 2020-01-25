const quorum_util = require("./quorum_util.js");
const terminal = require( 'terminal-kit' ).terminal

const optionList = [
    'Create New Account' ,
    'List Accounts' ,
    'Deploy Contract' ,
    'List Contracts' ,
    'Send Private Transaction',
    'Exit',
] ;

// Global Variables
var selectedAccount;
var selectedContract;

function checkError(error){
    if(error){
        console.error(error);
        process.exit() ;
    }
}

function checkGlobalVariables(){
    if(selectedAccount){
        terminal.green(`#Selected Account : ${selectedAccount}\n`)
    }
    if(selectedContract){
        terminal.green(`#Selected Contract : ${selectedContract}\n`)
    }
}

function connectionScreen(){

    return new Promise((resolve, reject)=>{
        try {
            var host, port;
            terminal.green("\n Connection Settings \n");
            terminal('Please enter host address: ' ) ;
            terminal.inputField({
                default:"localhost",
            }, (error,input)=>{
                checkError(error);
                host = input;
                terminal('\nPlease enter ws port: ' ) ;
                terminal.inputField({
                    default:"8546",
                },async (error,input)=>{
                    checkError(error);
                    port = input;
                    quorum_util.init(host, port);
                    if(await quorum_util.checkConnection()){
                        terminal.green(`\n${host}:${port} connected\n`)
                        resolve();
                    }else{
                        connectionScreen();
                    }
                })
            })
        } catch (error) {
            reject(error);
        }
    })
}

function createAccountScreen(){
    var account =  quorum_util.createAccount();
    return new Promise( resolve => { resolve(account)})
}

async function listAccountScreen(){
    terminal.cyan("\nAccounts\n");
    selectedAccount = await quorum_util.getAccounts().then( accounts => {
        return new Promise( (resolve, reject)=>{
            terminal.singleColumnMenu(accounts.map( account =>{
                return account.address;
            }), (error, selectedAccount)=>{
                checkError(error);
                resolve(accounts[selectedAccount.selectedIndex].address);
            })
        })
    }).catch(error => {
            checkError(error)
        })
}

async function listContractsScreen(){
    terminal.cyan("\Contracts\n");
    selectedContract = await quorum_util.getAbis().then( abi_files => {
        return new Promise( (resolve, reject)=>{
            terminal.singleColumnMenu(abi_files.map( abi_file =>{
                return abi_file.address;
            }), (error, selectedContract)=>{
                checkError(error);
                resolve(abi_files[selectedContract.selectedIndex].address);
            })
        })
    }).catch(error => {
            checkError(error)
        })
}

async function deployContractScreen(){
    await quorum_util.file_util.getContracts().then(contracts => {
        return new Promise((resolve, reject)=>{
            terminal.singleColumnMenu(contracts, function( error , response ) {
                checkError(error);
                if (selectedAccount){
                    quorum_util.directDeployContract(response.selectedText, selectedAccount);
                    resolve("Deployed")
                }
                    reject("Account seçilmedi")
            } ) ;
        })      
    }).catch( error =>{
        throw new Error(error);
    });
}

async function MainScreen() {
    if (!await quorum_util.checkConnection()){
        await connectionScreen()
    }
    terminal.grey("\n Welcome Quorum Web3 Terminal \n");
    checkGlobalVariables()
    var result = await MenuScreen().catch(error =>{
        console.log(error);
        process.exit();
    });
    if (result=="OK"){
        MainScreen();
    }
    if( result == "EXIT"){
        process.exit();
    }
}

function MenuScreen() {
        return new Promise(async (resolve, reject)=> {
            try {
                terminal.singleColumnMenu(optionList , {
                    selectedLeftPadding:">> "
                } , async function( error , response ) {
                    checkError(error);
                    terminal.cyan(`\nYou selected : ${response.selectedText}\n`)
                    switch (response.selectedIndex) {
                        case 0:
                            await createAccountScreen();
                            break;
                        case 1:
                            await listAccountScreen();
                            break;
                        case 2:
                            await deployContractScreen();
                            break;
                        case 3:
                            await listContractsScreen();
                            break;
                        case optionList.length -1 :
                            resolve('EXIT');
                        break;
                        default:
                            break;
                    }
                    resolve('OK');
                } );
                } catch (error) {
                    reject(error);
        }
    })
}

module.exports.MainScreen = MainScreen