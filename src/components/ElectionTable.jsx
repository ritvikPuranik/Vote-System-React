import React ,{useState, useEffect} from "react";
import Web3 from 'web3';

const ElectionTable = (props) =>{

  const toNumber = (val) =>{ return Web3.utils.toNumber(val)}

  useEffect(() => {
    const fetchData = async () => {
      let candidatesCount = await props.contractInstance.methods.candidatesCount().call();
      candidatesCount = toNumber(candidatesCount);
      let allData = [];
      for(let i=1; i<=candidatesCount; i++){
        let data = await props.contractInstance.methods.candidates(i).call();
        data.id = toNumber(data.id);
        data.age = toNumber(data.age);
        data.voteCount = toNumber(data.voteCount);
        allData.push(data);

      }
      props.setCandidateData(allData);
      }
    
    // Call the function
    fetchData();
  });



  return (
    <div className="container" style={{"width": "650px"}}>
    <div className="row">
      <div className="col-lg-12">
        <h1 className="text-center">Election Results</h1>
        <hr/>
        <br/>
        <div id="content" >
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Age, Gender</th>
              <th scope="col">Agenda</th>
              <th scope="col">Votes</th>
            </tr>
          </thead>

          <tbody id="candidatesResults">
            {props.candidateData.map((item) => (
              <tr key={item.id}>
                <th scope="row">{toNumber(item.id)}</th>
                <td>{item.name}</td>
                <td>{`${toNumber(item.age)}, ${item.gender}`}</td>
                <td>{item.agenda}</td>
                <td>{toNumber(item.voteCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ElectionTable;