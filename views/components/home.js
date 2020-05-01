class IndexNavigation extends React.Component {
    render(){
        return <div id="links">
                <a id="appointments" className="big-button" href="/appointments">Appointments</a>
                <a id="contact" className="big-button" href="/contact">Contact GP</a>
                <a id="symptoms" className="big-button" href="https://www.google.com/">Symptom search</a>
                <a id="settings" className="big-button" href="/settings">Settings</a>
            </div>
    }
}

function showWelcome() {
    const element = <IndexNavigation/>;
    ReactDOM.render(element, document.getElementById("menu"));
}

showWelcome();

