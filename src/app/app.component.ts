import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ColumnConfig } from 'kles-material-table';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'KlesMaterialTable';
  columns: ColumnConfig[]
  allLines: any[];
  lines: any[];

  lineSelected = new Subject<any[]>();

  /*constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
  }*/
  constructor() { }

  ngOnInit(): void {
    this.columns = [
      {
        columnDef: '#select', sticky: true, header: '', type: '', visible: true,

      },
      {
        columnDef: 'name', header: 'engagement.entityName',
        type: 'text', visible: true, sticky: true,
      },
      {
        columnDef: 'ZRZBCP', header: 'engagement.budgetHolder',
        type: 'text', visible: true, sticky: true,
      },
      {
        columnDef: 'ZRZB01', header: 'engagement.objectiveYTD',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new CurrencyPipe('fr', 'EUR'),
          options: [
            { digitsInfo: '1.0-0' }
          ]
        }]
      },
      {
        columnDef: 'V_FACT', header: 'engagement.invoicedYTD',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new CurrencyPipe('fr', 'EUR'),
          options: [
            { digitsInfo: '1.0-0' }
          ]
        }]
      },
      {
        columnDef: 'ZRZC01', header: 'engagement.%Invoiced/ObjectiveYTD',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new PercentPipe('fr'),
        }]
      },
      {
        columnDef: 'ZRZC02', header: 'engagement.%Invoiced+Current/ObjectiveYTD',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new PercentPipe('fr'),
        }]
      },
      {
        columnDef: 'ZRZE03', header: 'engagement.affectedNotFreeze',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new CurrencyPipe('fr', 'EUR'),
          options: [
            { digitsInfo: '1.0-0' }
          ]
        }]
      },
      {
        columnDef: 'V_FEAN', header: 'engagement.invoiced+Current+AffectedNotFreeze',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new CurrencyPipe('fr', 'EUR'),
          options: [
            { digitsInfo: '1.0-0' }
          ]
        }]
      },
      {
        columnDef: 'ZRZC03', header: 'engagement.%Invoiced+Current+AffectedNotFreeze/Objective',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new PercentPipe('fr'),
        }]
      },
      {
        columnDef: 'ZRZRF1', header: 'engagement.tbd',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new CurrencyPipe('fr', 'EUR'),
          options: [
            { digitsInfo: '1.0-0' }
          ]
        }]
      },
      {
        columnDef: 'ZRZRF2', header: 'engagement.tdbCurrent',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new CurrencyPipe('fr', 'EUR'),
          options: [
            { digitsInfo: '1.0-0' }
          ]
        }]
      },
      {
        columnDef: 'ZRZRF3', header: 'engagement.tdbCurrentAffectedNotFreeze',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new CurrencyPipe('fr', 'EUR'),
          options: [
            { digitsInfo: '1.0-0' }
          ]
        }]
      },
      {
        columnDef: 'ZRZE04', header: 'engagement.affectedFreeze',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new CurrencyPipe('fr', 'EUR'),
          options: [
            { digitsInfo: '1.0-0' }
          ]
        }]
      },
      // {
      //     columnDef: 'V_QTRS', header: 'engagement.amountRemainingQuantity',
      //     type: 'number', visible: true, sticky: true,
      //     pipeTransform: [{
      //         pipe: new CurrencyPipe('fr', 'EUR'),
      //         options: [
      //             { digitsInfo: '1.0-0' }
      //         ]
      //     }]
      // },
      {
        columnDef: 'ZRZE05', header: 'engagement.amountRemainingQuantityNotAllocatedAndNotFrozen',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new CurrencyPipe('fr', 'EUR'),
          options: [
            { digitsInfo: '1.0-0' }
          ]
        }]
      },
      {
        columnDef: 'ZRZE06', header: 'engagement.amountRemainingNotAllocatedFrozenQuantity',
        type: 'number', visible: true, sticky: true,
        pipeTransform: [{
          pipe: new CurrencyPipe('fr', 'EUR'),
          options: [
            { digitsInfo: '1.0-0' }
          ]
        }]
      },
      {
        columnDef: 'status', header: 'engagement.status',
        type: 'text', visible: false, sticky: true
      }
    ];
  }

  saveSelectedLines(event) {

  }
}
