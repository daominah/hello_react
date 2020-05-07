import React from 'react';

export class PriceBoardCpn extends React.Component {
    state: {
        prices: Record<string, PriceRow>,
        wsConn?: WebSocket,
    };

    constructor(props: any) {
        super(props);
        this.disconnectWS = this.disconnectWS.bind(this);
        this.state = {prices: {}};
        fetch("http://127.0.0.1:8000/security")
            .then((resp) => {
                resp.json().then((body: PriceRow[]) => {
                    console.log("fetched pussy", body);
                    body.forEach((v: PriceRow) => {
                        this.state.prices[v.code] = v;
                    });
                    this.setState(this.state)
                })
            })
            .catch(err => {
            });

        let wsConn = new WebSocket("ws://127.0.0.1:8001/");
        wsConn.onopen = (event) => {
            console.log("ws connected");
        };
        wsConn.onerror = (event) => {
            this.state.wsConn = undefined;
            console.log(`error or close: `, event);
        };
        wsConn.onclose = wsConn.onerror;
        wsConn.onmessage = (event) => {
            // console.log(`ws message: `, e);
            // console.log(`ws event.data: `, event.data);
            let xData: PriceRow;
            let xMsgV2: XPriceRowV2 = JSON.parse(event.data);
            xData = xMsgV2.data;
            if (Array.isArray(xData)) { // techX ver 1 format
                let xMsgV1: XPriceRowV1 = JSON.parse(event.data);
                if (xMsgV1.data.length === 0) {
                    return
                }
                xData = xMsgV1.data[0];
            }
            console.log(`xData ${xData.code}: `, xData);
            if (!this.state.prices[xData.code]) return; // only update predefined symbol
            console.log(`update for symbol ${xData.code}`);
            let update = Object.assign({}, this.state.prices[xData.code]);
            Object.assign(update, xData);
            this.state.prices[xData.code] = update;
            this.setState(this.state);
        };
        this.state.wsConn = wsConn
    }

    render() {
        console.log("about to render PriceBoardCpn");
        return (<div>
            <h1>Securities Price Board</h1>
            <button onClick={this.disconnectWS}>Disconnect</button>
            <br/><br/>
            <table>
                <tbody>
                <PriceRowCpn key="firstRow"
                             isFirstRow={true} data={defaultPriceRow}/>
                {Object.keys(this.state.prices).concat().sort()
                    .map(key =>
                        <PriceRowCpn key={key}
                                     isFirstRow={false}
                                     data={this.state.prices[key]}/>
                    )}
                </tbody>
            </table>
        </div>)
    }

    disconnectWS() {
        if (this.state.wsConn) {
            this.state.wsConn.close();
        }
    }
}

export class PriceRowCpn extends React.Component<PriceRowProps> {
    state: PriceRowState;

    constructor(props: any) {
        super(props);
        this.state = {cssClass: "flashOff", lastTotalTradedVol: 0};
    }

    componentWillReceiveProps(nextProps: PriceRowProps) {
        if (nextProps.data.tradingVolume !== this.state.lastTotalTradedVol) {
            this.state.cssClass = "flash"
        }
        this.state.lastTotalTradedVol = nextProps.data.tradingVolume
    }

    componentDidUpdate() {
        if (this.state.cssClass == "flash") {
            setTimeout(() => {
                this.setState({cssClass: "flashOff"});
            }, 500);
        }
    }

    shouldComponentUpdate(nextProps: PriceRowProps, nextState: PriceRowState): boolean {
        return (this.props.data !== nextProps.data) ||
            this.state.cssClass !== nextState.cssClass;
    }

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
        let columns: { Key: string, Val: any }[] = [
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
            {Key: "Session", Val: this.props.data.session},
            {Key: "ExpectPx", Val: this.props.data.expectedPrice},
        ];
        columns.forEach((v) => {
            if (this.props.isFirstRow) {
                v.Val = v.Key
            }
            if (typeof(v.Val) == "number") {
                v.Val = Math.round(v.Val * 100) / 100
            }
        });
        console.log(`about to render row ${this.props.data.code}`);
        return (<tr className={this.state.cssClass} key={this.props.data.code}>
            {columns.map(v => (
                <td key={v.Key}>{v.Val}</td>
            ))}
        </tr>)
    }
}

interface PriceRowProps {
    isFirstRow: boolean,
    data: PriceRow,
}

interface PriceRowState {
    cssClass: string
    lastTotalTradedVol: number
}

interface XPriceRowV1 {
    sourceId: string
    data: PriceRow[]
}

interface XPriceRowV2 {
    sourceId: string
    data: PriceRow
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
    expectedPrice: number,
    session: string,
}

const defaultPriceRow: PriceRow = {
    code: "ZZZ", type: "STOCK", securitiesType: "STOCK",
    referencePrice: 0, ceilingPrice: 0, floorPrice: 0, tradingVolume: 0,
    last: 0, matchingVolume: 0, rate: 0, bidOfferList: [],
    expectedPrice: 0, session: "",
};
