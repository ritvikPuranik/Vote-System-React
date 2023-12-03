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
  // let [refreshKey, setRefreshKey] = useState(0);


  // const isOwner = async (updatedAccount) => {
  //   const owner = await contractInstance.methods.owner().call();
  //   console.log("owner>>", owner);
  //   console.log("isOwner>>", updatedAccount === owner.toLowerCase());
  //   let response = await contractInstance.methods.addCandidate("ritvik puranik", 24, "M", "Youth Seva").send({from: owner});
  //   console.log("response for send>>", response);
  //   const candidates = await contractInstance.methods.candidatesCount().call();
  //   console.log("total candidates>", candidates);
  //   setOwner(updatedAccount === owner.toLowerCase());
  // }


  const isOwner = async (updatedAccount) => {
    try {
      const owner = await contractInstance.methods.owner().call();
      console.log("owner>>", owner);
      console.log("isOwner>>", updatedAccount === owner.toLowerCase());
  
      // Check if the network supports EIP-1559 before sending the transaction
      if (contractInstance.currentProvider.isEIP1559Compat !== false) {
        let response = await contractInstance.methods.addCandidate("ritvik puranik", 24, "M", "Youth Seva").send({
          from: owner 
          });
        console.log("response for send>>", response);
        const candidates = await contractInstance.methods.candidatesCount().call();
        console.log("total candidates>", candidates);
        setOwner(updatedAccount === owner.toLowerCase());
      } else {
        console.error("EIP-1559 is not supported on this network.");
      }
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
    // await isOwner(initialAccount);


    window.ethereum.on('accountsChanged', async function (accounts) {
      const updatedAccount = accounts[0];
      setAccount(updatedAccount);
      console.log("account now>>", updatedAccount);
      await isOwner(updatedAccount);
    });
    // setRefreshKey(oldKey =>oldKey+1);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadBlockChain();
    };

    fetchData();
  }, []);

  const render = () => {
    return (
      <div className="container">
        <ElectionTable />
        <ChooseCandidate contractInstance={contractInstance}/>
        {owner && <AddCandidate contractInstance={contractInstance} account={account}/>}
        <p>Your Account: {account}</p>
      </div>
    );
  }

  return render();
}

export default App;
