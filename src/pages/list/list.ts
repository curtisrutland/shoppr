import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { ShoppingList, ShoppingListItem } from '../../models/index';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  list: ShoppingList;
  newItem: string = "";
  hideChecked: boolean = false;
  private deleting = false;
  @ViewChild("newitem") newItemInput;

  get listItems() {
    return this.hideChecked
      ? this.list.items.filter(i => !i.checked)
      : this.list.items;
  }

  get sortButtonText() {
    return this.hideChecked ? "Show Checked Items" : "Hide Checked Items";
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionCtrl: ActionSheetController,
    private listSvc: ListService
  ) {
    this.list = navParams.get("list");
    if (!this.list)
      this.list = new ShoppingList("");
    listSvc.getHideChecked().then(v => this.hideChecked = v);
  }
  
  update() {
    console.log("UPDATE");
    this.listSvc.updateList(this.list);
  }

  add() {
    this.newItem = this.newItem.trim();
    if (this.newItem)
      this.list.items.push(new ShoppingListItem(this.newItem));
    this.newItem = "";
    this.newItemInput.setFocus();
    this.update();
  }

  remove(item: ShoppingListItem) {
    this.list.items = this.list.items.filter(i => i.id !== item.id);
    this.listSvc.updateList(this.list);
  }

  showSettings() {
    this.actionCtrl.create({
      title: "Settings",
      buttons: [{
        text: this.sortButtonText,
        icon: "eye",
        handler: () => {
          this.hideChecked = !this.hideChecked;
          this.listSvc.setHideChecked(this.hideChecked);
        }
      }, {
        text: "Delete This List",
        role: "destructive",
        icon: "trash",
        cssClass: "red",
        handler: () => {
          this.promptDeleteList();
        }
      }]
    }).present();
  }

  promptDeleteList() {
    this.alertCtrl.create({
      title: "Are you sure?",
      message: `Do you want to delete your list named '${this.list.title}'? There is no way to undo this.`,
      buttons: ["Cancel", {
        text: "Yes I'm Sure",
        cssClass: "red",
        handler: () => this.deleteList()
      }]
    }).present();
  }

  deleteList(nav: boolean = true) {
    this.deleting = true;
    this.listSvc.deleteList(this.list).then(() => {
      if(nav)
        this.navCtrl.goToRoot({ animate: true });
    });
  }

  ionViewWillLeave() {
    if (this.deleting) return;
    let titleEmpty = !this.list.title.trim();
    if(titleEmpty && this.list.items.length < 1) {
      this.deleteList(false);
      return;
    }
    if (titleEmpty) {
      let d = new Date();
      this.list.title = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
      this.update();
    }
  }
}
