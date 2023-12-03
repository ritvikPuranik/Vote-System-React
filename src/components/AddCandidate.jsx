import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const AddCandidate = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', gender: '', agenda: '' });
  let {contractInstance, account} = props;
//   console.log("Props in add candidate>", props);

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
        console.log(contractInstance.methods);
        // let owner = await contractInstance.methods.owner().send({"from": account, "gas": 30000000});
        let response = await contractInstance.methods.addCandidate(name, age, gender, agenda).send({"from": account, "gas": 3000000 });
        console.log("response>>", response);
    }catch(err){
        console.log("couldnt add candidate>>", err);
    }

  }

  return (
    <div>
      <Button onClick={addCandidate} id="add-candidate" variant="primary">
        Add New Candidate
      </Button>

      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form for user input */}
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
