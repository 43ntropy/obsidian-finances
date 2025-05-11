import { ModelTransaction } from "src/model/Transaction";
import { ControllerAction, ControllerState } from "src/module/ControllerUiState";
import { createSelectionModal } from "src/module/ModalSelection";
import { transactionActor, transactionDate } from "src/module/Utils";

export async function viewTransaction(placeholder: {
    transaction: ModelTransaction;
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createSelectionModal(`💳 Transaction #${placeholder.transaction.id}`,
            [
                {
                    text: `📤 Sender: ${transactionActor(placeholder.transaction.sender)}`,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTION,
                        action_data: placeholder.transaction.id,
                    },
                },
                {
                    text: `📥 Receiver: ${transactionActor(placeholder.transaction.receiver)}`,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTION,
                        action_data: placeholder.transaction.id,
                    },
                },
                {
                    text: `💰 Amount: ${placeholder.transaction.amount}`,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTION,
                        action_data: placeholder.transaction.id,
                    },
                },
                {
                    text: `📝 Description: ${placeholder.transaction.description}`,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTION,
                        action_data: placeholder.transaction.id,
                    },
                },
                {
                    text: `📅 Date: ${transactionDate(placeholder.transaction)}`,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTION,
                        action_data: placeholder.transaction.id,
                    },
                },
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTION,
                        action_data: placeholder.transaction.id,
                    },
                },
                {
                    text: `🗑️ Delete`,
                    value: {
                        action: ControllerAction.DELETE_TRANSACTION,
                        action_data: placeholder.transaction.id,
                    },
                },
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTION,
                        action_data: placeholder.transaction.id,
                    },
                },
                {
                    text: `🔙 Back`,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTIONS,
                    },
                }
            ],
            (item) => resolve(item),
            () => resolve({ action: ControllerAction.CLOSE }),
        );
    });
}