const fs = require('fs');
const path = require('path');

const log_file = fs.createWriteStream(path.join(__dirname,"logs","terminal.log"), { flags: 'a' })
     

function addLogFile(field, message){
    log_file.write(`---------------\n`);
    log_file.write(`${field}  :  ${message}\n`);
}

function createAccountFile(account){
    var data = JSON.stringify(account);
    var accountFilePath = path.join(__dirname, "accounts",`${account.address}.json`);
    fs.writeFileSync(accountFilePath, data);
}

function createAbiFile(contractAddress, abi){
    var data = JSON.stringify(
        {
            address : contractAddress,
            abi : abi
        });
    var accountFilePath = path.join(__dirname, "contracts","abi",`${contractAddress}.json`);
    fs.writeFileSync(accountFilePath, data);
}

function readFiles(current_path, callback){
    var returnedFiles = []
    return new Promise((resolve, reject)=>{
        try {
            fs.readdir(current_path, (err, files) => {
                // Dosyalar
                if(err){
                    throw new Error(err)
                }
                files.map((file) => {
                    if(file){
                    var current_file = JSON.parse(
                        fs.readFileSync(path.join(current_path, file)));
                    returnedFiles.push(current_file);
                }
                });
                resolve(returnedFiles);
              }); 
        } catch (error) {
            reject(error);
        }
    })
}

function getContracts(){
    return new Promise((resolve,reject)=>{
        try {
            var contractsFiles = fs.readdirSync(path.join(__dirname, "contracts", "solidity"));
            resolve(contractsFiles);
        } catch (error) {
            reject(error); 
        }
    })
}


async function getFileAccounts(){
    return await readFiles(path.join(__dirname,"accounts"))
}

async function getFileAbis(callback){
    return await readFiles(path.join(__dirname,"contracts","abi"))
}



function readContract(contractName){
    var contractPath = path.resolve(__dirname, 'contracts',"solidity", contractName);
    var source = fs.readFileSync(contractPath, 'utf8');
    return source;
}



module.exports.addLogFile = addLogFile;
module.exports.createAccountFile = createAccountFile;
module.exports.createAbiFile = createAbiFile;
module.exports.getFileAccounts = getFileAccounts;
module.exports.getFileAbis = getFileAbis;
module.exports.readContract = readContract;
module.exports.getContracts = getContracts;