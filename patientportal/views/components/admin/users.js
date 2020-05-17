const Roles = ["user", "doctor", "admin"];

class ManageUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {users: []};
  }

  async update() {
    try {
      let response = await HttpRequest('GET', '/api/admin/users');
      response = JSON.parse(response);
      let users = response.result;
      this.setState({users: users || []});
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

  async updateUserRole(user, role) {
    let i = Roles.findIndex((r)=>{return role == r;});
    if (i != -1) {
      try {
        let response = await HttpRequest('POST', '/api/admin/users', [], JSON.stringify({_id: user._id, role: role}));
        response = JSON.parse(response);
        let result = response.result;
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
  }

  render() {
    return <div>
      {this.state.users.map(u => <div key={u._id}>
        <p>ID: {u._id}</p>
        <p>Username: {u.username}</p>
        <p>Role: </p> 
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Role: {u.options.role}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {Roles.map(r => <a key={u._id.toString()+r}className="dropdown-item" onClick={()=>{this.updateUserRole.bind()(u, r)}}>{r}</a>)}
          </div>
        </div>
      </div>)}
      <button type="button" className="btn btn-danger btn-lg btn-block" onClick={()=>{window.location.href = "/"}}>Back</button>
    </div>
  }
}