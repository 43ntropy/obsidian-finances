import { ModelAccount } from "src/model/Account";
import { ModelConfiguration } from "src/model/Configuration";
import { viewNewAccount } from "src/view/NewAccount";
import { viewAccounts } from "src/view/Accounts";
import { viewDashboard } from "src/view/Dashboard";
import { viewAccount } from "src/view/Account";
import { ControllerState, ControllerAction } from "./ControllerUiState";
import { zenParseMoney } from "./Utils";
import { viewEditAccountName } from "src/view/EditAccountName";
import { viewConfirm } from "src/view/Confirm";
import { ModelPerson } from "src/model/Person";
import { viewPeople } from "src/view/People";
import { viewNewPerson } from "src/view/NewPerson";
import { viewPerson } from "src/view/Person";
import { viewEditPersonName } from "src/view/EditPersonName";
import { viewConsumers } from "src/view/Consumers";
import { ModelConsumer } from "src/model/Consumer";
import { viewNewConsumer } from "src/view/NewConsumer";
import { viewEditConsumerName } from "src/view/EditConsumerName";
import { viewTransactions } from "src/view/Transactions";
import { ModelTransaction } from "src/model/Transaction";
import { viewTransaction } from "src/view/Transaction";
import { viewNewTransaction } from "src/view/NewTransaction";
import { ModelWorld } from "src/model/World";

export class Controller {

    static onSave: () => void;

