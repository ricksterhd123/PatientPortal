/* jshint esversion: 6 */

class IndexNavigation extends React.Component {
    render(){
        return <div id={this.props.id}>
            <h1 id="name">{this.props.name}</h1>
            <div id="links">
                <a id="appointments" className="big-button" href="/appointments">Appointments</a>
                <a id="contact" className="big-button" href="/contact">Contact GP</a>
                <a id="symptoms" className="big-button" href="https://www.google.com/">Symptom search</a>
                <a id="settings" className="big-button" href="/settings">Settings</a>
            </div>
            <a id="logout" href="/api/logout">Logout</a>
        </div>
    }
}

function showWelcome() {
    const element = <IndexNavigation id="foo" name='Nuffield health center'/>;
    ReactDOM.render(element, document.getElementById("menu"));
}

showWelcome();

