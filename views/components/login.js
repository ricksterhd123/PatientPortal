class LoginPanel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {success:true};
        this.userInputHandle = this.userInputHandle.bind(this);
        this.passInputHandle = this.passInputHandle.bind(this);
        this.submitHandle = this.submitHandle.bind(this);
    }

    userInputHandle(event) {
        this.setState({username: event.target.value});
    }

    passInputHandle(event) {
        this.setState({password: event.target.value});
    }

    submitHandle(event) {
        let xmlHttp = new XMLHttpRequest();
        let self = this;
        xmlHttp.open( "POST", "/api/login", false);
        xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(this.state.username+":"+this.state.password));
        
        xmlHttp.onload = function (e) {
          if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
              console.log(xmlHttp.responseText);
              let json = JSON.parse(xmlHttp.responseText)
              let success = json.success;
              let error = json.error;

              if (success){
                window.location.href = "/";
              } else {
                self.setState({success: success, error: error});
              }
            } else {
              console.error(xmlHttp.statusText);
            }
          }
        };
        xmlHttp.onerror = function (e) {
          console.error(xhr.statusText);
        };
        xmlHttp.send( null );
        event.preventDefault();
    }

    render(){
        return <div>
                    <h1>The Nuffield Center GP</h1>
                    <p>{this.state.success?"":this.state.error}</p>
                    <p>Username:</p>
                    <input type="text" name="username" placeholder="Username" onChange={this.userInputHandle}></input>
                    <p>Password:</p>
                    <input type="password" name="password" onChange={this.passInputHandle}></input>
                    <button type="submit" value="Login" onClick={this.submitHandle}>Login</button>
                    <p>Not registered?</p>
                    <a href="/register">Sign up</a>
                </div>
    }
}

function showLoginPanel(){
    const element = <LoginPanel/>;
    ReactDOM.render(element, document.getElementById("menu"));
}

showLoginPanel();