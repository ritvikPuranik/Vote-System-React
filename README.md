# Rigged Voting System

This is a simple dApp for conducting elections, with a twist. Each account linked to the app is allowed 1 vote, provided they have funded the campaign. The more an account has funded the campaign, the more weightage their vote carries. Simple, Rigged.
The Owner of the smart contract has the ability to add new candidates, who then are displayed on the leaderboard along with their details. The owner also holds the authority to compute the election results at will.
Currently the contract must be deployed and the address pasted in the contractDetails.js file, which is then used to launch a smart contract instance.

--
## Features
- ERC20 compliant
- Owner of SC can add candidates and compute election results
- Linked accounts can add funds to the campaign, which is stored in the SC.
- More the funding, higher the weightage of the vote. Each person has to fund atleast 1 ether to participate in the voting.

## To Launch
1. Clone the repo and deploy the contract (paste the contents of Contract.sol into remix with MetaMask env connected to Ganache).
2. Paste the contract address of the deployed contract into "contractAddress" field in contractDetails.js
3. `npm start` to launch the React app. App will be available on  _http://localhost:3000_

