import { ModelConsumer } from "src/model/Consumer";
import { ControllerAction, ControllerState } from "src/module/ControllerUiState";
import { createSelectionModal, SelectionModalData } from "src/module/ModalSelection";

export async function viewConsumers(placeholder: {
    selected: ModelConsumer | null;
    subconsumers: ModelConsumer[];
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createSelectionModal(`${placeholder.selected == null ?
            `🏷️ Consumers` :
            `🏷️ ${placeholder.selected.name}`}`,
            [
                ...(placeholder.selected != null ?
                    [
                        {
                            // TODO: Add ongoing expenses calculation
                            text: `◼️ Ongoing Expanses: N/A`,
                            value: {
                                action: ControllerAction.OPEN_CONSUMERS,
                                action_data: placeholder.selected.id
                            }
                        },
                        {
                            text: ` `,
                            value: {
                                action: ControllerAction.OPEN_CONSUMERS,
                                action_data: placeholder.selected.id
                            }
                        },
                        {
                            text: `✏️ Rename`,
                            value: {
                                action: ControllerAction.EDIT_CONSUMER_NAME,
                                action_data: placeholder.selected.id
                            }

                        },
                        {
                            text: `🗑️ Delete`,
                            value: {
                                action: ControllerAction.DELETE_CONSUMER,
                                action_data: placeholder.selected.id
                            }
                        },
                        {
                            text: ` `,
                            value: {
                                action: ControllerAction.OPEN_CONSUMERS,
                                action_data: placeholder.selected.id
                            }
                        }
                    ]
                    : []) as SelectionModalData[],
                ...(placeholder.selected == null ? [
                    {
                        text: `▼ Consumers`,
                        value: {
                            action: ControllerAction.OPEN_CONSUMERS,
                        }
                    }
                ] as SelectionModalData[] : [
                    {
                        text: `▼ Subconsumers`,
                        value: {
                            action: ControllerAction.OPEN_CONSUMERS,
                            action_data: placeholder.selected?.id
                        }
                    }
                ] as SelectionModalData[]),
                ...placeholder.subconsumers.map<SelectionModalData>((consumer): SelectionModalData => ({
                    text: `➜ ${consumer.name}`,
                    value: {
                        action: ControllerAction.OPEN_CONSUMERS,
                        action_data: consumer.id
                    }
                })),
                ...(placeholder.selected == null ? [
                    {
                        text: `➕ New consumer`,
                        value: {
                            action: ControllerAction.CREATE_CONSUMER,
                        }
                    }
                ] as SelectionModalData[] : [
                    {
                        text: `➕ New subconsumer`,
                        value: {
                            action: ControllerAction.CREATE_CONSUMER,
                            action_data: placeholder.selected.id
                        }
                    }
                ] as SelectionModalData[]),
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_CONSUMERS,
                        action_data: placeholder.selected?.id
                    }
                },
                {
                    text: `🔙 Back`,
                    value: placeholder.selected == null ? {
                        action: ControllerAction.OPEN_DASHBOARD,
                    } : {
                        action: ControllerAction.OPEN_CONSUMERS,
                        action_data: placeholder.selected.parent?.id
                    }
                }
            ],
            (item) => resolve(item),
            () => resolve({ action: ControllerAction.CLOSE })
        );
    })
}