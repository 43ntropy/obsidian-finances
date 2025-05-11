import { ModelTransaction } from "src/model/Transaction";
import { ControllerAction, ControllerState } from "src/module/ControllerUiState";
import { createSelectionModal, SelectionModalData } from "src/module/ModalSelection";
import { transactionDate, transactionIcon } from "src/module/Utils";

export async function viewTransactions(placeholder: {
    transactions: ModelTransaction[];
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createSelectionModal(`💳 Transactions`,
            [
                ...placeholder.transactions.map((transaction): SelectionModalData => ({
                    text: `${transactionDate(transaction)} ${transactionIcon(transaction)} ${transaction.description} (${transaction.amount}€)`,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTION,
                        action_data: transaction.id
                    }
                })),
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTIONS,
                    }
                },
                {
                    text: `🔙 Back`,
                    value: {
                        action: ControllerAction.OPEN_DASHBOARD,
                    }
                }
            ],
            (item) => resolve(item),
            () => resolve({ action: ControllerAction.CLOSE })
        );
    });
}