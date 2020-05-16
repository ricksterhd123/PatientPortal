class CancelAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div>
        <h2>Sure you want to cancel the appointment?</h2>
        <button type="button" className="btn btn-primary btn-lg" onClick={() => {this.props.confirm(this.props.appointment)}}>Yes</button>
        <button type="button" className="btn btn-primary btn-lg" onClick={() => {this.props.backHandle(this.props.appointment)}}>Cancel</button>
        </div>;
    }
}