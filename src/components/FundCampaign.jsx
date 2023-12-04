import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const FundCampaign = (props) =>{
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({amount: 0});

    const openModal = ()=>{
        setModalOpen(true);
        
    }
    
    const closeModal = () => {
        // Close the modal and reset the form data
        setModalOpen(false);
        setFormData({ amount: 0 });
    }
    
    const submitDetails = async() =>{
        try{
            let addFunds = await props.contractInstance.methods.addFunds(formData.amount).send({"from": props.account, "gas": '1000000' });
            console.log("funds added successfully>", addFunds);
            setModalOpen(false);
            props.setRefreshKey(oldKey=>oldKey+1);

        }catch(err){
            console.error("Error while adding funds>>", err);
        }

    }

    const handleInputChange = (e)=>{
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return(
            <div>
              <Button onClick={openModal} id="add-funds" variant="success">
                Add Funds
              </Button>
        
              <Modal show={isModalOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Funds to enhance your influence</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formAmt">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeModal}>
                    Close
                  </Button>
                  <Button variant="success" onClick={submitDetails}>
                    Transfer
                  </Button>
                </Modal.Footer>
              </Modal>
              <p style={{ fontSize: 'small', marginTop: '5px', userSelect: 'none' }}>Adding funds will increase the influence of your vote. However, everyone can vote only once. </p>
            </div>
    );
}

export default FundCampaign;