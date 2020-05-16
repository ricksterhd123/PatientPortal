
class AdminPanel extends React.Component {
    render() {
        return <div id={this.props.id} className="container btn-group-vertical">
                <h2>{this.props.title}</h2>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/admin/users"}}>Manage users</button>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/messages"}}>Messages</button>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/admin/articles"}}>Manage articles</button>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/settings"}}>Settings</button>
                <button type="button" className="btn btn-danger btn-lg btn-block" onClick={()=>{window.location.href = "/api/logout"}}>Logout</button>
            </div>
    }
}

ReactDOM.render(<AdminPanel id="admin-panel" title="Admin settings"/>, document.getElementById('menu'));