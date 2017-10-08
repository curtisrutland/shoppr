import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { ShoppingList } from "../models";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ListService {

    private _hideChecked: boolean = null;
    private _listsModified: Subject<ShoppingList[]> = new Subject();
    
    listUpdates$ = this._listsModified.asObservable();

    constructor(private storage: Storage) { }

    private fetchLists() {
        return this.storage.get("lists") as Promise<ShoppingList[]>;
    }

    private async initialize() {
        await this.clearAllLists();
        await this.storage.set("hideChecked", false);
        this._hideChecked = false;
        await this.storage.set("lists", []);
    }

    private async updateLists(lists: ShoppingList[]) {
        await this.storage.set("lists", lists);
        this._listsModified.next(lists);
    }

    async addList(list: ShoppingList) {
        let lists = await this.fetchLists();
        if (lists == null) lists = [];
        lists.push(list);
        await this.updateLists(lists);
    }

    async getLists(): Promise<ShoppingList[]> {
        let lists = await this.fetchLists();
        if (!lists) {
            await this.initialize();
            lists = [];
        }
        return lists;
    }

    async updateList(list: ShoppingList) {
        let lists = await this.getLists();
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].id === list.id) {
                lists[i] = list;
            }
        }
        await this.updateLists(lists);
    }

    async deleteList(list: ShoppingList) {
        let lists = await this.getLists();
        await this.updateLists(lists.filter(l => l.id !== list.id));
        return await this.getLists();
    }

    async clearAllLists() {
        await this.storage.clear();
        this._listsModified.next();
    }

    async setHideChecked(val: boolean) {
        this._hideChecked = val;
        await this.storage.set("hideChecked", val);
    }

    async getHideChecked() {
        if (this._hideChecked !== null)
            return this._hideChecked;
        let val = <boolean>await this.storage.get("hideChecked");
        if(val == null) {
            val = false;
            await this.setHideChecked(false);
        }
        this._hideChecked = val;
        return val;
    }
}