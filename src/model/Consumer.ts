import { ModelEntity } from "./Entity";

export class ModelConsumer extends ModelEntity {

    public parent: ModelConsumer | null;
    public name: string;
    public lastUsage: number;

    private constructor(
        entityId: number,
        entityType: number,
        name: string,
        parent: ModelConsumer | null,
        lastUsage: number
    ) {
        super(entityId, entityType);
        this.parent = parent;
        this.name = name;
        this.lastUsage = lastUsage;
    }

    static create(name: string, parent?: number): ModelConsumer {

        const entity = super.create("Consumer");

        const queryResult = ModelConsumer.sqlite.exec(`
            INSERT INTO Consumer (
                EntityId, 
                name, 
                ConsumerParent, 
                lastUsage
            ) VALUES (
                ${entity.id},
                "${name}", 
                ${parent != undefined ? parent : "null"}, 
                ${Date.now()}
            )
            RETURNING EntityId;
        `);
        return ModelConsumer.getById(queryResult[0].values[0][0] as number);
    }


    static getById(id: number): ModelConsumer {

        const queryResult = ModelConsumer.sqlite.exec(`
            SELECT Entity.id, Entity.type, Consumer.name, Consumer.ConsumerParent, Consumer.lastUsage
            FROM Consumer 
            INNER JOIN Entity ON Consumer.EntityId = Entity.id
            WHERE EntityId = ${id}`
        );

        return new ModelConsumer(
            queryResult[0].values[0][0] as number,
            queryResult[0].values[0][1] as number,
            queryResult[0].values[0][2] as string,
            queryResult[0].values[0][3] != null ? ModelConsumer.getById(queryResult[0].values[0][3] as number) : null,
            queryResult[0].values[0][4] as number
        );

    }

    static getList(parent?: number): ModelConsumer[] {

        const res = ModelConsumer.sqlite.exec(`
            SELECT Entity.id, Entity.type, Consumer.name, Consumer.ConsumerParent, Consumer.lastUsage
            FROM Consumer
            INNER JOIN Entity ON Consumer.EntityId = Entity.id
            ${parent != undefined ?
                `WHERE ConsumerParent = ${parent}` :
                "WHERE ConsumerParent IS NULL"}
            ORDER BY lastUsage DESC`,
        );

        const consumers: ModelConsumer[] = [];
        if (res[0])
            for (const rowQueryResult of res[0].values)
                consumers.push(new ModelConsumer(
                    rowQueryResult[0] as number,
                    rowQueryResult[1] as number,
                    rowQueryResult[2] as string,
                    rowQueryResult[3] != null ? ModelConsumer.getById(rowQueryResult[3] as number) : null,
                    rowQueryResult[4] as number,
                ));
        return consumers;

    }

    save(): void {
        ModelConsumer.sqlite.exec(`
            UPDATE Consumer SET 
            name = "${this.name}",
            ConsumerParent = ${this.parent != null ? this.parent.id : "null"},
            lastUsage = ${this.lastUsage} 
            WHERE EntityId = ${this.id}`
        );
    }

    delete(): void {
        // TODO: Implement delete strategy
        throw new Error("Method not implemented.");
    }
}

ModelEntity.ENTITIES[3] = ModelConsumer.getById;