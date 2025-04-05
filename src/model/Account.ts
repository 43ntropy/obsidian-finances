import { Model } from "./Model";

export class Account extends Model {
    readonly id: number;
    name: string;
    balance: number;

    private constructor(id: number, name: string, balance: number) {
        super();
        this.id = id;
        this.name = name;
        this.balance = balance / 100;
    }

    static getById(id: number): Account {
        const res = Account.sqlite.exec(`
            SELECT * 
            FROM Account 
            WHERE id = ${id}`
        );
        return new Account(
            res[0].values[0][0] as number,
            res[0].values[0][1] as string,
            res[0].values[0][2] as number,
        );
    }

    save(): void {
        Account.sqlite.exec(`
            UPDATE Account SET 
            name = "${this.name}", 
            balance = ${Math.trunc(this.balance * 100)} 
            WHERE id = ${this.id}`
        );
    }

    delete(): void {
        Account.sqlite.exec(`
            DELETE FROM Account 
            WHERE id = ${this.id}`
        );
    }
}