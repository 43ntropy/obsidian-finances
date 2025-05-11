import Finances from "main";
import { SuggestModal } from "obsidian";
import { ControllerState } from "./ControllerUiState";
import Fuse, { FuseIndex } from 'fuse.js';

export type SelectionModalData = {
    text: string;
    value: ControllerState;
}

class SearchModal extends SuggestModal<SelectionModalData> {
    private iFuse: Fuse<SelectionModalData>;
    private iFuseIndex: FuseIndex<SelectionModalData>;

    private modalData: SelectionModalData[];

    private cbDataGet: (query: string) => SelectionModalData[];

    constructor(title: string, cbDataGet: (query: string) => SelectionModalData[]) {
        super(Finances.APP);
        this.setPlaceholder(title);
        this.iFuse = new Fuse([], {
            threshold: 0.3
        });
        this.cbDataGet = cbDataGet;
    }

    getSuggestions(query: string): SelectionModalData[] {
        if (query.length == 0 ) return [];
        if (query.length <= 3) {
            this.modalData = this.cbDataGet(query);
            this.iFuseIndex = Fuse.createIndex(['text'], this.modalData)
            this.iFuse.setCollection(this.modalData, this.iFuseIndex);
            return this.modalData;
        }
        return this.iFuse.search(query).map(result => result.item);
    }

    renderSuggestion(value: SelectionModalData, el: HTMLElement): void {
        el.createEl('div', { text: value.text });
    }

    onChooseSuggestion(item: SelectionModalData, evt: MouseEvent | KeyboardEvent): void { }

}

/**
 * Creates a modal with a list of entries.
 * @param title The title of the modal.
 * @param entries The entries to display in the modal.
 * @param onDataGet The function to call to get data based on the query.
 * @param onSelect The function to call when an entry is selected.
 * @param onClose The function to call when the modal is closed.
 */
export function createSearchModal(
    title: string,
    entries: SelectionModalData[],
    onDataGet: (query: string) => SelectionModalData[],
    onSelect: (item: ControllerState) => void,
    onClose: () => void
): void {

    const modal = new SearchModal(title, onDataGet);

    //! Workaround for close event called before choose event
    let closeCallback: NodeJS.Timeout;

    modal.onChooseSuggestion = (item: SelectionModalData) => {
        clearTimeout(closeCallback); //! -> Workaround 
        onSelect(item.value);
    }

    modal.onClose = () => {
        closeCallback = setTimeout(() => { onClose(); }, 10); //! -> Workaround 
    }

    modal.open();

}