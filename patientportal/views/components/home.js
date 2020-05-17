class IndexNavigation extends React.Component {
    
    render(){
        return <div className="container btn-group-vertical">
                <h2>Main menu</h2>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/appointments"}}>Appointments</button>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/messages"}}>Messages</button>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/settings"}}>Settings</button>
                <button type="button" className="btn btn-danger btn-lg btn-block" onClick={()=>{window.location.href = "/api/logout"}}>Logout</button>
            </div>
    }
}

ReactDOM.render(<IndexNavigation/>, document.getElementById("menu"));