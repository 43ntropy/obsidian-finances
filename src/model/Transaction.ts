import { ModelAccount } from "./Account";
import { ModelConsumer } from "./Consumer";
import { ModelEntity } from "./Entity";
import { Model } from "./Model";
import { ModelPerson } from "./Person";
import { ModelWorld } from "./World";

export class ModelTransaction extends Model {

    readonly id: number;
    readonly amount: number;
    public description: string;
    public timestamp: number;
    readonly sender: ModelAccount | ModelPerson | ModelWorld;
    readonly receiver: ModelAccount | ModelPerson | ModelConsumer | ModelWorld;

    constructor(
        id: number,
        amount: number,
        description: string,
        timestamp: number,
        sender: ModelAccount | ModelPerson | ModelWorld,
        receiver: ModelAccount | ModelPerson | ModelConsumer | ModelWorld
    ) {
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

        const queryResult = ModelTransaction.sqlite.exec(`
            INSERT INTO "Transaction" (
                amount, 
                description, 
                timestamp, 
                EntitySender, 
                EntityReceiver
            ) VALUES (
                ${Math.trunc(amount * 100)}, 
                "${description.trimStart().trimEnd()}", 
                ${timestamp},
                ${sender instanceof ModelEntity ? sender.id : "null"},
                ${receiver instanceof ModelEntity ? receiver.id : "null"}
            ) 
            RETURNING id;
        `);
        return ModelTransaction.getById(queryResult[0].values[0][0] as number);
    }

    static getById(id: number): ModelTransaction {

        const queryResult = ModelTransaction.sqlite.exec(`
            SELECT 
                "Transaction".id,
                "Transaction".amount,
                "Transaction".description,
                "Transaction".timestamp,
                "Transaction".EntitySender,
                "Transaction".EntityReceiver
            FROM "Transaction" 
            WHERE id = ${id}`
        );

        return new ModelTransaction(
            queryResult[0].values[0][0] as number,
            queryResult[0].values[0][1] as number,
            queryResult[0].values[0][2] as string,
            queryResult[0].values[0][3] as number,
            queryResult[0].values[0][4] as number != null ?
                ModelEntity.get(queryResult[0].values[0][4] as number) :
                new ModelWorld(),
            queryResult[0].values[0][5] as number != null ?
                ModelEntity.get(queryResult[0].values[0][5] as number) :
                new ModelWorld()
        );

    }

    static getList(config: {
        limit: number
    } = { limit: 10 }): ModelTransaction[] {

        const queryResult = ModelTransaction.sqlite.exec(`
            SELECT * 
            FROM "Transaction"
            ORDER BY timestamp DESC
            LIMIT ${config.limit}
        `);

        const transactions: ModelTransaction[] = [];
        if (queryResult[0])
            for (const rowQueryResult of queryResult[0].values)
                transactions.push(new ModelTransaction(
                    rowQueryResult[0] as number,
                    rowQueryResult[1] as number,
                    rowQueryResult[2] as string,
                    rowQueryResult[3] as number,
                    rowQueryResult[4] != null ? 
                        ModelEntity.get(rowQueryResult[4] as number) : 
                        new ModelWorld(),
                    rowQueryResult[5] != null ? 
                        ModelEntity.get(rowQueryResult[5] as number) : 
                        new ModelWorld()
                ));

        return transactions;
    }

    static getListByPerson(person: ModelPerson): ModelTransaction[] {
        const queryResult = ModelTransaction.sqlite.exec(`
            SELECT * 
            FROM "Transaction"
            WHERE EntitySender = ${person.id} OR EntityReceiver = ${person.id}
            ORDER BY timestamp DESC
            LIMIT 10
        `);

        const transactions: ModelTransaction[] = [];
        if (queryResult[0])
            for (const rowQueryResult of queryResult[0].values)
                transactions.push(new ModelTransaction(
                    rowQueryResult[0] as number,
                    rowQueryResult[1] as number,
                    rowQueryResult[2] as string,
                    rowQueryResult[3] as number,
                    rowQueryResult[4] != null ?
                        ModelEntity.get(rowQueryResult[4] as number) :
                        new ModelWorld(),
                    rowQueryResult[5] != null ?
                        ModelEntity.get(rowQueryResult[5] as number) :
                        new ModelWorld()
                ));

        return transactions;

    }

    static getListBySearch(search: string): ModelTransaction[] {
        const queryResult = ModelTransaction.sqlite.exec(`
            SELECT t.* 
            FROM "Transaction" t
            JOIN FTS_Transaction fts ON t.id = fts.id
            WHERE FTS_Transaction MATCH '"${search.replace(/"/g, '""')}*"'
            ORDER BY timestamp DESC
            LIMIT 25
        `);
        const transactions: ModelTransaction[] = [];
        if (queryResult[0])
            for (const rowQueryResult of queryResult[0].values)
                transactions.push(new ModelTransaction(
                    rowQueryResult[0] as number,
                    rowQueryResult[1] as number,
                    rowQueryResult[2] as string,
                    rowQueryResult[3] as number,
                    rowQueryResult[4] != null ?
                        ModelEntity.get(rowQueryResult[4] as number) :
                        new ModelWorld(),
                    rowQueryResult[5] != null ?
                        ModelEntity.get(rowQueryResult[5] as number) :
                        new ModelWorld()
                ));

        return transactions;
    }

    save(): void {
        ModelTransaction.sqlite.exec(`
            UPDATE Transaction SET 
            amount = ${Math.trunc(this.amount * 100)}, 
            description = "${this.description.trimStart().trimEnd()}", 
            timestamp = ${this.timestamp}, 
            EntitySender = ${this.sender instanceof ModelEntity ? this.sender.id : "null"},
            EntityReceiver = ${this.receiver instanceof ModelEntity ? this.receiver.id : "null"}
            WHERE id = ${this.id}`
        );
    }

    delete(): void {
        ModelTransaction.sqlite.exec(`
            DELETE FROM "Transaction" 
            WHERE id = ${this.id}`
        );
    }
}