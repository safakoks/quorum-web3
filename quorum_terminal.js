const quorum_util = require("./quorum_util.js");
const terminal = require( 'terminal-kit' ).terminal

const optionList = [
    'Create New Account' ,
    'List Accounts' ,
    'Deploy Contract' ,
    'Deploy Private Contract' ,
    'List Contracts' ,
    'Private Transaction',
    'Send Private Transaction',
    'Get Transaction',
    'Get Block',
    'Exit',
] ;

// Global Variables
var banner;
var selectedAccount;
var selectedContract;
var key = "QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=";


function checkError(error){
    if(error){
        console.error(error);
        process.exit() ;
    }
}

function catchScreen(error){
    if(error) {
        terminal.red(`\n ${error} \n`)
    }
}

function checkGlobalVariables(){
    if(banner){
        terminal.yellow(`\n---------------`)
        terminal.yellow(`\n ${banner} \n`)
        terminal.yellow(`---------------\n`)
    }
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
                    await quorum_util.setWeb3Provider(host, port);
                    if(await quorum_util.checkConnection()){
                        terminal.green(`\n${host}:${port} connected\n`)
                        quorum_util.init();
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
    terminal.green(`\n New Account Created : ${account.address} \n`);
    return new Promise( resolve => { resolve(account)})
}

async function listAccountScreen(){
    terminal.cyan("\nAccounts\n");
    return await quorum_util.getAccounts().then( accounts => {
        return new Promise( (resolve, reject)=>{
            if (accounts.length == 0){
                reject("Account Bulunmamakta")
            }
            terminal.singleColumnMenu(accounts.map( account =>{
                return account.address;
            }), (error, account)=>{
                checkError(error);
                selectedAccount = account.selectedText;
                resolve();
            })
        })
    })
}

async function listContractsScreen(){
    terminal.cyan("\Contracts\n");
    return await quorum_util.getAbis().then( abi_files => {
        return new Promise( (resolve, reject)=>{
            if(abi_files.length == 0){
                reject("Yüklü Contract Bulunmamakta")
            }
            terminal.singleColumnMenu(abi_files.map( abi_file =>{
                return abi_file.address;
            }), (error, selectedContract)=>{
                checkError(error);
                selectedContract = selectedContract.selectedText;
                resolve();
            })
        })
    })
}

async function getTransaction(){
    return new Promise((resolve,reject)=>{
        terminal("\nTransaction Hash : ")
        terminal.inputField({
        }, (error,input)=>{
            if(error){
                reject(error);
            }
            if(!input){
                reject("Hash giriniz");
            }
            quorum_util.getTransaction(input).then((tx)=>{
            terminal.white("\n", JSON.stringify(tx),"\n");
            resolve();
            })
        })
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

async function deployPrivateContractScreen(){
    await quorum_util.file_util.getContracts().then(contracts => {
        return new Promise((resolve, reject)=>{
            terminal.singleColumnMenu(contracts, function( error , response ) {
                checkError(error);
                if (selectedAccount){
                    quorum_util.directDeployContract(response.selectedText, selectedAccount, key);
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
        checkError(error);
        });
    if(result=="OK"){
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
                            await createAccountScreen().catch(error =>{
                                catchScreen(error);
                            });
                            break;
                        case 1:
                            await listAccountScreen().catch(error =>{
                                catchScreen(error);
                            });
                            break;
                        case 2:
                            await deployContractScreen().catch(error =>{
                                catchScreen(error);
                            })
                            break;
                        case 3:
                            
                            await deployPrivateContractScreen().catch(error =>{
                                catchScreen(error);
                            });
                            break;
                        case 4:
                            await listContractsScreen().catch(error =>{
                                catchScreen(error);
                            });
                            break;
                        case 5:
                        await listContractsScreen().catch(error =>{
                            catchScreen(error);
                        });
                        break;
                        case 6:
                        await getTransaction().catch(error =>{
                            catchScreen(error);
                        });
                        break;
                        case 7:
                        await getTransaction().catch(error =>{
                            catchScreen(error);
                        });
                        break;
                        case optionList.length -1 :
                            resolve('EXIT');
                        break;
                        default:
                            break;
                    }
                    resolve("OK");
                } );
                } catch (error) {
                    reject(error);
        }
    })
}

module.exports.MainScreen = MainScreen