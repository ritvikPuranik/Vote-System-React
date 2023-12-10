// // SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.9.0;
// import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "hardhat/console.sol";


// contract Election is ERC20 {
//     // Model a Candidate
//     struct Candidate {
//         uint id;
//         string name;
//         uint8 age;
//         string agenda;
//         string gender;
//         uint voteCount;
//     }

//     struct Voter {
//         uint votedFor; //Candidate ID goes here
//         uint funds; 
//         bool hasVoted;
//     }

//     event voteComplete (
//         uint indexed _candidateId
//     );
//     event fundsTransferred (
//         uint indexed _amount
//     );
//     event resultsReady (
//         uint[] _results
//     );

//     // Read/write candidates
//     mapping(uint => Candidate) public candidates;
//     mapping(address => Voter) public voters;
//     mapping(uint => address) public voterAddress;
//     mapping(uint => uint) public weightage;

//     // Store Candidates Count
//     uint public candidatesCount;
//     address public owner;
//     uint public voterCount;

//     constructor() ERC20("Vote-Coin", "VC"){
//         owner = msg.sender;
//     }

//     function addCandidate (string memory _name, uint8 _age, string memory _gender, string memory _agenda) public {
//         require(msg.sender == owner, "Only owner can Add Candidates");
//         candidatesCount ++;
        
//         candidates[candidatesCount] = Candidate({
//             id: candidatesCount,
//             name: _name,
//             age: _age,
//             gender: _gender,
//             agenda: _agenda,
//             voteCount: 0
//         });
//     }

//     function addFunds () public payable{
//         require(msg.value > 0, "Amount can't be zero!");
//         _mint(msg.sender, (msg.value) * (10 ** decimals()));
//         if(!(voters[msg.sender].funds > 0)){
//             console.log("creating new voter");
//             voterCount++; //Once they add funds they become a voter
//             voterAddress[voterCount] = msg.sender;
//         }
//         voters[msg.sender].funds += (msg.value) * (10 ** decimals());
//         console.log("total SC funds now>", address(this).balance);
//         emit fundsTransferred(msg.value);

//     }


//     function getBalanceVC() public view returns (uint){
//         return voters[msg.sender].funds;
//     }

//     function vote (uint _candidateId) public {
//         require(!voters[msg.sender].hasVoted, "Current voter has already voted!");
//         require(voters[msg.sender].funds > 0, "Current voter has no funds, please fund the campaign!");

//         // require a valid candidate
//         require(_candidateId > 0 && _candidateId <= candidatesCount);

//         voters[msg.sender].hasVoted = true;
//         candidates[_candidateId].voteCount ++;

//         voters[msg.sender].votedFor = _candidateId;
        
//         // trigger voted event
//         emit voteComplete(_candidateId);
//     }

//     function computeElectionResult() public returns (uint[] memory) {
//         // mapping(uint => uint) storage localWeightage = weightage;
//         uint contractFunds = address(this).balance;
//         console.log("contractFunds>", contractFunds);

//         for(uint i=1; i<=voterCount; i++){
//             address addr = voterAddress[i];
//             uint votedFor = voters[addr].votedFor;
//             weightage[votedFor] = 0;
//             console.log("weightage[votedFor]>>", weightage[votedFor]);
//         }
//         console.log("Second round>>>>");

//         for(uint i=1; i<=voterCount; i++){
//             address addr = voterAddress[i];
//             console.log("addr>", addr);
//             uint votedFor = voters[addr].votedFor;
//             console.log("votedFor>>", votedFor);
//             uint funds = voters[addr].funds;
//             console.log("funds>", funds);
//             uint weight = (funds*1000)/(contractFunds * (10 ** decimals()));
//             console.log("weight>", weight);
//             weightage[votedFor] += weight;
//             console.log("weightage[votedFor]>>", weightage[votedFor]);
//         }

//         uint[] memory ret = new uint[](candidatesCount);
//         for (uint i = 1; i <= candidatesCount; i++) {
//             ret[i-1] = weightage[i];
//         }
//         console.log("worked so far>>", ret[0]);
//         emit resultsReady(ret);
//         return ret;

//     }
// }