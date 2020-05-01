/* jshint esversion: 8 */

class RegisterPanel extends React.Component{
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
        xmlHttp.open( "POST", "/api/register", false);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xmlHttp.onload = function (e) {
          if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
              console.log(xmlHttp.responseText);
              let success = JSON.parse(xmlHttp.responseText).success;
              if (success){
                  window.location.href = "/";
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
        xmlHttp.send( JSON.stringify({username: this.state.username, password: this.state.password}) );
        event.preventDefault();
    }

    render(){
        return <div>
                    <h1>The Nuffield Center GP</h1>
                    <p>{this.state.success?"":"Could not register, please try a different username"}</p>
                    <p>WARNING: This is for demonstration purposes only, please use at your own risk!</p>
                    <p>Username:</p>
                    <input type="text" name="username" placeholder="Username" onChange={this.userInputHandle}></input>
                    <p>Password:</p>
                    <input type="password" name="password" onChange={this.passInputHandle}></input>
                    <p>Repeat password:</p>
                    <input type="password" name="repeat password"></input>
                    <button type="submit" value="Login" onClick={this.submitHandle}>Login</button>
                    <p>Not registered?</p>
                    <a href="/register">Sign up</a>
                </div>
    }
}

function showRegisterPanel(){
    const element = <RegisterPanel/>;
    ReactDOM.render(element, document.getElementById("menu"));
}

showRegisterPanel();