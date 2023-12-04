import React, {useState, useEffect} from 'react';

const ChooseCandidate = (props) =>{
    let [candidateId, setCandidate] = useState("");

    const submitCandidate = async (event) =>{
        event.preventDefault();
        console.log("vote completee candidateData>",candidateId);
        try{
            console.log("account senfing the transaction>>", props.account);
            console.log("contractinstacne>", props.contractInstance);
            let response = await props.contractInstance.methods.vote(candidateId).send({"from": props.account, "gas": '1000000' });
            console.log("respnse from selecting candidate>", response);
        }catch(err){
            console.log("err>", err);
        }
    }

    const handleCandidateChange = (event) => {
        setCandidate(event.target.value);
    }

    return (
        <form onSubmit={submitCandidate}>
        <div className="form-group">
          <label htmlFor="candidatesSelect">Select candidateId</label>
          <select
            className="form-control"
            id="candidatesSelect"
            value={candidateId}
            onChange={handleCandidateChange}
          >
            {props.candidateData.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Vote</button>
        <hr />
      </form>
    )
}

export default ChooseCandidate;