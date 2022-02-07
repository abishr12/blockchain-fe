import "./App.css";
import { useEffect, useState } from "react";
import { SearchBar, Transaction } from "./components";
import { Txn, Prices, CustodialTxn, CryptoTxn } from "./types";

const BTC_SATS = 100000000;
const WEI_ETH = 10 ** 18;

const getTimeString = (timestamp: string) => {
  const time = new Date(timestamp);
  return `${time.getHours()}:${
    time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
  } ${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`;
};

function App() {
  const [btcTxs, setBtcTxs] = useState<Txn[]>([]);
  const [ethTxs, setEthTxs] = useState<Txn[]>([]);
  const [cusTxs, setCusTxs] = useState<Txn[]>([]);
  const [prices, setPrices] = useState<Prices>({
    ETH: 0,
    BTC: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (prices["BTC"] === 0 ) {
      fetch("http://localhost:8888/prices")
        .then((res) => res.json())
        .then((data) => setPrices(data));
    }
  }, [prices]);

  useEffect(() => {
    if (prices["BTC"] !== 0 && !btcTxs.length) {
      fetch("http://localhost:8888/btc-txs")
        .then((res) => res.json())
        .then((data) => {
          const dataStamped = data.map((txn : CryptoTxn) => {
            txn.timestamp = txn.insertedAt;
            txn.txntype = "btc-noncustodial";
            txn.amtCrypto = (txn.amount / BTC_SATS).toFixed(8);
            console.log('txn crypto', typeof txn.amtCrypto)
            txn.id = txn.hash.substring(0, 5);
            txn.crypto = "BTC";
            txn.amtFiat = (txn.amtCrypto * prices["BTC"]).toFixed(2);
            txn.date = getTimeString(txn.timestamp);
            return txn;
          });
          return setBtcTxs(dataStamped);
        });
    }
  }, [btcTxs, prices]);

  useEffect(() => {
    if (prices["ETH"] !== 0 && !ethTxs.length) {
      fetch("http://localhost:8888/eth-txs")
        .then((res) => res.json())
        .then((data) => {
          const dataStamped = data.map((txn : CryptoTxn) => {
            txn.timestamp = txn.insertedAt;
            txn.date = getTimeString(txn.timestamp);
            txn.id = txn.hash.substring(0, 5);
            txn.txntype = "eth-noncustodial";
            txn.amtCrypto = (txn.amount / WEI_ETH).toFixed(8);
            txn.crypto = "ETH";
            txn.amtFiat = (txn.amtCrypto * prices["ETH"]).toFixed(2);
            return txn;
          });
          return setEthTxs(dataStamped);
        });
    }
  }, [ethTxs, prices]);

  useEffect(() => {
    if (prices["ETH"] !== 0 && !cusTxs.length) {
      fetch("http://localhost:8888/custodial-txs")
        .then((res) => res.json())
        .then((data) => {
          const dataStamped = data.map((txn: CustodialTxn) => {
              const time = new Date(txn.createdAt);

            txn.txntype = "custodial";
            txn.state = txn.state === "FINISHED" ? "CONFIRMED" : txn.state;
            txn.amtFiat = txn.fiatValue;
            txn.id = txn.id.substring(0, 5);
            txn.timestamp = time.getTime();
            txn.date = getTimeString(txn.createdAt);
            txn.from = txn.pair.substring(0, 3);
            txn.to = txn.pair.substring(4);

            txn.crypto = txn.from !== "USD" ? txn.from : txn.to;
            txn.cryptoValue = prices[txn.crypto];

            txn.amtCrypto = (parseInt(txn.amtFiat) / txn.cryptoValue).toFixed(8);
            return txn;
          });
          return setCusTxs(dataStamped);
        });
    }
  }, [cusTxs, prices]);

  const sortedData = [...cusTxs, ...btcTxs, ...ethTxs].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const filteredData = searchQuery
    ? sortedData.filter((txn: Txn) => {
        let foundMatch = false;
        for (const property in txn) {
          if (
            // @ts-ignore-next-line
            typeof txn[property] === "string" &&
            // @ts-ignore-next-line
            txn[property].toLowerCase().startsWith(searchQuery.toLowerCase())
          ) {
            foundMatch = true;
            break;
          }
        }
        return foundMatch;
      })
    : sortedData;
  return (
    <div className="App">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id/Hash</th>
            <th>To</th>
            <th>From</th>
            <th>Amt (Fiat)</th>
            <th>Amt (Crypto)</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((txn, idx) => (
            <Transaction txn={txn} idx={idx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
