/*
Simple example of component usage in react using jsx
 */

class MenuBar extends React.Component {
    render(){
        return <div id={this.props.id}>
            <h1> {this.props.name}</h1>
            <ul>
            <li><a href="/appointments.html">Appointments</a></li>
            <li><a href="/contact.html">Contact GP</a></li>
            <li><a href="/">Not implemented</a></li>
            <li><a href="/settings.html">Settings</a></li>
            </ul>
        </div>
    }
}

function showWelcome() {
    const element = <MenuBar id="foo" name='Ricky Claven'/>;
    ReactDOM.render(element, document.getElementById("menu"));
}