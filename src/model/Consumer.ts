import { Model } from "./Model";

export class ModelConsumer extends Model {
    readonly id: number;
    parent: ModelConsumer | null;
    name: string;
    last_usage: number;

    private constructor(id: number, parent: ModelConsumer | null, name: string, last_usage: number) {
        super();
        this.id = id;
        this.parent = parent;
        this.name = name;
        this.last_usage = last_usage;
    }

    static create(name: string, parent?: number): ModelConsumer {
        const res = ModelConsumer.sqlite.exec(`
            INSERT INTO Consumer (name, parent_Consumer, last_usage) 
            VALUES ("${name}", ${parent != undefined ? parent : "null"}, ${Date.now()})
            RETURNING id;
        `);
        return ModelConsumer.getById(res[0].values[0][0] as number);
    }


    static getById(id: number): ModelConsumer {
        const res = ModelConsumer.sqlite.exec(`
            SELECT * 
            FROM Consumer 
            WHERE id = ${id}`
        );
        return new ModelConsumer(
            res[0].values[0][0] as number,
            res[0].values[0][1] != null ? ModelConsumer.getById(res[0].values[0][1] as number) : null,
            res[0].values[0][2] as string,
            res[0].values[0][3] as number
        );
    }

    static getList(parent?: number): ModelConsumer[] {
        const res = ModelConsumer.sqlite.exec(`
            SELECT *
            FROM Consumer
            ${parent != undefined ?
                `WHERE parent_Consumer = ${parent}` :
                "WHERE parent_Consumer IS NULL"}
            ORDER BY last_usage DESC`,
        );
        const consumers: ModelConsumer[] = [];
        if (res[0])
            for (const consumer of res[0].values)
                consumers.push(new ModelConsumer(
                    consumer[0] as number,
                    consumer[1] != null ? ModelConsumer.getById(consumer[1] as number) : null,
                    consumer[2] as string,
                    consumer[3] as number
                ));
        return consumers;
    }

    save(): void {
        ModelConsumer.sqlite.exec(`
            UPDATE Consumer SET 
            name = "${this.name}",
            parent_Consumer = ${this.parent != null ? this.parent.id : "null"},
            last_usage = ${this.last_usage} 
            WHERE id = ${this.id}`
        );
    }

    delete(): void {
        ModelConsumer.sqlite.exec(`
            DELETE FROM Consumer 
            WHERE id = ${this.id}`
        );
    }
}