import React from "react";


export class TableTwoColsCpn extends React.Component<{ data: KeyValue[] }> {
    render() {
        return (<table style={{tableLayout: "fixed", width: "95%"}}>
            <tbody>
            {this.props.data.map(e => (
                <tr key={e.Key}>
                    <td>{e.Key}:</td>
                    <td style={{}}>{e.Val}</td>
                </tr>
            ))}
            </tbody>
        </table>);
    }
}

export interface KeyValue {
    Key: string
    Val: any
}

export interface Table {
    RowKey: string
    Columns: KeyValue[], // Key is coll name in data, Value is column name on screen
    Rows: Record<string, any>[] // array of map column name to row value
}

export class TableCpn extends React.Component<Table> {
    render() {
        return (<table style={{width: "95%"}}>
            <tbody>
            <tr>
                <td>{this.props.RowKey}</td>
                {this.props.Columns.map((coll) => (
                    <td>coll.Key</td>
                ))}
            </tr>
            {this.props.Rows.map((e) => (
                <tr key={e[this.props.RowKey]}>
                    <td>e[this.props.RowKey]</td>
                    {this.props.Columns.map((coll) => (
                        <td>e[coll.Value]</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>);
    }
}
