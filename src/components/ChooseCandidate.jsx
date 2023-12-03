const ChooseCandidate = () =>{

    const submitCandidate = async () =>{
        console.log("clicked submit");
    }

    return (
        <form onSubmit={submitCandidate}>
            <div className="form-group">
            <label htmlFor="candidatesSelect">Select Candidate</label>
            <select className="form-control" id="candidatesSelect">
            </select>
            </div>
            <button type="submit" className="btn btn-primary">Vote</button>
            <hr />
        </form>
    )
}

export default ChooseCandidate;