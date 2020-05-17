// TODO: use HttpRequest async
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
        xmlHttp.open( "POST", "/api/register", true);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xmlHttp.onload = function (e) {
          if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
              console.log(xmlHttp.responseText);
              let json = JSON.parse(xmlHttp.responseText);
              let result = json.result;
              let error = json.error;
              
              if (result){
                  window.location.href = "/";   
              }

              // For now we just expect a boolean
              self.setState({success: result && true || false, error: error});
              setTimeout(self => {
                self.setState({success: true, error: null});
              }, 3000, self);
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
                    <h1 id="page-title" className="display-1">{this.props.title}</h1>
                    <Warning errorMsg="Please use at your own risk!"/>
                    <Warning errorMsg={this.state.error}/>
                    
                    <div className='form-group'>
                      <label htmlFor='input-username'>Username</label>
                      <input id='input-username' className='form-control' type="text" name="username" placeholder="Username" onChange={this.userInputHandle}></input>
                    </div>

                    <div className='form-group'>
                      <label htmlFor='input-password'>Password</label>
                      <input id='input-password' className='form-control' type="password" name="password" onChange={this.passInputHandle}></input>
                    </div>
                    
                    <div className='form-group'>
                      <label htmlFor='input-repeat-password'>Repeat password</label>
                      <input id='input-repeat-password' className='form-control' type="password" name="repeat password" aria-describedby='login-help'></input>
                      <small id="login-help" className="form-text text-muted"><a href="/login">Already registered?</a></small>
                    </div>

                    <button type="submit" className="btn btn-primary" value="Login" onClick={this.submitHandle}>Register</button>
                </div>
    }
}

ReactDOM.render(<RegisterPanel title="The Nuffield Centre GP"/>, document.getElementById("menu"));