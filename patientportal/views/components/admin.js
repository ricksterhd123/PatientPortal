
class AdminPanel extends React.Component {
    render() {
        return <div id={this.props.id} class="container btn-group-vertical">
                <h2>{this.props.title}</h2>
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/admin/users"}}>Manage users</button>
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/contact"}}>Messages</button>
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/admin/appointments"}}>Manage appointments</button>
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/admin/articles"}}>Manage articles</button>
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={()=>{window.location.href = "/settings"}}>Settings</button>
                <button type="button" class="btn btn-danger btn-lg btn-block" onClick={()=>{window.location.href = "/api/logout"}}>Logout</button>
            </div>
    }
}

function showAdminPanel() {
    let adminPanel = <AdminPanel id="admin-panel" title="Admin settings"/>;
    ReactDOM.render(adminPanel, document.getElementById('menu'));
}

showAdminPanel();