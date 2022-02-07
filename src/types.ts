export enum TxnState {
    CONFIRMED = "CONFIRMED",
    PENDING = "PENDING"
}

export enum CryptoCurrency {
    ETH = "ETH",
    BTC = "BTC"
}

export enum TxnType {
    buy = "buy",
    sell ="sell"
}


export interface CustodialTxn {
    createdAt: string,
    id: string,
    pair: string,
    state: "CONFIRMED" | "PENDING" | "FINISHED",
    type: "buy" | "sell",
    version: string
    txntype: "custodial" | "eth-noncustodial" | "btc-noncustodial"
    timestamp: string | number
    date: string
    from: string
    to: string
    crypto: string,
    cryptoValue: number,
    amtCrypto: string,
    amtFiat: string
    insertedAt: string
    hash: string,
    fiatValue: string
    amount: number
}

export interface CryptoTxn {
    createdAt: string,
    id: string,
    pair: string,
    state: "CONFIRMED" | "PENDING" | "FINISHED",
    type: "buy" | "sell",
    version: string
    txntype: "custodial" | "eth-noncustodial" | "btc-noncustodial"
    timestamp: string | number
    date: string
    from: string
    to: string
    crypto: string,
    cryptoValue: number,
    insertedAt: string
    hash: string,
    amount: number
    amtFiat: string
    amtCrypto: any
}

export interface Txn {
    to: string,
    from: string,
    amtFiat: number,
    amtCrypto: number,
    date: string,
    state: "CONFIRMED" | "PENDING",
    crypto: "ETH" | "BTC",
    id: string
    timestamp: number,
}

export interface Prices {
    [key: string]: number,
}