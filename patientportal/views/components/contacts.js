function Contact(props) {
    return <a id={props.id} className={props.className} href={props.href}>{props.text}</a>;
}

class Contacts extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {list: []};
    }

    async get(){
        try {
            let response = await HttpRequest("GET", "/api/messages/contacts", []);
            response = JSON.parse(response);
            let contacts = response.result;
            if (contacts && contacts.length > 0) {
                this.setState({list: contacts});
            }
        } catch (e) {
            console.error(e);
        }
   
    }

    componentDidMount() {
        this.get();
        this.interval = setInterval((self) => {self.get()}, 10000, this);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    render() {
        return <div id={this.props.id} className={this.props.className}>
            <h1 id="page-title">Recent contacts</h1>
            <div className="list-group">
                {this.state.list.map(contact => {
                    let url = `/contact/${contact.id}`;
                    return <Contact text={contact.username} className="list-group-item list-group-item-action" href={url}/>;
                })}
            </div>
            <button type="button" class="btn btn-success btn-lg" onClick={()=>{window.location.href = "/"}}>Create new message</button>
            <button type="button" class="btn btn-warning btn-lg" onClick={()=>{window.location.href = "/"}}>Go back</button>
        </div>;
    }
}

ReactDOM.render(<Contacts/>, document.getElementById('messages'));