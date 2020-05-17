class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {user: false, message: false, password: false, newPassword: false, repeatPassword: false, class: false};
    this.onCurrentPasswordChange = this.onCurrentPasswordChange.bind(this);
    this.onNewPasswordChange = this.onNewPasswordChange.bind(this);
    this.onRepeatPasswordChange = this.onRepeatPasswordChange.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  setMessage(message, error) {
    this.setState({message: message});
    if (error) {
      this.setState({class: 'alert alert-danger'});
    } else {
      this.setState({class: 'alert alert-success'})
    }
    setTimeout((self) => {self.setState({message: false, class: false})}, 2000, this);  // Reset after 2 seconds
  }

  async changePassword() {
    try {
      if (this.newPassword == this.repeatPassword) {
      let response = await HttpRequest("POST", "/api/settings/password", [], JSON.stringify({password: this.state.password, newPassword: this.state.newPassword}));
      response = JSON.parse(response);
      let result = response.result;
      console.log(response.result);
      if (result) {
        this.setMessage("Successfully changed password!", false);
      } else {
        this.setMessage("Invalid password", true);
      }
      this.setState({password: false, newPassword: false, repeatPassword: false})
      } else {
        this.setMessage("Passwords don't not match", true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  onCurrentPasswordChange(event) {
    this.setState({password: event.target.value});
  }

  onNewPasswordChange(event) {
    this.setState({newPassword: event.target.value});
  }

  onRepeatPasswordChange(event) {
    this.setState({repeatPassword: event.target.value});
  }

  async update() {
    try {
      let response = await HttpRequest("GET", "/api/settings/get");
      response = JSON.parse(response);
      let user = response.result;
      this.setState({user: user});
    } catch (error) {
      console.error(error);
    }
  }
  /**
  * Run this code when the component has been mounted to DOM.
  */
  componentDidMount() {
    this.update();
    this.interval = setInterval((self) => { self.update() }, 1000, this);
  }

  /**
   * Run this code when the component is unmounted from DOM.
   */
  componentWillUnmount() {
      clearInterval(this.interval);
  }

  render() {
    return <div>
      <h2>User account</h2>
      {this.state.user?<h3>Username: {this.state.user.username}</h3>:""}
      <h3>Password:</h3>
      <form>
      {this.state.message ? <div className={this.state.class ? this.state.class : ""} role="alert">{this.state.message}</div> : ""}

        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Current password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" onChange={this.onCurrentPasswordChange} value={this.state.password ? this.state.password : ""}/>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword2">New password</label>
          <input type="password" className="form-control" id="exampleInputPassword2" onChange={this.onNewPasswordChange} value={this.state.newPassword ? this.state.newPassword : ""}/>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword3">Repeat new password</label>
          <input type="password" className="form-control" id="exampleInputPassword3" onChange={this.onRepeatPasswordChange} value={this.state.repeatPassword ? this.state.repeatPassword : ""}/>
        </div>
      </form>
      <button className="btn btn-primary" onClick={this.changePassword}>Change password</button>
      <button type="button" className="btn btn-danger btn-lg btn-block" onClick={()=>{window.location.href = "/"}}>Back</button>
    </div>
  }
}

ReactDOM.render(<Settings/>, document.getElementById("menu"));