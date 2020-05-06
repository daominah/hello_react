import React from 'react';
import {TableCpn} from "./table";

export class PriceBoardCpn extends React.Component {
    render() {
        let rowKey = "code";
        let colsOrder = [
            {Key: "referencePrice", Val: "RefPx"},
            {Key: "ceilingPrice", Val: "Ceiling"},
            {Key: "floorPrice", Val: "Floor"},
            {Key: "tradingVolume", Val: "TradedVol"},
            {Key: "bidOfferList[2].bidPrice", Val: "Bid3Px"},
            {Key: "bidOfferList[2].bidVolume", Val: "Bid3Vol"},
            {Key: "bidOfferList[1].bidPrice", Val: "Bid2Px"},
            {Key: "bidOfferList[1].bidVolume", Val: "Bid2Vol"},
            {Key: "bidOfferList[0].bidPrice", Val: "Bid1Px"},
            {Key: "bidOfferList[0].bidVolume", Val: "Bid1Vol"},
            {Key: "last", Val: "MatchPx"},
            {Key: "matchingVolume", Val: "MatchVol"},
            {Key: "rate", Val: "+/-"},
            {Key: "bidOfferList[0].offerPrice", Val: "Bid3Px"},
            {Key: "bidOfferList[0].offerVolume", Val: "Bid3Vol"},
            {Key: "bidOfferList[1].offerPrice", Val: "Bid2Px"},
            {Key: "bidOfferList[1].offerVolume", Val: "Bid2Vol"},
            {Key: "bidOfferList[2].offerPrice", Val: "Bid1Px"},
            {Key: "bidOfferList[2].offerVolume", Val: "Bid1Vol"},
        ];
        return (
            <div>
                <h1>Securities Price Board</h1>
                <TableCpn RowKey={rowKey}
                          Columns={colsOrder}
                          Rows={[{code: "AAA"}, {code: "AAB"}, {code: "ZZZ"}]}
                />
            </div>
        )
    }
}

interface PriceBoard {
    rows: Record<string, any>[]
}