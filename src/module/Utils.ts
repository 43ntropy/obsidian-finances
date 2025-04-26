import { ModelAccount } from "src/model/Account";
import { ModelConsumer } from "src/model/Consumer";
import { ModelPerson } from "src/model/Person";
import { ModelTransaction } from "src/model/Transaction";
import { ModelWorld } from "src/model/World";

export function zenParseMoney(value: string): number {
    if (value == null || value == undefined || value == ``) return 0;
    value = value.replace(/,/g, '.');
    return parseFloat(parseFloat(value).toFixed(2));
}

export function transactionIcon(transaction: ModelTransaction): string {
    let icon = `🤔🤔`;

    if (transaction.sender instanceof ModelAccount)
        if (transaction.receiver instanceof ModelAccount) icon = `📦💳`; // Account Transfer
        else if (transaction.receiver instanceof ModelPerson) icon = `📤🤝`; // Outgoing Loan
        else if (transaction.receiver instanceof ModelWorld) icon = `📉💳`; // Outgoing Generic
        else if (transaction.receiver instanceof ModelConsumer) icon = `📉💳`; // Consumerized Expense
        else throw new Error(`Unknown receiver type: ${transaction.receiver}`);
    else if (transaction.sender instanceof ModelPerson)
        if (transaction.receiver instanceof ModelAccount) icon = `📥🤝`; // Incoming loan
        else if (transaction.receiver instanceof ModelPerson) icon = `📦🤝`; // Loan Transfer
        else if (transaction.receiver instanceof ModelWorld) icon = `📈🙏`; // Incoming Remission
        else if (transaction.receiver instanceof ModelConsumer) icon = `🤔🤔`; // Strange (?Tracking People Offers?)
        else throw new Error(`Unknown receiver type: ${transaction.receiver}`);
    else if (transaction.sender instanceof ModelWorld)
        if (transaction.receiver instanceof ModelAccount) icon = `📈💳`; // Generic Income
        else if (transaction.receiver instanceof ModelPerson) icon = `📉🙏`; // Outgoing Remission
        else if (transaction.receiver instanceof ModelWorld) icon = `🤔🤔`; // Def strange
        else if (transaction.receiver instanceof ModelConsumer) icon = `🤔🤔`; // Strange (?Tracking External Offers?)
        else throw new Error(`Unknown receiver type: ${transaction.receiver}`);
    else throw new Error(`Unknown sender type: ${transaction.sender}`);

    return icon;
}

export function transactionDate(transaction: ModelTransaction): string {
    // TODO: Add localization support
    return `[${new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(transaction.timestamp)}]`
}

export function transactionActor(actor: ModelAccount | ModelPerson | ModelConsumer | ModelWorld): string {
    if (actor instanceof ModelAccount) return `💳 ${actor.name}`;
    else if (actor instanceof ModelPerson) return `👤 ${actor.name}`;
    else if (actor instanceof ModelConsumer) return `🛍️ ${actor.name}`;
    else if (actor instanceof ModelWorld) return `🌍 World`;
    else throw new Error(`Unknown actor type: ${actor}`);
}