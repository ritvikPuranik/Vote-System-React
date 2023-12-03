import React from "react";

const ElectionTable = () =>{
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
            </tbody>
          </table>
          <hr/>
          <p id="accountAddress" className="text-center"></p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ElectionTable;