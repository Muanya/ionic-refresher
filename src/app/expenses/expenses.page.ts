import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit {

  expense: number = 0
  reason: string = ""
  total: number = 0

  constructor() { }

  ngOnInit() {
  }

  clear(){
    this.reason = ""
    this.expense = 0
  }

  addExpense(){

    if(this.expense <= 0 || this.reason == ""){
      return;
    }
    this.total += this.expense
    var newItem = document.createElement('ion-item')
    newItem.textContent = this.reason + " : " + this.expense
    document.querySelector("#expenses-list")!.appendChild(newItem)

    this.clear()

  }

}
