const Web3 = require('web3')
const quorumjs = require('quorum-js')
const compile_util = require("./compile.js")
const file_util = require("./file_util.js")
var numberToBN = require("number-to-bn");
var term = require( 'terminal-kit' ).terminal


const contractInteraction = require("./contract_interaction.js");

const web3 = new Web3();

// local funcs
function extendWeb3(){
    quorumjs.extend(web3);
    web3.extend({
        property: 'eth',
        methods: [new web3.extend.Method({
          name: 'getBlockByNumber',
          call: 'eth_getBlockByNumber',
          params: 2,
          inputFormatter: [web3.extend.formatters.inputBlockNumberFormatter, v => !!v],
          outputFormatter: web3.extend.formatters.outputBlockFormatter
        })]
      });
    web3.utils.hexToNumber = v => {
        if (!v) return v;
        try {
          return numberToBN(v).toNumber();
        } catch (e) {
          return numberToBN(v).toString();
        }
      };
}

// export funcs
function createAccount(){
    try {
        var account = web3.eth.accounts.create();
        web3.eth.accounts.wallet.add(account);
        file_util.createAccountFile(account); 
        term.green("New Account Created",account.address,"\n")
    } catch (error) {
        console.error(error)
    }
}

function checkConnection(){
    web3.eth.net.isListening()
    .then(() => console.log('is connected'))
    .catch(e => console.log('Wow. Something went wrong'));
}

function createContract(abi){
    return new web3.eth.Contract(abi);
}

function compileContract(contractName){
    var compiledContract = compile_util.compile(contractName);
    return { bytecode : '0x'+ compiledContract.bytecode, abi : JSON.parse(compiledContract.interface) }
}

function deployContract(contract, compiledContract, account){
    var current_address = account ? account : getAccountByIndex(0).address;
    
    contract.deploy({
        data : compiledContract.bytecode
    }).send({
        from: current_address,
        gas: 80000000
    }, (err, deployedContract) => {
        console.log("Contract Address", deployedContract);
    })
    .on('transactionHash', (transaction) => {
        console.log("Transaction", transaction)
    })
    .on('confirmation',(_, receipt)=>{
        console.log("Confirmed")
        file_util.createAbiFile(receipt.contractAddress, compiledContract.abi);
    })
    .on('error', function (error) {
        console.log("Contract Deploy Error : ", error) });
    
}

async function getAccountByIndex(index){
    return new Promise((resolve, reject)=>{ 
        getAccounts().then(accounts =>  {
            if (accounts.length > index){
                resolve(accounts[index]);
            }else{
                reject("Account sayısını aştınız");
            }
        }).catch((err)=>{
            console.error(err);
        });
    }
    );
}

function getABI(contractAddress){
    return new Promise((resolve, reject) => { 
        getAbis().then(abi_files =>  {
            try {
                if (abi_files.length != 0 ){
                    abi_files.forEach((abi_file)=>{
                        if( abi_file && abi_file.address == contractAddress){
                            resolve(abi_file.abi)
                        }
                    });
                }else{
                    throw new Error("ABI dosyası bulunmamakta");
                } 
            } catch (error) {
                reject(error);
            }
        }).catch( err => {
            reject(err);
        });
    });
}


function getAccounts(){
    return file_util.getFileAccounts((accounts)=>{
        return new Promise((resolve,reject) => {
            if (accounts.length==0){
                reject("Account bulunamadı");
            }
            resolve(accounts);
        });
    })
}

async function getAbis(){
   return file_util.getFileAbis();
}

function directDeployContract(contractName, account){
    var ContractABI = compileContract(contractName);
    var Contract = createContract(ContractABI.abi);
    deployContract(Contract, ContractABI, account);
}

function loadAllAddress(){
    getAccounts().then((accounts)=>{
        try {
            accounts.forEach((account)=>{
                web3.eth.accounts.wallet.add(account);
            });   
        } catch (error) {
        console.error(error);
        }
    }).catch((err) => {
        console.error(err);
    })
}

function init(){
    extendWeb3();
    loadAllAddress();
    web3.setProvider(
        new Web3.providers.WebsocketProvider(
            'ws://0.0.0.0:23000'
            ));
}


module.exports.init = init;
module.exports.web3 = web3;
module.exports.terminal = term;


module.exports.contractInteraction = contractInteraction;
module.exports.directDeployContract = directDeployContract;
module.exports.compileContract = compileContract;
module.exports.createAccount = createAccount;
module.exports.checkConnection = checkConnection;
module.exports.createContract = createContract;
module.exports.getAccounts = getAccounts;
module.exports.getAbis = getAbis;
module.exports.getABI = getABI;


module.exports.deployContract = deployContract;

module.exports.getAccountByIndex = getAccountByIndex;

