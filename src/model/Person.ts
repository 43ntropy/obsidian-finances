import { ModelEntity } from "./Entity";

export class ModelPerson extends ModelEntity {

    public name: string;
    /** 
     * **Positive**: Indicates that this person owes money to the user
     * 
     * **Negative**: Indicates that the user owes money to this person
     */
    public balance: number;
    /** Amount loaned by the user to this person that is forgiven */
    public remission: number;
    public lastUsage: number;

    private constructor(
        entityId: number,
        entityType: number,
        name: string, 
        balance: number,
        remission: number, 
        lastUsage: number
    ) {
        super(entityId, entityType);
        this.name = name;
        this.balance = balance / 100;
        this.remission = remission / 100;
        this.lastUsage = lastUsage;
    }

    static create(name: string, balance: number = 0, remission: number = 0): ModelPerson {

        const entity = super.create("Person");

        const queryResult = ModelPerson.sqlite.exec(`
            INSERT INTO Person (
                EntityId, 
                name, 
                balance, 
                remission, 
                lastUsage
            ) VALUES (
                ${entity.id}, 
                "${name}", 
                ${Math.trunc(balance * 100)}, 
                ${Math.trunc(remission * 100)},
                ${Date.now()}
            ) 
            RETURNING EntityId;
        `);
        return ModelPerson.getById(queryResult[0].values[0][0] as number);
    }

    static getById(id: number): ModelPerson {

        const queryResult = ModelPerson.sqlite.exec(`
            SELECT Entity.id, Entity.type, Person.name, Person.balance, Person.remission, Person.lastUsage
            FROM Person 
            INNER JOIN Entity ON Person.EntityId = Entity.id
            WHERE id = ${id}`
        );

        return new ModelPerson(
            queryResult[0].values[0][0] as number, // Entity.id
            queryResult[0].values[0][1] as number, // Entity.type
            queryResult[0].values[0][2] as string, // name
            queryResult[0].values[0][3] as number, // balance
            queryResult[0].values[0][4] as number, // remission
            queryResult[0].values[0][5] as number  // lastUsage
        );

    }

    // TODO: Implement filters and pagination
    static getList(): ModelPerson[] {

        const queryResult = ModelPerson.sqlite.exec(`
            SELECT Entity.id, Entity.type, Person.name, Person.balance, Person.remission, Person.lastUsage
            FROM Person
            INNER JOIN Entity ON Person.EntityId = Entity.id
            ORDER BY lastUsage DESC
        `);

        const people: ModelPerson[] = [];
        if (queryResult[0])
            for (const rowQueryResult of queryResult[0].values)
                people.push(new ModelPerson(
                    rowQueryResult[0] as number, // Entity.id
                    rowQueryResult[1] as number, // Entity.type
                    rowQueryResult[2] as string, // name
                    rowQueryResult[3] as number, // balance
                    rowQueryResult[4] as number, // remission
                    rowQueryResult[5] as number  // lastUsage
                ));

        return people;

    }

    save(): void {
        ModelPerson.sqlite.exec(`
            UPDATE Person SET 
            name = "${this.name}", 
            balance = ${Math.trunc(this.balance * 100)},  
            remission = ${Math.trunc(this.remission * 100)},
            lastUsage = ${this.lastUsage} 
            WHERE EntityId = ${this.id}`
        );
    }

    delete(): void {
        // TODO: Implement delete strategy
        throw new Error("Method not implemented.");
    }

}

ModelEntity.ENTITIES[2] = ModelPerson.getById;