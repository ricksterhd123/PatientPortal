
class AdminPanel extends React.Component {
    render() {
        return <div id={this.props.id}>
            <h1>Admin settings</h1>
            <div id="links">
                <a id="admin-users" className="big-button" href="/admin/users">Manage users</a>
                <a id="admin-schedules" className="big-button" href="/admin/schedules">Manage schedules</a>
                <a id="admin-messages" className="big-button" href="/admin/messages">Manage messages</a>
                <a id="admin-appointments" className="big-button" href="/admin/appointments">Manage appointments</a>
                <a id="admin-settings" className="big-button" href="/admin/settings">Misc</a>
            </div>
        </div>
    }
}

function showAdminPanel() {
    let adminPanel = <AdminPanel id="admin-panel"/>;
    ReactDOM.render(adminPanel, document.getElementById("admin-menu"));
}

showAdminPanel();