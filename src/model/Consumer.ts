import { Model } from "./Model";

export class Consumer extends Model {
    readonly id: number;
    parent : Consumer | null;
    name: string;
    last_usage: number;

    private constructor(id: number, parent: Consumer | null, name: string, last_usage: number) {
        super();
        this.id = id;
        this.parent = parent;
        this.name = name;
        this.last_usage = last_usage;
    }

    static getById(id: number): Consumer {
        const res = Consumer.sqlite.exec(`
            SELECT * 
            FROM Consumer 
            WHERE id = ${id}`
        );
        return new Consumer(
            res[0].values[0][0] as number,
            res[0].values[0][1] != null ? Consumer.getById(res[0].values[0][1] as number) : null,
            res[0].values[0][2] as string,
            res[0].values[0][3] as number
        );
    }

    save(): void {
        Consumer.sqlite.exec(`
            UPDATE Consumer SET 
            name = "${this.name}",
            parent_id = ${this.parent != null ? this.parent.id : "null"},
            last_usage = ${this.last_usage} 
            WHERE id = ${this.id}`
        );
    }

    delete(): void {
        Consumer.sqlite.exec(`
            DELETE FROM Consumer 
            WHERE id = ${this.id}`
        );
    }
}