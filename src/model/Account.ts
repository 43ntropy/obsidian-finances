import { ModelEntity } from "./Entity";

export class ModelAccount extends ModelEntity {

    public name: string;
    public balance: number;
    public lastUsage: number;

    private constructor(
        entityId: number,
        entityType: number,
        name: string, 
        balance: number, 
        lastUsage: number
    ) {
        super(entityId, entityType);
        this.name = name;
        this.balance = balance / 100;
        this.lastUsage = lastUsage;
    }

    static create(name: string, balance: number = 0): ModelAccount {

        const entity = super.create("Account");

        const queryResult = ModelAccount.sqlite.exec(`
            INSERT INTO Account (EntityId, name, balance, lastUsage)
            VALUES (${entity.id}, "${name}", ${Math.trunc(balance * 100)}, ${Date.now()})
            RETURNING EntityId;
        `);

        return ModelAccount.getById(queryResult[0].values[0][0] as number);
    }

    static getById(id: number): ModelAccount {

        const queryResult = ModelAccount.sqlite.exec(`
            SELECT Entity.id, Entity.type, Account.name, Account.balance, Account.lastUsage
            FROM Account 
            INNER JOIN Entity ON Account.EntityId = Entity.id
            WHERE EntityId = ${id}`
        );

        return new ModelAccount(
            queryResult[0].values[0][0] as number, // Entity.id
            queryResult[0].values[0][1] as number, // Entity.type
            queryResult[0].values[0][2] as string, // name
            queryResult[0].values[0][3] as number, // balance
            queryResult[0].values[0][4] as number  // lastUsage
        );

    }

    // TODO: Implement filters and pagination
    static getList(): ModelAccount[] {

        const queryResult = ModelAccount.sqlite.exec(`
            SELECT Entity.id, Entity.type, Account.name, Account.balance, Account.lastUsage 
            FROM Account
            INNER JOIN Entity ON Account.EntityId = Entity.id
            ORDER BY lastUsage DESC
        `);

        const accounts: ModelAccount[] = [];
        if (queryResult[0])
            for (const rowQueryResult of queryResult[0].values)
                accounts.push(new ModelAccount(
                    rowQueryResult[0] as number, // Entity.id
                    rowQueryResult[1] as number, // Entity.type
                    rowQueryResult[2] as string, // name
                    rowQueryResult[3] as number, // balance
                    rowQueryResult[4] as number  // lastUsage
                ));

        return accounts;
    }

    save(): void {
        ModelAccount.sqlite.exec(`
            UPDATE Account SET 
            name = "${this.name}", 
            balance = ${Math.trunc(this.balance * 100)},
            lastUsage = ${this.lastUsage} 
            WHERE EntityId = ${this.id}`
        );
    }

    delete(): void {
        // TODO: Implement delete strategy
        throw new Error("Method not implemented.");
    }

}

ModelEntity.ENTITIES[1] = ModelAccount.getById;