const ipfs =  window.IpfsHttpClient.create({host: "ipfs.infura.io", port: 5001, protocol: 'https' });
// console.log(ipfs)
App= {
    web3Provider: null,
    web3: null,
    contracts: {},
    account: '0x0',
    accounts: [],

    init: function(){
        console.log("App initialized")
        console.log(ipfs)

        if(window.ethereum){
            //If a web3 instance is already provided by Meta Mask
            App.web3Provider = window.ethereum;
            App.web3 = new Web3(App.web3Provider);
            App.initAccount().then((accounts)=>{
                if(accounts){
                    App.accounts = accounts;
                    console.log("Already connected")
                    return App.initContract();
                }else{
                    $('#btn-connect').show();
                    console.log("User has to connect first time")
                }
            });
           

        }else{
            alert("Please use browser with metamask installed");
        }
        
    },

    connect: function(){
        if(window.ethereum){
            //If a web3 instance is already provided by Meta Mask
            App.web3Provider = window.ethereum;
            App.web3 = new Web3(App.web3Provider);
            try{
                    window.ethereum.request({method: "eth_requestAccounts"}).then(function(){
                           App.initAccount().then((accounts)=>{
                            if(accounts){
                                App.accounts = accounts;
                                console.log("user connected")
                                return App.initContract();
                            }
                           });        
                    });
                } catch(error){
                    console.log("User denied account access")
                }
        }else{
            alert("Please use browser with metamask installed");
        }
     
    },


    initAccount: async function(){
        console.log("Init Accounts")
        let accounts = await App.web3.eth.getCoinbase();
        console.log("accounts "+accounts)
        if(accounts){  
            $('#btn-connect').show(); 
            $('#btn-connect').html(truncateEthAddress(accounts));
            $('#btn-connect').attr("class","btn btn-outline-danger btn-lg");
            return accounts;
        }else{
            return false;
        }
    },

    initContract: async function(){
        $.getJSON("../build/contracts/Interactive.json", function(contract){
            App.contracts.Interactive = TruffleContract(contract);
            App.contracts.Interactive.setProvider(App.web3Provider);
            App.contracts.Interactive.deployed().then(function(constracti){
                console.log("My NFT Contract Address: ", constracti.address);
            }); 
        }).done(function(){
            App.listenForEvents();
            // return App.render();
        });
    },

    listenForEvents: async function(){
        let contracti = await App.contracts.Interactive.deployed();
        let event = await contracti.Transfer({
                fromBlock: 'latest'
            });
       
        console.log("event triggered ",event);
     
    
    },

    startMint: async function(){
        var tid = $('#tid').val();
        var bid = $('#bid').val();
        var metadata = {
            "tokenId": tid,
            "name": "CRT Skulls #1",
            "description": "CRT Skulls are a collection of interactive skulls made using PixiJS living on the Ethereum blockchain.",
            "image": "ipfs://Qmc15wLjYsAM3HXZ5uoEawMCNzth9kbAWi4dmjiGkWGEsx/"+tid+".gif",
            "animation_url": "https://design-5k.github.io/crt-skulls-viewer?tokenId="+tid+"&bgId="+bid,
        };
        var metadata_buf = JSON.stringify(metadata);
        console.log(metadata_buf)
        let ipfs_res = await ipfs.add(metadata_buf);
        console.log(ipfs_res.path)
        var uri = "ipfs://"+ipfs_res.path;
        var contracti = await App.contracts.Interactive.deployed();
        var mint_res = await contracti.mint(uri,{from: App.accounts});
        console.log(mint_res.tx)
        $('#result').html(mint_res.tx);
        App.listenForEvents();
    
    }

}


$(function(){
    $(window).load(function(){
        App.init();
    })
})