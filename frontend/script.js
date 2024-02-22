const connectWalletMsg = document.querySelector('#connectWalletMessage');
const connectWalletBtn = document.querySelector('#connectWallet');
const votingStation = document.querySelector('#votingStation');
const timerTime = document.querySelector('#time');
const timerMessage = document.querySelector('#timerMessage');
const mainBoard = document.querySelector('#mainBoard');
const voteForm = document.querySelector('#voteForm');
const vote = document.querySelector('#vote');
const voteBtn = document.querySelector('#sendVote');
const showResultContainer = document.querySelector('#showResultContainer');
const showResult = document.querySelector('#showResult');
const result = document.querySelector('#result');
const admin = document.querySelector('#admin');
const candidates = document.querySelector('#candidates');
const electionDuration = document.querySelector('#electionDuration');
const startAnElection = document.querySelector('#startAnElection');
const Candidate = document.querySelector('#Candidate');
const addACandidate = document.querySelector('#addACandidate');

//Configuring Ethers
const contractAddress = "0xCc2eEE277a1119AC20E67EEd946FE28EEfbd12B9";
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "start",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "end",
          "type": "uint256"
        }
      ],
      "name": "ElectionStarted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "Candidates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "numberOfVotes",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ListOfvoters",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "checkElectionPeriod",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "electionStarted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "electionTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetAllVoterStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "retrieveVotes",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "numberOfVotes",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidates",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_votingDuration",
          "type": "uint256"
        }
      ],
      "name": "startElection",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "voteTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_voter",
          "type": "address"
        }
      ],
      "name": "voterStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

let contract;
let signer;

const provider = new ethers.providers.Web3Provider(window.ethereum, 80001);
provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0]);
        contract = new ethers.Contract(contractAddress, contractABI, signer);
    });
});

//Function
const getAllCandidates = async function() {
    if(document.getElementById('candidateBoard')) {
        document.getElementById('candidateBoard').remove();
    }
    let board = document.createElement('table');
    board.id = 'candidateBoard';
    mainBoard.appendChild(board);

    let tableHeader = document.createElement('tr');
    tableHeader.innerHTML = '<th>ID No.</th><th>CandidateName</th><th>Votes</th>';
    board.appendChild(tableHeader);

    let candidates = await contract.retrieveVotes();
    for(let i = 0; i < candidates.length; i++) {
        let candidate = document.createElement('tr');
        candidate.innerHTML = `<td>${candidates[i].id}</td><td>${candidates[i].name}</td><td>${candidates[i].numberOfVotes}</td>`;
        board.appendChild(candidate);
    }
}

const getResult = async function() {
    result.style.display = "flex";

    if(document.getElementById('resultBoard')) {
        document.getElementById('resultBoard').remove();
    }

    let resultBoard = document.createElement('table');
    resultBoard.id = 'resultBoard';
    result.appendChild(resultBoard);

    let tableHeader = document.createElement('tr');
    tableHeader.innerHTML = '<th>ID No.</th><th>CandidateName</th><th>Votes</th>';
    resultBoard.appendChild(tableHeader);

    let candidates = await contract.retrieveVotes();
    for(let i = 0; i < candidates.length; i++) {
        let candidate = document.createElement('tr');
        candidate.innerHTML = `<td>${candidates[i].id}</td><td>${candidates[i].name}</td><td>${candidates[i].numberOfVotes}</td>`;
        resultBoard.appendChild(candidate);
    }
}

const refreshPage = function() {
    setInterval(async() => {
        let time = await contract.electionTime();
    
        if(time > 0) {
            let currentTime = Math.floor(Date.now() / 1000);
            let remainingTime = time - currentTime;
            if(remainingTime > 0) {
                timerTime.innerHTML = remainingTime;
                timerMessage.innerHTML = `<span id = "time">${remainingTime}</span> seconds remaining`;
                voteForm.style.display = "flex";
                showResultContainer.style.display = "none";
            } else {
                timerTime.innerHTML = 0;
                timerMessage.innerHTML = `<span id = "time">${remainingTime}</span> seconds remaining`;
                voteForm.style.display = "flex";
            }
        }
        else{
            timerMessage.textContent = "No election or election currently running";
            voteForm.style.display = "none";
            showResultContainer.style.display = "block";
        }
    }, 1000);

    setInterval(async() => {
        getAllCandidates();
    }, 1000);
}

const sendVote = async function() {
    let candidate = vote.value;
    await contract.voteTo(candidate);
    vote.value = "";
}

const startElection = async function() {
    if(candidates.value === "") {
        alert("list of candidate is empty");
    }
    if(!electionDuration.value) {
        alert("please set the election duration");
    }
    
    const _candidates = candidates.value.split(",");
    //the above converts string into an array
    const _votingDuration = electionDuration.value;

    await contract.startElection(_candidates, _votingDuration);
    refreshPage();

    candidates.value = "";
    electionDuration.value = "";

    voteForm.style.display = "flex";
    showResultContainer.style.display = "none";
}

const addCandidate = async function() {
    if(!Candidate.value) {
        alert("please provide a Candidate name first");
    }

    await contract.addCandidate(Candidate.value);
    refreshPage();
    Candidate.value = "";
}

const getAccount = async function() {
    const ethAccounts = await provider.send("eth_requestAccounts", []).then(() => {
        provider.listAccounts().then((accounts) => {
            signer = provider.getSigner(accounts[0]);
            contract = new ethers.Contract(contractAddress, contractABI, signer)
        });
    });

    connectWalletBtn.textContent = signer._address.slice(0,10)+"...";
    connectWalletMsg.textContent = "Connected...";
    connectWalletBtn.disabled = true;

    let owner = await contract.owner();
    if(owner == signer._address) {
        admin.style.display = "flex";

        let time = await contract.electionTimer();
        if(time > 0) {
            contract.checkElectionPeriod();
        }
    }

    votingStation.style.display = "block";
    
    refreshPage();
    getAllCandidates();
};

//add event listener
connectWalletBtn.addEventListener('click', getAccount);
showResult.addEventListener('click', getResult);
voteBtn.addEventListener('click', sendVote);
addACandidate.addEventListener('click', addCandidate);
startAnElection.addEventListener('click', startElection);