import { Account } from "./Account";
import { Consumer } from "./Consumer";
import { Model } from "./Model";
import { Person } from "./Person";

class Transaction extends Model {
    readonly id: number;
    amount: number;
    description: string;
    timestamp: number;
    sender: Account | Person | null;
    receiver: Account | Person | Consumer | null;

    constructor(id: number, amount: number, description: string, timestamp: number, sender: Account | Person | null, receiver: Account | Person | Consumer | null) {
        super();
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.timestamp = timestamp;
        this.sender = sender;
        this.receiver = receiver;
    }

    static getById(id: number): Transaction {
        const res = Transaction.sqlite.exec(`
            SELECT *
            FROM Transaction 
            WHERE id = ${id}`
        );

        // Check sender type
        let sender = null;
        if (res[0].values[0][4] != null) 
            sender = Account.getById(res[0].values[0][4] as number);
        else if (res[0].values[0][6] != null)
            sender = Person.getById(res[0].values[0][6] as number);

        // Check receiver type
        let receiver = null;
        if (res[0].values[0][5] != null)
            receiver = Account.getById(res[0].values[0][5] as number);
        else if (res[0].values[0][7] != null)
            receiver = Person.getById(res[0].values[0][7] as number);
        else if (res[0].values[0][9] != null)
            receiver = Consumer.getById(res[0].values[0][8] as number);

        return new Transaction(
            res[0].values[0][0] as number,
            res[0].values[0][1] as number,
            res[0].values[0][2] as string,
            res[0].values[0][3] as number,
            sender,
            receiver
        );
    }

    save(): void {
        Transaction.sqlite.exec(`
            UPDATE Transaction SET 
            amount = ${Math.trunc(this.amount * 100)}, 
            description = "${this.description}", 
            timestamp = ${this.timestamp}, 
            sender_Account = ${this.sender instanceof Account ? this.sender.id : "null"},
            receiver_Account = ${this.receiver instanceof Account ? this.receiver.id : "null"},
            sender_Person = ${this.sender instanceof Person ? this.sender.id : "null"},
            receiver_Person = ${this.receiver instanceof Person ? this.receiver.id : "null"},
            sender_Consumer = ${this.sender instanceof Consumer ? this.sender.id : "null"},
            receiver_Consumer = ${this.receiver instanceof Consumer ? this.receiver.id : "null"}
            WHERE id = ${this.id}`
        );
    }

    delete(): void {
        Transaction.sqlite.exec(`
            DELETE FROM Transaction 
            WHERE id = ${this.id}`
        );
    }
}