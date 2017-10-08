import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListService } from '../../services/list.service';
import { ShoppingList } from '../../models/index';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  lists: ShoppingList[] = [];

  constructor(
    public navCtrl: NavController,
    private listSvc: ListService, ) {
    this.getLists();
    listSvc.listUpdates$.subscribe(lists => this.lists = lists);
  }

  ionViewDidLoad() {
    console.log("home loaded");
    this.getLists();
  }

  gotoList(list: ShoppingList) {
    return this.navCtrl.push(ListPage, { list });
  }

  async addList() {
    let list: ShoppingList = new ShoppingList();
    await this.listSvc.addList(list);
    await this.gotoList(list);
    this.getLists();
  }

  async getLists() {
    this.lists = await this.listSvc.getLists();
  }

  async clearLists() {
    await this.listSvc.clearAllLists();
    this.getLists();
  }
}
