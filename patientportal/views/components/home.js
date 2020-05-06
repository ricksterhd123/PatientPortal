class IndexNavigation extends React.Component {
    
    render(){
        return <div class="container btn-group-vertical">
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/symptoms"}}>How are you feeling?</button>
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/appointments"}}>Appointments</button>
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/messages"}}>Messages</button>
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/settings"}}>Settings</button>
                <button type="button" class="btn btn-danger btn-lg btn-block" onClick={()=>{window.location.href = "/api/logout"}}>Logout</button>
            </div>
    }
}

function showWelcome() {
    const element = <IndexNavigation/>;
    ReactDOM.render(element, document.getElementById("menu"));
}

showWelcome();

