import { ModelAccount } from "./Account";
import { ModelConsumer } from "./Consumer";
import { Model } from "./Model";
import { ModelPerson } from "./Person";
import { ModelWorld } from "./World";

export class ModelTransaction extends Model {
    readonly id: number;
    amount: number;
    description: string;
    timestamp: number;
    sender: ModelAccount | ModelPerson | ModelWorld;
    receiver: ModelAccount | ModelPerson | ModelConsumer | ModelWorld;

    constructor(id: number, amount: number, description: string, timestamp: number, sender: ModelAccount | ModelPerson | ModelWorld, receiver: ModelAccount | ModelPerson | ModelConsumer | ModelWorld) {
        super();
        this.id = id;
        this.amount = amount / 100;
        this.description = description;
        this.timestamp = timestamp;
        this.sender = sender;
        this.receiver = receiver;
    }

    static create(
        sender: ModelAccount | ModelPerson | ModelWorld,
        receiver: ModelAccount | ModelPerson | ModelConsumer | ModelWorld,
        amount: number,
        description: string,
        timestamp: number
    ): ModelTransaction {
        const res = ModelTransaction.sqlite.exec(`
            INSERT INTO "Transaction" (amount, description, timestamp, sender_Account, receiver_Account, sender_Person, receiver_Person, sender_Consumer, receiver_Consumer) 
            VALUES (${Math.trunc(amount * 100)}, "${description}", ${timestamp}, ${sender instanceof ModelAccount ? sender.id : "null"}, ${receiver instanceof ModelAccount ? receiver.id : "null"}, ${sender instanceof ModelPerson ? sender.id : "null"}, ${receiver instanceof ModelPerson ? receiver.id : "null"}, ${sender instanceof ModelConsumer ? sender.id : "null"}, ${receiver instanceof ModelConsumer ? receiver.id : "null"}) 
            RETURNING id;
        `);
        return ModelTransaction.getById(res[0].values[0][0] as number);
    }

    static getById(id: number): ModelTransaction {
        const res = ModelTransaction.sqlite.exec(`
            SELECT *
            FROM "Transaction" 
            WHERE id = ${id}`
        );

        // Check sender type
        let sender = new ModelWorld();
        if (res[0].values[0][4] != null)
            sender = ModelAccount.getById(res[0].values[0][4] as number);
        else if (res[0].values[0][6] != null)
            sender = ModelPerson.getById(res[0].values[0][6] as number);

        // Check receiver type
        let receiver = new ModelWorld();
        if (res[0].values[0][5] != null)
            receiver = ModelAccount.getById(res[0].values[0][5] as number);
        else if (res[0].values[0][7] != null)
            receiver = ModelPerson.getById(res[0].values[0][7] as number);
        else if (res[0].values[0][9] != null)
            receiver = ModelConsumer.getById(res[0].values[0][8] as number);

        return new ModelTransaction(
            res[0].values[0][0] as number,
            res[0].values[0][1] as number,
            res[0].values[0][2] as string,
            res[0].values[0][3] as number,
            sender,
            receiver
        );
    }

    static getList(): ModelTransaction[] {
        // TODO: Optimeze method query with JOINS
        const res = ModelTransaction.sqlite.exec(`
            SELECT * 
            FROM "Transaction"
            ORDER BY timestamp DESC
        `);
        const transactions: ModelTransaction[] = [];
        if (res[0])
            for (const transaction of res[0].values) {
                let sender = new ModelWorld();
                if (transaction[4] != null)
                    sender = ModelAccount.getById(transaction[4] as number);
                else if (transaction[6] != null)
                    sender = ModelPerson.getById(transaction[6] as number);
                let receiver = new ModelWorld();
                if (transaction[5] != null)
                    receiver = ModelAccount.getById(transaction[5] as number);
                else if (transaction[7] != null)
                    receiver = ModelPerson.getById(transaction[7] as number);
                else if (transaction[9] != null)
                    receiver = ModelConsumer.getById(transaction[8] as number);
                transactions.push(new ModelTransaction(
                    transaction[0] as number,
                    transaction[1] as number,
                    transaction[2] as string,
                    transaction[3] as number,
                    sender,
                    receiver
                ));
            }
        return transactions;
    }

    static getListBySearch(search: string): ModelTransaction[] {
        const res = ModelTransaction.sqlite.exec(`
            SELECT t.* 
            FROM "Transaction" t
            JOIN FTS_Transaction fts ON t.id = fts.id
            WHERE FTS_Transaction MATCH '"${search.replace(/"/g, '""')}*"'
            ORDER BY timestamp DESC
            LIMIT 25
        `);
        const transactions: ModelTransaction[] = [];
        if (res[0])
            for (const transaction of res[0].values) {
                let sender = new ModelWorld();
                if (transaction[4] != null)
                    sender = ModelAccount.getById(transaction[4] as number);
                else if (transaction[6] != null)
                    sender = ModelPerson.getById(transaction[6] as number);
                let receiver = new ModelWorld();
                if (transaction[5] != null)
                    receiver = ModelAccount.getById(transaction[5] as number);
                else if (transaction[7] != null)
                    receiver = ModelPerson.getById(transaction[7] as number);
                else if (transaction[9] != null)
                    receiver = ModelConsumer.getById(transaction[8] as number);
                transactions.push(new ModelTransaction(
                    transaction[0] as number,
                    transaction[1] as number,
                    transaction[2] as string,
                    transaction[3] as number,
                    sender,
                    receiver
                ));
            }
        return transactions;
    }

    save(): void {
        ModelTransaction.sqlite.exec(`
            UPDATE Transaction SET 
            amount = ${Math.trunc(this.amount * 100)}, 
            description = "${this.description}", 
            timestamp = ${this.timestamp}, 
            sender_Account = ${this.sender instanceof ModelAccount ? this.sender.id : "null"},
            receiver_Account = ${this.receiver instanceof ModelAccount ? this.receiver.id : "null"},
            sender_Person = ${this.sender instanceof ModelPerson ? this.sender.id : "null"},
            receiver_Person = ${this.receiver instanceof ModelPerson ? this.receiver.id : "null"},
            sender_Consumer = ${this.sender instanceof ModelConsumer ? this.sender.id : "null"},
            receiver_Consumer = ${this.receiver instanceof ModelConsumer ? this.receiver.id : "null"}
            WHERE id = ${this.id}`
        );
    }

    delete(): void {
        ModelTransaction.sqlite.exec(`
            DELETE FROM Transaction 
            WHERE id = ${this.id}`
        );
    }
}