function Message(props) {
    return <p className={props.className}>{props.text}</p>;
}

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {messageList: []};
    }

    async getMessages(){
        try {
            let response = await HttpRequest("GET", "/api/messages", []);
            console.log(response);
            response = JSON.parse(response);
            let messages = response.result.messages;
            console.log(messages);
            if (messages && messages.length > 0) {
                this.setState({messageList: messages});
            }
        } catch (e) {
            console.error(e);
        }
   
    }

    componentDidMount() {
        this.getMessages();
        this.interval = setInterval((self) => {self.getMessages()}, 10000, this);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    render() {
        return <div id={this.props.id} className={this.props.className}>
            <h1 id="page-title">Recent contacts</h1>
            <div className="list-group">
                {this.state.messageList.map(message => <Message key={message.id} text={message.text} className="list-group-item list-group-item-action"/>)}
            </div>
            <button type="button" class="btn btn-success btn-lg" onClick={()=>{window.location.href = "/"}}>Create new message</button>
            <button type="button" class="btn btn-warning btn-lg" onClick={()=>{window.location.href = "/"}}>Go back</button>
        </div>;
    }
}

ReactDOM.render(<Messages/>, document.getElementById('messages'));