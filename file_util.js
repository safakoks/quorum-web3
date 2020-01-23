const fs = require('fs');
const path = require('path');

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
                files.map((file) => {
                    var current_file = JSON.parse(
                        fs.readFileSync(path.join(current_path, file)));
                    returnedFiles.push(current_file);
                });
                resolve(returnedFiles);
              }); 
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
    var contractPath = path.resolve(__dirname, 'contracts', contractName);
    var source = fs.readFileSync(contractPath, 'utf8');
    return source;
}

module.exports.createAccountFile = createAccountFile;
module.exports.createAbiFile = createAbiFile;
module.exports.getFileAccounts = getFileAccounts;
module.exports.getFileAbis = getFileAbis;
module.exports.readContract = readContract;