    static async openUi() {
        let state: ControllerState = { action: ControllerAction.OPEN_DASHBOARD };
        do {
            switch (state.action) {

                /* 
                * START DASHBOARD 
                */

                case ControllerAction.OPEN_DASHBOARD: {
                    state = await viewDashboard({
                        default_account: ModelAccount.getById(ModelConfiguration.getDefaultAccount()),
                        transactions_total: ModelTransaction.calculateAccountOffset(),
                    });
                    break;
                }

                /* 
                *START ACCOUNTS 
                */

                case ControllerAction.OPEN_ACCOUNTS: {
                    state = await viewAccounts({
                        accounts: ModelAccount.getList(),
                        default_account: ModelConfiguration.getDefaultAccount()
                    });
                    break;
                }

                case ControllerAction.OPEN_ACCOUNT: {
                    state = await viewAccount({
                        default_account: ModelConfiguration.getDefaultAccount(),
                        account: ModelAccount.getById(state.action_data as number)
                    });
                    break;
                }

                case ControllerAction.CREATE_ACCOUNT: {
                    state = await viewNewAccount({
                        submit: (fields) => {
                            const account = ModelAccount.create(
                                fields[`name`],
                                zenParseMoney(fields[`balance`])
                            );
                            if (state.confirm_redirect) return {
                                action: state.confirm_redirect,
                                action_data: state.confirm_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_ACCOUNT,
                                action_data: account.id
                            }
                        },
                        cancel: () => {
                            if (state.cancel_redirect) return {
                                action: state.cancel_redirect,
                                action_data: state.cancel_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_ACCOUNTS
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                case ControllerAction.EDIT_ACCOUNT_NAME: {
                    state = await viewEditAccountName({
                        account: ModelAccount.getById(state.action_data as number)
                    }, {
                        submit: (fields) => {
                            const account = ModelAccount.getById(state.action_data as number);
                            account.name = fields[`name`];
                            account.save();
                            return {
                                action: ControllerAction.OPEN_ACCOUNT,
                                action_data: state.action_data
                            }
                        },
                        cancel: () => {
                            return {
                                action: ControllerAction.OPEN_ACCOUNT,
                                action_data: state.action_data
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                case ControllerAction.EDIT_ACCOUNT_DEFAULT: {
                    ModelConfiguration.setDefaultAccount(state.action_data as number);
                    state.action = ControllerAction.OPEN_ACCOUNT;
                    break;
                }

                case ControllerAction.DELETE_ACCOUNT: {
                    state = await viewConfirm({
                        message: `Are you sure you want to delete this account? This action cannot be undone.`
                    }, {
                        confirm: () => {
                            ModelAccount.getById(state.action_data as number).delete();
                            if (state.confirm_redirect) return {
                                action: state.confirm_redirect,
                                action_data: state.confirm_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_ACCOUNTS
                            }
                        },
                        cancel: () => {
                            if (state.cancel_redirect) return {
                                action: state.cancel_redirect,
                                action_data: state.cancel_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_ACCOUNT,
                                action_data: state.action_data
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                /* 
                * START PEOPLE 
                */

                case ControllerAction.OPEN_PEOPLE: {
                    state = await viewPeople({
                        people: ModelPerson.getList(),
                    });
                    break;
                }

                case ControllerAction.OPEN_PERSON: {
                    state = await viewPerson({
                        person: ModelPerson.getById(state.action_data as number)
                    });
                    break;
                }

                case ControllerAction.CREATE_PERSON: {
                    state = await viewNewPerson({
                        submit: (fields) => {
                            const person = ModelPerson.create(
                                fields[`name`],
                                zenParseMoney(fields[`owe_them`]) - zenParseMoney(fields[`owe_you`]),
                            );
                            if (state.confirm_redirect) return {
                                action: state.confirm_redirect,
                                action_data: state.confirm_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_PERSON,
                                action_data: person.id
                            }
                        },
                        cancel: () => {
                            if (state.cancel_redirect) return {
                                action: state.cancel_redirect,
                                action_data: state.cancel_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_PEOPLE
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                case ControllerAction.EDIT_PERSON_NAME: {
                    state = await viewEditPersonName({
                        person: ModelPerson.getById(state.action_data as number)
                    }, {
                        submit: (fields) => {
                            const person = ModelPerson.getById(state.action_data as number);
                            person.name = fields[`name`];
                            person.save();
                            return {
                                action: ControllerAction.OPEN_PERSON,
                                action_data: state.action_data
                            }
                        },
                        cancel: () => {
                            return {
                                action: ControllerAction.OPEN_PERSON,
                                action_data: state.action_data
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                case ControllerAction.DELETE_PERSON: {
                    state = await viewConfirm({
                        message: `Are you sure you want to delete this person? This action cannot be undone.`
                    }, {
                        confirm: () => {
                            ModelPerson.getById(state.action_data as number).delete();
                            if (state.confirm_redirect) return {
                                action: state.confirm_redirect,
                                action_data: state.confirm_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_PEOPLE
                            }
                        },
                        cancel: () => {
                            if (state.cancel_redirect) return {
                                action: state.cancel_redirect,
                                action_data: state.cancel_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_PERSON,
                                action_data: state.action_data
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                /*
                * START CONSUMERS
                */
                case ControllerAction.OPEN_CONSUMERS: {
                    state = await viewConsumers({
                        selected: state.action_data ?
                            ModelConsumer.getById(state.action_data)
                            : null,
                        subconsumers: ModelConsumer.getList(state.action_data),
                    });
                    break;
                }

                case ControllerAction.CREATE_CONSUMER: {
                    state = await viewNewConsumer({
                        submit: (fields) => {
                            const consumer = ModelConsumer.create(
                                fields[`name`],
                                state.action_data ?? null
                            );
                            if (state.confirm_redirect) return {
                                action: state.confirm_redirect,
                                action_data: state.confirm_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_CONSUMERS,
                                action_data: consumer.id
                            }
                        },
                        cancel: () => {
                            if (state.cancel_redirect) return {
                                action: state.cancel_redirect,
                                action_data: state.cancel_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_CONSUMERS,
                                action_data: state.action_data
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                case ControllerAction.EDIT_CONSUMER_NAME: {
                    state = await viewEditConsumerName({
                        consumer: ModelConsumer.getById(state.action_data as number)
                    }, {
                        submit: (fields) => {
                            const consumer = ModelConsumer.getById(state.action_data as number);
                            consumer.name = fields[`name`];
                            consumer.save();
                            return {
                                action: ControllerAction.OPEN_CONSUMERS,
                                action_data: state.action_data
                            }
                        },
                        cancel: () => {
                            return {
                                action: ControllerAction.OPEN_CONSUMERS,
                                action_data: state.action_data
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                case ControllerAction.DELETE_CONSUMER: {
                    state = await viewConfirm({
                        message: `Are you sure you want to delete this consumer? This action cannot be undone.`
                    }, {
                        confirm: () => {
                            const parent = ModelConsumer.getById(state.action_data as number).parent?.id;
                            ModelConsumer.getById(state.action_data as number).delete();
                            if (state.confirm_redirect) return {
                                action: state.confirm_redirect,
                                action_data: state.confirm_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_CONSUMERS,
                                action_data: parent
                            }
                        },
                        cancel: () => {
                            if (state.cancel_redirect) return {
                                action: state.cancel_redirect,
                                action_data: state.cancel_redirect_data
                            }
                            else return {
                                action: ControllerAction.OPEN_CONSUMERS,
                                action_data: state.action_data
                            }
                        },
                        close: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                /*
                * START TRANSACTIONS
                */
                case ControllerAction.OPEN_TRANSACTIONS: {
                    state = await viewTransactions({
                        transactions: ModelTransaction.getList()
                    });
                    break;
                }

                /*case ControllerAction.OPEN_TRANSACTIONS_SEARCH: {
                    state = await viewTransactionsSearch({
                        dataGet: (query) => ModelTransaction.getListBySearch(query)
                    });
                    break;
                }*/

                case ControllerAction.OPEN_TRANSACTION: {
                    state = await viewTransaction({
                        transaction: ModelTransaction.getById(state.action_data as number)
                    });
                    break;
                }

                case ControllerAction.CREATE_TRANSACTION: {
                    state = await viewNewTransaction({
                        getAccount: (id) => ModelAccount.getById(id),
                        getAccounts: () => ModelAccount.getList(),
                        getPerson: (id) => ModelPerson.getById(id),
                        getPeople: () => ModelPerson.getList(),
                        getConsumer: (id) => ModelConsumer.getById(id),
                        getConsumers: () => ModelConsumer.getList(),
                        onSubmit: (sender, reciver, amount, description, timestamp) => {
                            const transaction = ModelTransaction.create(
                                sender,
                                reciver,
                                amount,
                                description,
                                timestamp.valueOf(),
                            );

                            if (sender instanceof ModelAccount || sender instanceof ModelPerson) {
                                sender.balance -= amount;
                                if (reciver instanceof ModelWorld &&
                                    sender instanceof ModelPerson) sender.remission += amount;
                                sender.save();
                            }

                            if (reciver instanceof ModelAccount || reciver instanceof ModelPerson) {
                                reciver.balance += amount;
                                if (sender instanceof ModelWorld &&
                                    reciver instanceof ModelPerson) reciver.remission -= amount;
                                reciver.save();
                            }

                            return {
                                action: ControllerAction.OPEN_TRANSACTION,
                                action_data: transaction.id
                            }
                        },
                        onCancel: () => {
                            return {
                                action: ControllerAction.OPEN_DASHBOARD
                            }
                        },
                        onClose: () => ({ action: ControllerAction.CLOSE })
                    });
                    break;
                }

                case ControllerAction.DELETE_TRANSACTION: {
                    state = await viewConfirm({
                        message: `Are you sure you want to delete this transaction? This action cannot be undone.`
                    }, {
                        confirm: () => {
                            const transaction = ModelTransaction.getById(state.action_data as number);

                            if (transaction.sender instanceof ModelAccount || transaction.sender instanceof ModelPerson) {
                                transaction.sender.balance += transaction.amount;
                                if (transaction.receiver instanceof ModelWorld &&
                                    transaction.sender instanceof ModelPerson)
                                    transaction.sender.remission -= transaction.amount;
                                transaction.sender.save();
                            }

                            if (transaction.receiver instanceof ModelAccount || transaction.receiver instanceof ModelPerson) {
                                transaction.receiver.balance -= transaction.amount;
                                if (transaction.sender instanceof ModelWorld &&
                                    transaction.receiver instanceof ModelPerson)
                                    transaction.receiver.remission += transaction.amount;
                                transaction.receiver.save();
                            }

                            transaction.delete();

                            return { action: ControllerAction.OPEN_TRANSACTIONS }
                        },
                        cancel: () => {
                            return { action: ControllerAction.OPEN_TRANSACTION, action_data: state.action_data }
                        },
                        close: () => {
                            return { action: ControllerAction.CLOSE }
                        }
                    });
                    break;
                }

                /*
                * OTHERS
                */

                default: {
                    console.error(`Unknown state: ${state.action}`);
                    state = { action: ControllerAction.CLOSE };
                    break;
                }

            }
        } while (state.action != ControllerAction.CLOSE);
        Controller.onSave();
    }

}