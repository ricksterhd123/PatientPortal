function Contact(props) {
    return <button id={props.id} className={props.className} onClick={() => {props.onClick(props._id)}}>{props.text}</button>;
}

class Contacts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
            return <div id={this.props.id} className={this.props.className}>
                        <div className="list-group">
                        {this.props.list.map(contact => {
                            return <Contact text={contact.username} className="list-group-item list-group-item-action" onClick={this.props.fn} _id={contact.id}/>;
                        })}
                        </div>
                    </div>;
    }
}

function Message(props) {
    return <p id={props.id} className={props.className}>{props.text}</p>
}

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {rows: 1, inputBox: ""};
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        console.log(e.target.value);
        this.setState({rows: count, inputBox: e.target.value});
    }

    render() {
        return <div id={this.props.id} className={this.props.className}>
            {this.props.list.map(e => <Message text={`[${e.timeStamp}] ${e.fromUser}: ${e.message}`}/>)}
            <div class="form-group">
                <textarea class="form-control" rows="3" onChange={this.handleInput}></textarea>
            </div>
        </div>
    }
}

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.mode  = 
        this.state = {menu: true, selected: false, contacts: [], messages: []}
        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.handleContactSelect = this.handleContactSelect.bind(this);
        this.getMainComponent = this.getMainComponent.bind(this);
        this.getMainControls = this.getMainControls.bind(this);
        this.backHandle = this.backHandle.bind(this);
    }

    /**
     * Create new message
     */
    handleNewMessage(){
        this.setState({menu: false, selected: false});
    }

    /**
     * Select user id to read and write messages to
     * @param {string} id 
     */
    handleContactSelect(id) {
        console.log(id);
        this.setState({menu: false, selected: id})
        this.getMessages();
    }

    /**
     * Go back to initial state
     */
    backHandle(){
        if (!this.state.menu) {
            this.setState({menu: true, selected: false});
        }
    }

    /**
     * Get list of recent contact userIds from /api/messages/contacts
     */
    async getContacts(){
        try {
            let response = await HttpRequest("GET", "/api/messages/contacts", []);
            response = JSON.parse(response);
            
            let contacts = response.result;
            if (contacts && contacts.length > 0) {
                this.setState({contacts: contacts});
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Get messages from /api/messages/id
     */
    async getMessages(){
        if (this.state.menu) {
            this.setState({messages: []});
        } else {
            try {
                let response = await HttpRequest("GET", `/api/messages/from/${this.state.selected}`);
                response = JSON.parse(response);
                console.log(response);
                let messages = response.result;
                if (messages && messages.length > 0) {
                    this.setState({messages: messages});
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    update() {
        this.getContacts();
        this.getMessages();
    }

    getMainComponent() {
        if (this.state.menu) {
            return <Contacts list={this.state.contacts} fn={this.handleContactSelect}/>
        } else {
            return <Messages list={this.state.messages}/>
        }
    }

    getMainControls() {
        if (this.state.menu) {
            return <div><button type="button" class="btn btn-success btn-lg" >Create new message</button>
                        <button type="button" class="btn btn-warning btn-lg" onClick={() => {window.location.href='/'}}>Go back</button>
                    </div>
        } else {
            return <div>
                <button type="button" class="btn btn-success btn-lg">Send message</button>
                <button type="button" class="btn btn-warning btn-lg" onClick={this.backHandle}>Go back</button>
            </div>
        }
    }

    componentDidMount() {
        this.update();
        this.interval = setInterval((self) => {self.update()}, 1000, this);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    render(){
        let component = this.getMainComponent();
        let control = this.getMainControls();

        return <div className="container">
            <h1 id="page-title">Recent contacts</h1>
            {component}
            {control}
        </div>
    }
}
ReactDOM.render(<Menu/>, document.getElementById('messages'));