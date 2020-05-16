function Row(props) {
    return <td className={props.className} onClick={() => {
        props.fn(props.obj)
    }}>{props.obj.text}</td>
}

function Rows(props) {
    if (props.time && props.items) {
        let hours = new Date(props.time).getHours();
        let minutes = new Date(props.time).getMinutes();
        minutes = minutes > 9 ? minutes.toString() : '0' + minutes;

        let rowTime = <th scope="row">{`${hours}:${minutes}`}</th>
        let items = props.items.map(item => <Row key={item.time} className={item.class} obj={item} fn={props.rowFn} />);
        return <tr>
            {rowTime}
            {items}
        </tr>
    }
}