export class ControllerState {
    action: ControllerAction;
    action_data?: any;
    confirm_redirect?: ControllerAction;
    confirm_redirect_data?: any;
    cancel_redirect?: ControllerAction;
    cancel_redirect_data?: any;
}

export enum ControllerAction {

    /*
    * DASHBOARD
    */

    OPEN_DASHBOARD,


    /*
    * ACCOUNTS
    */

    OPEN_ACCOUNTS,
    OPEN_ACCOUNT,
    /** Support: 
     * - Confirm: Redirection after creation
     * (Default to {@link ControllerAction.OPEN_ACCOUNT|Created account})
     * - Cancel: Redirection if cancelled 
     * (Default to {@link ControllerAction.OPEN_ACCOUNTS|Accounts})
     * */
    CREATE_ACCOUNT,
    /** Requires:
     * - Data: Account ID
     */
    EDIT_ACCOUNT_DEFAULT,
    /** Requires:
     * - Data: Account ID
     */
    EDIT_ACCOUNT_NAME,
    /** Requires:
     * - Data: Account ID
     *
     * Supports:
     * - Confirm: Redirection after deletion
     * (Default to {@link ControllerAction.OPEN_ACCOUNTS|Accounts})
     * - Cancel: Redirection if cancelled
     * (Default to {@link ControllerAction.OPEN_ACCOUNT|Account})
     */
    DELETE_ACCOUNT,


    /*
    * PEOPLE
    */

    OPEN_PEOPLE,
    OPEN_PERSON,
    /** Support:
     * - Confirm: Redirection after creation
     * (Default to {@link ControllerAction.OPEN_PERSON|Created person})
     * - Cancel: Redirection if cancelled
     * (Default to {@link ControllerAction.OPEN_PEOPLE|People})
     */
    CREATE_PERSON,
    /** Requires:
     * - Data: Person ID
     */
    EDIT_PERSON_NAME,
    /** Requires:
     * - Data: Person ID
     *
     * Supports:
     * - Confirm: Redirection after deletion
     * (Default to {@link ControllerAction.OPEN_PEOPLE|People})
     * - Cancel: Redirection if cancelled
     * (Default to {@link ControllerAction.OPEN_PERSON|Person})
     */
    DELETE_PERSON,


    /*
    * CONSUMERS
    */

    /**
     * Supports:
     * - Data: Consumer ID or null, define which consumer is selected
     * (Default to null) 
     */
    OPEN_CONSUMERS,
    /**
     * Supports:
     * - Data: Consumer ID or null, define which is the parent consumer
     * (Default to null)
     * - Confirm: Redirection after creation
     * (Default to {@link ControllerAction.OPEN_CONSUMERS|Created consumer})
     * - Cancel: Redirection if cancelled
     * (Default to {@link ControllerAction.OPEN_CONSUMERS|Consumers})
     */
    CREATE_CONSUMER,
    /** Requires:
     * - Data: Consumer ID
     */
    EDIT_CONSUMER_NAME,
    /** Requires:
     * - Data: Consumer ID
     *
     * Supports:
     * - Confirm: Redirection after deletion
     * (Default to {@link ControllerAction.OPEN_CONSUMERS|Consumers})
     * - Cancel: Redirection if cancelled
     * (Default to {@link ControllerAction.OPEN_CONSUMER|Parent Consumer})
     */
    DELETE_CONSUMER,


    /*
    * TRANSACTIONS
    */

    OPEN_TRANSACTIONS,
    OPEN_TRANSACTIONS_SEARCH,
    OPEN_TRANSACTION,
    CREATE_TRANSACTION,
    DELETE_TRANSACTION,


    /*
    * OTHERS
    */

    CLOSE,

    
}