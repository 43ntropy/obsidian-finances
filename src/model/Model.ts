/*
    ! TO IMPLEMENT !

    The Model class is a base class for all models in the application.

    The purpose of this is to provide a common interface for all models 
    to interact with the database.

    It should handle initialization of various tables, schema migrations
    and updating.

*/

import initSqlJs from 'sql.js';
import { Database } from "sql.js";

export class Model {

    // ! Temporary solution to save the database on close,
    // ! this should be protected
    public static sqlite: Database;

    // TODO: Implement save method
    static async sqliteInit(
        wasmBinary: ArrayBuffer,
        databaseBinary?: Uint8Array,
        cbSave?: () => void
    ): Promise<void> {

        const SQLjs = await initSqlJs({ wasmBinary: wasmBinary })

        if (databaseBinary)
            Model.sqlite = new SQLjs.Database(databaseBinary);
        else
            Model.sqlite = new SQLjs.Database();

        // Entity table
        this.sqlite.exec(`
            CREATE TABLE IF NOT EXISTS "Entity" (
	        "id"	INTEGER NOT NULL,
	        "type"	INTEGER NOT NULL,
	        PRIMARY KEY("id" AUTOINCREMENT)
            )
        `);

        // Polulate Entity (Default Account)
        this.sqlite.exec(`
            INSERT OR IGNORE INTO "Entity" (id, type) VALUES
            (0, 1)
        `);

        // Account table
        this.sqlite.exec(`
            CREATE TABLE IF NOT EXISTS "Account" (
	        "EntityId"	INTEGER NOT NULL,
	        "name"	    TEXT NOT NULL,
	        "balance"	INTEGER NOT NULL,
	        "lastUsage"	INTEGER NOT NULL,
	        PRIMARY KEY("EntityId"),
	        FOREIGN KEY("EntityId") REFERENCES "Entity"("id")
            )
        `);

        // Populate Account
        this.sqlite.exec(`
            INSERT OR IGNORE INTO "Account" (EntityId, name, balance, lastUsage) VALUES
            (0, 'Default Account', 0, ${Date.now()})
        `);

        // Person table
        this.sqlite.exec(`
            CREATE TABLE IF NOT EXISTS "Person" (
	        "EntityId"	INTEGER NOT NULL,
	        "name"	    TEXT NOT NULL,
	        "balance"	INTEGER NOT NULL,
	        "remission"	INTEGER NOT NULL,
	        "lastUsage"	INTEGER NOT NULL,
	        PRIMARY KEY("EntityId"),
	        FOREIGN KEY("EntityId") REFERENCES "Entity"("id")
            )
        `);

        // Consumer table
        this.sqlite.exec(`
            CREATE TABLE IF NOT EXISTS "Consumer" (
        	"EntityId"	        INTEGER NOT NULL,
        	"ConsumerParent"    INTEGER,
        	"name"	            INTEGER NOT NULL,
        	"lastUsage"	        INTEGER NOT NULL,
        	PRIMARY KEY("EntityId"),
        	FOREIGN KEY("ConsumerParent") REFERENCES "Consumer"("EntityId"),
        	FOREIGN KEY("EntityId")       REFERENCES "Entity"("id")
            )
        `);

        // Transaction table
        this.sqlite.exec(`
            CREATE TABLE IF NOT EXISTS "Transaction" (
	        "id"	            INTEGER,
	        "amount"	        INTEGER NOT NULL,
	        "description"   	TEXT,
	        "timestamp"	         INTEGER NOT NULL,
        	"EntitySender"	    INTEGER,
        	"EntityReceiver"	INTEGER,
        	PRIMARY KEY("id" AUTOINCREMENT),
        	FOREIGN KEY("EntityReceiver")   REFERENCES "Entity"("id"),
        	FOREIGN KEY("EntitySender")     REFERENCES "Entity"("id")
            )
        `);

        // FTS Transaction table
        this.sqlite.exec(`
            CREATE VIRTUAL TABLE IF NOT EXISTS FTS_Transaction USING fts3(
	        id          INTEGER,
            description TEXT
            )
        `);

        // Metadata table
        this.sqlite.exec(`
            CREATE TABLE IF NOT EXISTS "Metadata" (
	        "entry"	TEXT NOT NULL,
	        "value"	TEXT NOT NULL,
	        PRIMARY KEY("entry")
            )
        `);

        // Populate Metadata
        this.sqlite.exec(`
            INSERT OR IGNORE INTO "Metadata" (entry, value) VALUES
            ('version', '1'),
            ('default_account', '0')
        `);

        // Create triggers

        this.sqlite.exec(`
            CREATE TRIGGER IF NOT EXISTS "Transaction_Delete" 
            AFTER DELETE ON "Transaction" 
            BEGIN
                DELETE FROM FTS_Transaction WHERE id = old.id;
            END
        `);

        this.sqlite.exec(`
            CREATE TRIGGER IF NOT EXISTS "Transaction_Insert"
            AFTER INSERT ON "Transaction" 
            BEGIN
                INSERT INTO FTS_Transaction (id, description)
                VALUES (new.id, new.description);
            END
        `);

        this.sqlite.exec(`
            CREATE TRIGGER IF NOT EXISTS "Transaction_Update" 
            AFTER UPDATE ON "Transaction" 
            BEGIN
                DELETE FROM FTS_Transaction WHERE id = old.id;
                INSERT INTO FTS_Transaction (id, description)
                VALUES (new.id, new.description);
            END
        `)

    }
}