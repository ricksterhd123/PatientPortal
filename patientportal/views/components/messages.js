function Contact(props) {
    return <button id={props.id} className={props.className} onClick={() => {props.onClick(props.contact)}}>{props.contact.username}</button>;
}

class Contacts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
            return <div id={this.props.id} className={this.props.className}>
                        <div className="list-group">
                            {this.props.list.map(contact => {
                                return <Contact className="list-group-item list-group-item-action" onClick={this.props.fn} contact={contact}/>;
                            })}
                        </div>
                        <div>
                            <button type="button" class="btn btn-success btn-lg" onClick={this.props.newMessageHandle}>Create new message</button>
                            <button type="button" class="btn btn-warning btn-lg" onClick={this.props.backHandle}>Go back</button>
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
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {`Contact: ${this.props.selectedContact? this.props.selectedContact.username : "Select someone to contact"}`}
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {this.props.contacts.map(c => <a onClick={() => {this.props.selectNewContact(c)}} class="dropdown-item">{c.username}</a>)}
                </div>
            </div>
            {this.props.list.map(e => <Message text={`[${e.timeStamp}] ${e.fromUser}: ${e.message}`}/>)}
            <div class="form-group">
                <textarea class="form-control" onChange={this.handleInput}></textarea>
            </div>
            <div class="container">
                <button type="button" class="btn btn-success btn-lg" onClick={() => {this.props.sendHandle}}>Send message</button>
                <button type="button" class="btn btn-warning btn-lg" onClick={this.props.backHandle}>Go back</button>
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
    handleContactSelect(contact) {
        console.log(`Object: ${contact}`);
        this.setState({menu: false, selected: contact})
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
     * Get list of contacts: [{username, id}] from /api/messages/contacts
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
                let response = await HttpRequest("GET", `/api/messages/from/${this.state.selected.id}`);
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
            return <Contacts list={this.state.contacts} fn={this.handleContactSelect} backHandle={()=>{window.location.href="/"}} newMessageHandle={this.handleNewMessage}/>
        } else {
            return <Messages list={this.state.messages} selectedContact={this.state.selected} contacts={this.state.contacts} backHandle={this.backHandle} selectNewContact={this.handleContactSelect}/>
        }
    }

    getMainControls() {
        if (this.state.menu) {
            return 
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
        let components = this.getMainComponent();
        let controls = this.getMainControls();

        return <div className="container">
            <h1 id="page-title">{this.state.menu ? "Contacts" : "Messages"}</h1>
            {components}
            {controls}
        </div>
    }
}
ReactDOM.render(<Menu/>, document.getElementById('messages'));