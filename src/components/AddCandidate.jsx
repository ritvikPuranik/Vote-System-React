import React, { useState } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Web3 from 'web3';

const AddCandidate = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [resultsModal, setResultsModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', gender: '', agenda: '' });
  const [percentages, setPercentages] = useState([]);
  let {contractInstance, account, setRefreshKey} = props;

  const addCandidate = () => {
    // Open the modal when the button is clicked
    setModalOpen(true);
  }

  const closeModal = () => {
    // Close the modal and reset the form data
    setModalOpen(false);
    setFormData({ name: '', age: '' });
  }

  const handleInputChange = (e) => {
    // Update the form data based on user input
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const submitDetails = async() => {
    setModalOpen(false);
    console.log('Submitting details:', formData);
    let {name, age, gender, agenda} = formData;
    try{
        let response = await contractInstance.methods.addCandidate(name, age, gender, agenda).send({"from": account, "gas": '1000000' });
        console.log("responsefrom addCandidate()>>", response);
        setRefreshKey(oldKey =>oldKey+1);
    }catch(err){
        console.log("couldnt add candidate>>", err);
    }

  }

  const calculateResults = async() =>{
    try{
      setPercentages([]);
      let response = await contractInstance.methods.computeElectionResult().send({"from": account, "gas": '1000000' });
      let basisPointsArray = response.events.resultsReady.returnValues[0];
      console.log("response from calculateREsults>", basisPointsArray);
      let percentagePromise = basisPointsArray.map(async(item, index) => {
        let candidateName = await contractInstance.methods.candidates(index+1).call({"from": account, "gas": '1000000' });
        console.log("candidate Name>", candidateName.name);
        let newValue = Web3.utils.toNumber(item)/10;

        setPercentages(oldValues => {
          const newValues = [...oldValues, {percentage: newValue, candidateName: candidateName.name}];
          
          // Returning the new state object
          return newValues;
        });
      });
      await Promise.all(percentagePromise);
      console.log("Percentages>>", percentages);
      showResultsModal();
      
    }catch(err){
      console.error("Failed to compute results>>", err);
      
    }
  }

  const showResultsModal = () => setResultsModal(true);
  const hideResultsModal = () => setResultsModal(false);

  return (
    <div>
      <h3>Owner Actions -</h3>
      <Button onClick={addCandidate} id="add-candidate" variant="outline-info">
        Add New Candidate
      </Button>
      <br />
      <Button onClick={calculateResults} id="calculate-results" variant="outline-success">
        Calculate Results
      </Button>

      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAgenda">
              <Form.Label>Agenda</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter candidate's agenda"
                name="agenda"
                value={formData.agenda}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={submitDetails}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={resultsModal} onHide={hideResultsModal}>
      <Modal.Header closeButton>
        <Modal.Title>Election Results</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Candidate #</th>
              <th>Candidate Name</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {percentages.map((value, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{value.candidateName}</td>
                <td>{value.percentage}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideResultsModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
}

export default AddCandidate;
