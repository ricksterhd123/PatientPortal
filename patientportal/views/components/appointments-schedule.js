class AppointmentSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {week: 0};
        this.pagination = this.pagination.bind(this);
        this.columnHeader = this.columnHeader.bind(this);
    }

    pagination() {
        let list = [];
        for (let i = 0; i < noWeeks; i++) {
            list.push(<li className={`page-item ${this.state.week == i ? "active" : ""}`}><a className="page-link" onClick={()=>{this.setState({week: i})}}>{i+1}</a></li>);
        }
        return list;
    }

    columnHeader() {
        let list = [];
        let schedule = this.props.schedule[this.state.week];
        if (schedule) {
            for (let i = 0; i < schedule.length; i++) {
                list.push(<th key={schedule[i].day} scope="col">{schedule[i].day}</th>);
            }
        }
        return list;
    }

    render() {
        let cols = [];
        let schedule = this.props.schedule[this.state.week];
        if (schedule) {
            for (let i = 0; i < slotsEachDay; i++) {
                let time = false;
                let item = []
                for (let j = 0; j < daysEachWeek; j++) {
                    let slot = schedule[j].slots[i];
                    //cols[index].rows = [];
                    time = slot.time;
                    item.push({time: time, text: slot.appointment ? "Booked" : "", class: slot.appointment ? "table-danger" : "", appointment: slot.appointment});
                }
                cols.push({time: time, items: item})
            }
        }

        return <div>
            <h2>Schedule</h2>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className={`page-item ${this.state.week <= 0 ? "disabled" : ""}`}><a className="page-link" onClick={()=>{this.setState({week: (this.state.week-1)%noWeeks})}}>Previous</a></li>
                    {this.pagination()}
                    <li className={`page-item ${this.state.week >= noWeeks - 1 ? "disabled" : ""}`}><a className="page-link" onClick={()=>{this.setState({week: (this.state.week+1)%noWeeks})}}>Next</a></li>
                </ul>
            </nav>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        {this.columnHeader()}
                    </tr>
                </thead>
                <tbody>
                    {cols.map((value) =>
                        <Rows key={value.time} time={value.time} items={value.items} rowFn={this.props.handleClick} />
                    )}
                </tbody>
            </table>
            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.props.backHandle}>Go back</button>
        </div>
    }
}