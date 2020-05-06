import React from 'react';
import {TableCpn} from "./table";

export class PriceBoardCpn extends React.Component {
    state: Record<string, PriceRow>;

    constructor(props: any) {
        super(props);
        let symbol1 = Object.assign({}, defaultPriceRow);
        symbol1.code = "ACB";
        this.state = {"ZZZ": defaultPriceRow, "ACB": symbol1};
        // this.state = {};
        fetch("http://127.0.0.1:8000/security")
            .then((resp) => {
                resp.json().then((body: PriceRow[]) => {
                    console.log("pussy", body);
                    body.map((v: PriceRow) => {
                        this.state[v.code] = v
                    });
                    this.setState(this.state)
                })
            })
            .catch(err => {
            });
        let socket = new WebSocket("ws://127.0.0.1:8001/");
        socket.onopen = function (event) {
            console.log("ws connected");
        };
        socket.onerror = function (event) {
            console.log(`[error]: `, event);
        };
        socket.onmessage = (event) => {
            let msg = event.data;
            // console.log(`ws message: `, msg);
            let data: PriceRow = JSON.parse(msg);
            console.log(`ws data: `, data);
            this.state[data.code] = data;
            this.setState(this.state);
        }
    }

    render() {
        console.log("about to render PriceBoardCpn");
        return (<div>
            <h1>Securities Price Board</h1>
            <table>
                <tbody>
                <PriceRowCpn isFirstRow={true} data={defaultPriceRow}/>
                {Object.keys(this.state).map(k =>
                    <PriceRowCpn isFirstRow={false} data={this.state[k]}/>
                )}
                </tbody>
            </table>
        </div>)
    }
}

export class PriceRowCpn extends React.Component<{
    isFirstRow: boolean,
    data: PriceRow,
}> {
    render() {
        let [bid3Px, bid3Vol, bid2Px, bid2Vol, bid1Px, bid1Vol] = [0, 0, 0, 0, 0, 0];
        let [ask3Px, ask3Vol, ask2Px, ask2Vol, ask1Px, ask1Vol] = [0, 0, 0, 0, 0, 0];
        if (this.props.data.bidOfferList) {
            if (this.props.data.bidOfferList[2]) {
                bid3Px = this.props.data.bidOfferList[2].bidPrice;
                bid3Vol = this.props.data.bidOfferList[2].bidVolume;
            }
            if (this.props.data.bidOfferList[1]) {
                bid2Px = this.props.data.bidOfferList[1].bidPrice;
                bid2Vol = this.props.data.bidOfferList[1].bidVolume;
            }
            if (this.props.data.bidOfferList[0]) {
                bid1Px = this.props.data.bidOfferList[0].bidPrice;
                bid1Vol = this.props.data.bidOfferList[0].bidVolume;
            }
            if (this.props.data.bidOfferList[2]) {
                ask3Px = this.props.data.bidOfferList[2].offerPrice;
                ask3Vol = this.props.data.bidOfferList[2].offerVolume;
            }
            if (this.props.data.bidOfferList[1]) {
                ask2Px = this.props.data.bidOfferList[1].offerPrice;
                ask2Vol = this.props.data.bidOfferList[1].offerVolume;
            }
            if (this.props.data.bidOfferList[0]) {
                ask1Px = this.props.data.bidOfferList[0].offerPrice;
                ask1Vol = this.props.data.bidOfferList[0].offerVolume;
            }
        }
        let columns = [
            {Key: "Symbol", Val: this.props.data.code},
            {Key: "RefPx", Val: this.props.data.referencePrice},
            {Key: "Ceiling", Val: this.props.data.ceilingPrice},
            {Key: "Floor", Val: this.props.data.floorPrice},
            {Key: "TradedVol", Val: this.props.data.tradingVolume},
            {Key: "Bid3Px", Val: bid3Px},
            {Key: "Bid3Vol", Val: bid3Vol},
            {Key: "Bid2Px", Val: bid2Px},
            {Key: "Bid2Vol", Val: bid2Vol},
            {Key: "Bid1Px", Val: bid1Px},
            {Key: "Bid1Vol", Val: bid1Vol},
            {Key: "MatchPx", Val: this.props.data.last},
            {Key: "MatchVol", Val: this.props.data.matchingVolume},
            {Key: "+/-", Val: this.props.data.rate},
            {Key: "Ask1Px", Val: ask1Px},
            {Key: "Ask1Vol", Val: ask1Vol},
            {Key: "Ask2Px", Val: ask2Px},
            {Key: "Ask2Vol", Val: ask2Vol},
            {Key: "Ask3Px", Val: ask3Px},
            {Key: "Ask3Vol", Val: ask3Vol},
        ];
        if (this.props.isFirstRow) {
            return (<tr key="theFirstRow">
                {columns.map(v => (
                    <td key={v.Key}>{v.Key}</td>
                ))}
            </tr>)
        }
        console.log(`about to render ${this.props.data.code}`);
        if (this.props.data.code === "ACB") {
            console.log(`this.props.data: `, this.props.data, `columns: `, columns)
        }
        return (<tr key={this.props.data.code}>
            {columns.map(v => (
                <td key={v.Key}>{v.Val}</td>
            ))}
        </tr>)
    }
}

interface PriceRow {
    code: string // Symbol
    type: string // SecurityType
    securitiesType: string // SecuritySubType
    referencePrice: number,
    ceilingPrice: number,
    floorPrice: number,
    tradingVolume: number, // TotalTradedVolume
    last: number, // matchingPrice
    matchingVolume: number,
    rate: number,
    bidOfferList: {
        bidPrice: number,
        bidVolume: number,
        offerPrice: number,
        offerVolume: number,
    }[],
}

const defaultPriceRow: PriceRow = {
    code: "ZZZ", type: "STOCK", securitiesType: "STOCK",
    referencePrice: 0, ceilingPrice: 0, floorPrice: 0, tradingVolume: 0,
    last: 0, matchingVolume: 0, rate: 0, bidOfferList: [],
};