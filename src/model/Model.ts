import { Database } from "sql.js";

/*
    ! TO IMPLEMENT !

    The Model class is a base class for all models in the application.

    The purpose of this is to provide a common interface for all models 
    to interact with the database.

*/

export class Model {
    protected static sqlite: Database;

    static setSqlite = (database: Database) => Model.sqlite = database;

    // TODO: Implement a method to create default database & tables if it doesn't exists
}