/*
    Login panel component
*/

class LoginPanel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {success:true};
        this.userInputHandle = this.userInputHandle.bind(this);
        this.passInputHandle = this.passInputHandle.bind(this);
        this.submitHandle = this.submitHandle.bind(this);
    }

    userInputHandle(event) {
        this.setState({username: event.target.value})
    }

    passInputHandle(event) {
        this.setState({password: event.target.value})
    }

    submitHandle(event) {
        let xmlHttp = new XMLHttpRequest();
        let self = this;
        xmlHttp.open( "POST", "/login", false);
        xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(this.state.username+":"+this.state.password));
        
        xmlHttp.onload = function (e) {
          if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
              console.log(xmlHttp.responseText);
              let success = JSON.parse(xmlHttp.responseText).success;
              if (success){
                  location.reload();
              } else {
                  self.setState({success:false});
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
        console.log("happened")  // send request, don't care about response
        event.preventDefault()
    }

    render(){
        return <div>
                    <p>{this.state.success?"":"Invalid username or password!"}</p>
                    <input type="text" name="username" placeholder="Username" onChange={this.userInputHandle}></input>
                    <input type="password" name="password" onChange={this.passInputHandle}></input>
                    <button type="submit" value="Login" onClick={this.submitHandle}>Login</button>
                </div>
    }
}

function showLoginPanel(){
    const element = <LoginPanel/>;
    ReactDOM.render(element, document.getElementById("menu"));
}

showLoginPanel();