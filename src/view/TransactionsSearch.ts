/*export async function viewTransactionsSearch(cb: {
    dataGet: (query: string) => ModelTransaction[];
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createSearchModal(`💳 Transactions`,
            (query: string) => {
                const transactions = cb.dataGet(query);
                return transactions.map((transaction): SelectionModalData => ({
                    text: `${transactionDate(transaction)} ${transactionIcon(transaction)} ${transaction.description} (${transaction.amount}€)`,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTION,
                        action_data: transaction.id,
                    },
                }));
            },
            (item) => resolve(item),
            () => resolve({ action: ControllerAction.CLOSE }),
        );
    });
}*/