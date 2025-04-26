import FinancialTracker from "main";
import { SuggestModal } from "obsidian";
import { ControllerState } from "./ControllerUiState";
import Fuse, { FuseIndex } from 'fuse.js';

export type SelectionModalData = {
    text: string;
    value: ControllerState;
}

class SearchModal extends SuggestModal<SelectionModalData> {
    private modalData: SelectionModalData[];
    private cbDataGet: (query: string) => SelectionModalData[];
    private fuse: Fuse<SelectionModalData>;
    private fuseIndex: FuseIndex<SelectionModalData>;

    constructor(title: string, cbDataGet: (query: string) => SelectionModalData[]) {
        super(FinancialTracker.PLUGIN_APP);
        this.setPlaceholder(title);
        this.fuse = new Fuse([], {
            includeScore: false,
            threshold: 0.3
        });
        this.cbDataGet = cbDataGet;
    }

    getSuggestions(query: string): SelectionModalData[] {
        if (query.length <= 3) {
            this.modalData = this.cbDataGet(query);
            this.fuseIndex = Fuse.createIndex(['text'], this.modalData)
            this.fuse.setCollection(this.modalData, this.fuseIndex);
            return this.modalData;
        }
        else {
            return this.fuse.search(query).map(result => result.item);
        }
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
 * @param onSelect The function to call when an entry is selected.
 * @param onClose The function to call when the modal is closed.
 */
export function createSearchModal(
    title: string,
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