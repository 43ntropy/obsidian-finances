import { Model } from "./Model";

export class ModelMetadata extends Model {

    static getVersion(): number {
        const res = super.sqlite.exec(`
            SELECT *
            FROM Metadata
            WHERE entry = "version"
        `);
        return res[0].values[0][1] as number;
    }

    static getDefaultAccount(): number {
        const res = super.sqlite.exec(`
            SELECT *
            FROM Metadata
            WHERE entry = "default_account"
        `);
        return res[0].values[0][1] as number;
    }

    static setDefaultAccount(account_id: number): void {
        super.sqlite.exec(`
            UPDATE Metadata
            SET value = ${account_id}
            WHERE entry = "default_account"
        `);
    }

}