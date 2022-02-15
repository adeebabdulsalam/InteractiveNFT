const ipfs =  window.IpfsHttpClient.create({host: "ipfs.infura.io", port: 5001, protocol: 'https' });
// console.log(ipfs)
App= {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function(){
        console.log("App initialized")
        console.log(ipfs)
    }
}