import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const AddCandidate = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', gender: '', agenda: '' });
  let {contractInstance, account, setRefreshKey} = props;
//   console.log("Props in add candidate>", props);
  const [eventData, setEventData] = useState([]);

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
      let response = await contractInstance.methods.computeElectionResult().send({"from": account, "gas": '1000000' });
      console.log("response from calculateREsults>", response);

    }catch(err){
      console.error("Failed to compute results>>", err);
      
    }
  }

  useEffect(() => {
    const listenToEvent = async () => {
      try {
        // Subscribe to the event
        console.log("entered fundsTransferred event>");
        contractInstance.events.allEvents({}, (error, result) => {
          if (!error) {
            console.log('Event data:', result.returnValues);
            setEventData((prevData) => [...prevData, result.returnValues]);
          } else {
            console.error('Error listening to event:', error);
          }
        });
      } catch (error) {
        console.error('Error setting up event listener:', error);
      }
    };

    listenToEvent();
  }, []);

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
    </div>
  );
}

export default AddCandidate;
