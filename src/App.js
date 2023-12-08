import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import {Container, Row, Col} from 'react-bootstrap';

import contractDetails from './contractDetails';
import ElectionTable from './components/ElectionTable';
import ChooseCandidate from './components/ChooseCandidate';
import AddCandidate from './components/AddCandidate';
import FundCampaign from './components/FundCampaign';
import UserDetails from './components/UserDetails';

function App() {
  let [account, setAccount] = useState("");
  let [contractInstance, setContractInstance] = useState(null);
  let [owner, setOwner] = useState(false);
  let [refreshKey, setRefreshKey] = useState(0);
  let [candidateData, setCandidateData] = useState([]);
  let [canVote, setCanVote] = useState(false); //This hides the vote option if the user has either already voted or has no funds added
  let [userFunds, setUserFunds] = useState(0);

  const isOwner = async (updatedAccount) => {
    try {
      const owner = await contractInstance.methods.owner().call();
      setOwner(updatedAccount === owner.toLowerCase());
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const loadBlockChain = async () => {
    let { abi, contractAddress } = contractDetails;
    let web3 = new Web3('http://127.0.0.1:7545');
    setContractInstance(new web3.eth.Contract(abi, contractAddress));
    console.log("ContractInstance>", contractInstance);

    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const initialAccount = accounts[0];
    setAccount(initialAccount);
    await isOwner(initialAccount);

    window.ethereum.on('accountsChanged', async function (accounts) {
      const updatedAccount = accounts[0];
      setAccount(updatedAccount);
      console.log("account now>>", updatedAccount);
      await isOwner(updatedAccount);
      setRefreshKey(oldKey=>oldKey+1);
    });    
  }

  const canUserVote = async() =>{
    try{
      let voter = await contractInstance.methods.voters(account).call();
      // console.log("voter details>", voter);
      let {hasVoted, funds} = voter;
      setUserFunds(Web3.utils.fromWei(funds, 'ether'));
      console.log("canVote>", !hasVoted && userFunds>0);
      setCanVote(!hasVoted && userFunds>0);

    }catch(err){
      console.log("err while checking hasVoted>", err);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadBlockChain();
      await canUserVote();
    };

    fetchData();
  }, [refreshKey]);

  useEffect(() => {
    const listenToEvent = async () => {
      // console.log("listening to events...>", contractInstance.events);
      contractInstance.events.allEvents({}, function(error, event){ console.log("1.", event); })
    };

    listenToEvent();
  });

  const render = () => {
    return (
      <Container className='m-5 mx-auto'>
        <UserDetails account={account} userFunds={userFunds} />
        <hr />
        <ElectionTable contractInstance={contractInstance} refreshKey={refreshKey} setCandidateData={setCandidateData} candidateData={candidateData}/>
        <hr />
        {canVote && <ChooseCandidate contractInstance={contractInstance} candidateData={candidateData} account={account} setRefreshKey={setRefreshKey}/>}
        <Row className='mt-3'>
          <Col>{owner && <AddCandidate contractInstance={contractInstance} account={account} setRefreshKey={setRefreshKey}/>} </Col>
          <Col><FundCampaign contractInstance={contractInstance} account={account} setRefreshKey={setRefreshKey}/></Col>
        </Row>
      </Container>
        
    );
  }

  return render();
}

export default App;
