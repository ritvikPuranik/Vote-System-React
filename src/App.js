import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';

import contractDetails from './contractDetails';
import ElectionTable from './components/ElectionTable';
import ChooseCandidate from './components/ChooseCandidate';
import AddCandidate from './components/AddCandidate';

function App() {
  let [account, setAccount] = useState("");
  let [contractInstance, setContractInstance] = useState(null);
  let [owner, setOwner] = useState(false);
  let [refreshKey, setRefreshKey] = useState(0);

  const isOwner = async (updatedAccount) => {
    try {
      const owner = await contractInstance.methods.owner().call();
      console.log("owner>>", owner);
      console.log("isOwner>>", updatedAccount === owner.toLowerCase());
      setOwner(updatedAccount === owner.toLowerCase());
      
      // let response = await contractInstance.methods.addCandidate("ritvik puranik", 24, "M", "Youth Seva").send({"from": owner, gas: '1000000'});
      // console.log("response for send>>", response);
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
    });
    
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadBlockChain();
    };

    fetchData();
  }, [refreshKey]);

  const render = () => {
    return (
      <div className="container">
        <ElectionTable contractInstance={contractInstance} refreshKey={refreshKey}/>
        <ChooseCandidate contractInstance={contractInstance}/>
        {owner && <AddCandidate contractInstance={contractInstance} account={account} setRefreshKey={setRefreshKey}/>}
        <p>Your Account: {account}</p>
      </div>
    );
  }

  return render();
}

export default App;
