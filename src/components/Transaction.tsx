import classNames from "classnames";
import { Txn } from "../types"
import "./Transaction.css";

interface TransactionProps {
  txn: Txn,
  idx: number
}

export const Transaction = ({txn, idx}: TransactionProps) => {
    const { to, from, amtFiat, amtCrypto, date, state, crypto, id } = txn;
    return (
        <tr
            className={classNames({
                confirmed: state === "CONFIRMED",
                pending: state === "PENDING",
            })}
            key={idx}
        >
            <td>{id}</td>
            <td>{to}</td>
            <td>{from}</td>
            <td>{`$${amtFiat}`}</td>
            <td>{`${amtCrypto} ${crypto}`}</td>
            <td>{date}</td>
            <td>{state}</td>
        </tr>
    );
}