import { ModelAccount } from "./Account";
import { ModelConsumer } from "./Consumer";
import { Model } from "./Model";
import { ModelPerson } from "./Person";

export class ModelEntity extends Model {

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

    protected static get(id: number): {
        id: number;
        type: number;
    } {
        const res = ModelEntity.sqlite.exec(`
            SELECT * 
            FROM Entity 
            WHERE id = ${id}`
        );

        return {
            id: res[0].values[0][0] as number,
            type: res[0].values[0][1] as number
        };
    }

    getAssociatedEntity(): 
        ModelAccount | 
        ModelPerson | 
        ModelConsumer 
    {
        switch (this.type) {
            case 1:
                return ModelAccount.getById(this.id);
            case 2:
                return ModelPerson.getById(this.id);
            case 3:
                return ModelConsumer.getById(this.id);
            default:
                throw new Error(`Unknown entity type: ${this.type}`);
        }
    }

}