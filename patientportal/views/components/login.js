// TODO: use HttpRequest async
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
        xmlHttp.open( "POST", "/api/login", true);
        xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(this.state.username+":"+this.state.password));
        xmlHttp.onload = function (e) {
          if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
              console.log(xmlHttp.responseText);
              let json = JSON.parse(xmlHttp.responseText)
              let result = json.result;
              let error = json.error;

              if (result){
                window.location.href = "/";
              } else {
                self.setState({success: result, error: error});
                // Wait 3 seconds before hiding the warning message
                setTimeout(self => {
                  self.setState({success: true, error: null});
                }, 3000, self);
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
                    <h1>{this.props.title}</h1>
                    <Warning errorMsg={this.state.error}/>

                    <div className='form-group'>
                      <label htmlFor="input-username">Username</label>
                      <input id="input-username" className="form-control" type="text" name="username" placeholder="Username" onChange={this.userInputHandle}></input>
                    </div>

                    <div className='form-group'>
                      <label htmlFor='input-password'>Password</label>
                      <input type="password" className='form-control' id='input-password' name="password" aria-describedby='register-help' onChange={this.passInputHandle}></input>
                      <small id="register-help" className="form-text text-muted"><a href="/register">Not logged in?</a></small>
                    </div>
                    
                    <button type="submit" value="Login" className="btn btn-primary" onClick={this.submitHandle}>Login</button>
                </div>
    }
}

ReactDOM.render(<LoginPanel title="The Nuffield Centre GP"/>, document.getElementById("menu"));