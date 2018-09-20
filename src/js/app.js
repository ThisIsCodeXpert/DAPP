App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("../Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      return App.render();
    });
  },

  listenForEvents : function(){

      App.contracts.Election.deployed().then(function(instance){
          instance.eventVote({},{
          fromBlock: 'latest',
          toBlock: 'latest'
          }).watch(function(err, event){
            App.render();
          });
      });

  },

  voteforc1_js: function(){
    App.contracts.Election.deployed().then(function(instance){
        return instance.vote(1, {from: App.account});
    }).catch(function(err){

        console.log(err);
    });
  },

    voteforc2_js: function(){
      App.contracts.Election.deployed().then(function(instance){
          return instance.vote(2, {from: App.account});
      }).catch(function(err){

          console.log(err);
      });
    },


  render: function() {

        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
            }
        });


        App.contracts.Election.deployed().then(function(instance){
        return instance.candidates(1);
        }).then(function(candidate){
            console.log("candidate id :", candidate[0].toNumber());
            console.log("candidate name :", candidate[1]);
            console.log("candidate votes :", candidate[2].toNumber());
            document.getElementById("cadidate1id").innerHTML = candidate[1];
            document.getElementById("cadidate1voteid").innerHTML = candidate[2].toNumber();
        });

        App.contracts.Election.deployed().then(function(instance){
        return instance.candidates(2);
        }).then(function(candidate){
            console.log("candidate2 id :", candidate[0].toNumber());
            console.log("candidate2 name :", candidate[1]);
            console.log("candidate2 votes :", candidate[2].toNumber());
            document.getElementById("cadidate2id").innerHTML = candidate[1];
            document.getElementById("cadidate2voteid").innerHTML = candidate[2].toNumber();
        });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

