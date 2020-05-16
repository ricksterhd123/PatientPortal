class AppointmentSlots extends React.Component {
    constructor(props) {
        super(props);
        this.state = {week: 0};
        this.pagination = this.pagination.bind(this);
        this.columnHeader = this.columnHeader.bind(this);
    }
    
    pagination() {
        let list = [];
        for (let i = 0; i < noWeeks; i++) {
            list.push(<li  className={`page-item ${this.state.week == i ? "active" : ""}`}><a className="page-link" onClick={()=>{this.setState({week: i})}}>{i+1}</a></li>);
        }
        return list;
    }

    columnHeader() {
        let list = [];
        let schedule = this.props.slots[this.state.week];
        if (schedule) {
            for (let i = 0; i < schedule.length; i++) {
                list.push(<th key={schedule[i].day} scope="col">{schedule[i].day}</th>);
            }
        }
        return list;
    }

    render() {
        let cols = [];
        let schedule = this.props.slots[this.state.week];
        console.log(schedule);
        // console.log(this.state.week);
        // console.log(this.props.slots);
        if (schedule) {
            for (let i = 0; i < slotsEachDay; i++) {
                let item = [];
                let time = false;
                for (let j = 0; j < daysEachWeek; j++) {
                    let slot = schedule[j].slots[i];
                    let className = "table-success";
                    let text = "Free";
                    let appointments = slot.appointments;
                    time = slot.time; 

                    if (slot.full) {
                        text = "Fully booked";
                        className = "table-danger";
                        appointments = false;
                    } else if (time - new Date() < 0) {
                        text = "";
                        className = "table-dark";
                        appointments = false;
                    }
                    // Time here is used to get time of the appointment selected
                    item.push({time: time, text: text, class: className, appointments: appointments});
                }
                // Time here is used for the row labels
                cols.push({time: time, items: item })
            }
        }

        return <div>
            <h2>Click a slot to book it</h2>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li key={0} className={`page-item ${this.state.week <= 0 ? "disabled" : ""}`}><a className="page-link" onClick={()=>{this.setState({week: (this.state.week-1)%noWeeks})}}>Previous</a></li>
                    {this.pagination()}
                    <li key={3} className={`page-item ${this.state.week >= noWeeks - 1 ? "disabled" : ""}`}><a className="page-link" onClick={()=>{this.setState({week: (this.state.week+1)%noWeeks})}}>Next</a></li>
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
            <button type="button" className="btn btn-danger btn-lg btn-block" onClick={this.props.backHandle}>Go back</button>
        </div>
    }
}