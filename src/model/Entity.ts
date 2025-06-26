import { Model } from "./Model";

export class ModelEntity extends Model {

    public static ENTITIES: Record<number, (id: number) => ModelEntity> = {};

    public readonly id: number;
    public readonly type: number;

    protected constructor(id: number, type: number) {
        super();
        this.id = id;
        this.type = type;
    }

    protected static create(
        type:
            "Account" |
            "Person" |
            "Consumer"
    ): ModelEntity {

        const typeNumber = {
            "Account": 1,
            "Person": 2,
            "Consumer": 3
        }[type];

        const queryResult = ModelEntity.sqlite.exec(`
            INSERT INTO Entity (type)
            VALUES (${typeNumber})
            RETURNING id;`
        );

        return new ModelEntity(
            queryResult[0].values[0][0] as number, // id
            typeNumber // type
        );

    }

    protected static getRaw(id: number): ModelEntity {

        const queryResult = ModelEntity.sqlite.exec(`
            SELECT * 
            FROM Entity 
            WHERE id = ${id}`
        );

        return new ModelEntity(
            queryResult[0].values[0][0] as number, // id
            queryResult[0].values[0][1] as number  // type
        );

    }

    public static get(id: number): ModelEntity {
        
        const entity = ModelEntity.getRaw(id);
        const entityGetter = ModelEntity.ENTITIES[entity.type];
        if (entityGetter === undefined) throw new Error("Entity type not registered");
        return entityGetter(id);

    }

}