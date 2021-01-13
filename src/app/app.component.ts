import { CurrencyPipe, PercentPipe, UpperCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  IKlesFieldConfig, KlesFormCheckboxComponent, KlesFormColorComponent,
  KlesFormInputComponent, KlesFormLabelComponent
} from '@3kles/kles-material-dynamicforms';
import { KlesColumnConfig, KlesTableDirective, KlesTableComponent, KlesTableConfig, KlesTableService, KlesFormTextHeaderFilterComponent } from 'kles-material-table';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(KlesTableDirective, { static: false }) tableContainer: KlesTableDirective;
  table: KlesTableComponent;
  tableConfig: KlesTableConfig;
  columns: KlesColumnConfig[];

  title = 'KlesMaterialTable';
  allLines: any[];
  lines: any[] = [];
  pageSize = 10;
  pageSizeOptions = [10, 25, 50]

  lineSelected = new Subject<any[]>();

  constructor(
    private ref: ChangeDetectorRef,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log('Table Status=', this.tableContainer);
    //this.table=this.tableContainer.componentRef.instance.table;
    this.initColumns();
    this.loadData();
    this.ref.detectChanges();

  }

  loadData() {
    this.lines = [
      { beginvalue: 1, endvalue: 10, color: '#ff67' },
      { beginvalue: 10, endvalue: 20, color: '#ffee' },
      { beginvalue: 20, endvalue: 30, color: '#dfac' },
      { beginvalue: 30, endvalue: 40, color: '#ff67ff' },
      { beginvalue: 40, endvalue: 50, color: '#ffeeff' },
      { beginvalue: 50, endvalue: 60, color: '#dfacff' },
      { beginvalue: 60, endvalue: 70, color: '#ff6799' },
      { beginvalue: 70, endvalue: 80, color: '#ffee99' },
      { beginvalue: 80, endvalue: 90, color: '#dfac99' },
      { beginvalue: 90, endvalue: 100, color: '#ff6755' },
      { beginvalue: 100, endvalue: 110, color: '#ffee55' },
      { beginvalue: 110, endvalue: 120, color: '#dfac55' },
      { beginvalue: 120, endvalue: 130, color: '#ff6722' },
      { beginvalue: 130, endvalue: 140, color: '#ffee22' },
      { beginvalue: 140, endvalue: 150, color: '#dfac22' },
      { beginvalue: 150, endvalue: 160, color: '#ff6711' },
      { beginvalue: 160, endvalue: 170, color: '#ffee11' },
      { beginvalue: 170, endvalue: 180, color: '#dfac11' },
      { beginvalue: 180, endvalue: 190, color: '#5FFF4F' },
      { beginvalue: 190, endvalue: 200, color: '#0FF1F1' },
      { beginvalue: 200, endvalue: 210, color: '#DEDEDE' },
    ]
  }

  initColumns() {
    this.columns = [
      {
        columnDef: '#select', sticky: true, header: '', type: '', visible: true,
        headerCell: {
          type: 'checkbox',
          name: '#select',
          component: KlesFormCheckboxComponent,
          indeterminate: false,
        } as IKlesFieldConfig,
        cell: {
          type: 'checkbox',
          name: '#select',
          component: KlesFormCheckboxComponent,
          indeterminate: false,
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'beginvalue', header: 'statusSettings.beginValue.text',
        type: 'text', visible: true, sticky: true,
        resizable: true,
        headerCell: {
          type: 'input',
          name: 'beginvalue',
          component: KlesFormLabelComponent,
          value: 'Begin',
          pipeTransform: [{
            pipe: new UpperCasePipe
          }]
        } as IKlesFieldConfig,
        cell: {
          type: 'input',
          component: KlesFormLabelComponent,
          //label: 'beginvalue',
          inputType: 'number',
          name: 'beginvalue',
          //disabled: true,
          //ngStyle: '{color:black; background-color:red}',
          //excludeForm: true,
          validations: [
            {
              name: 'required',
              validator: Validators.required,
              message: 'statusSettings.beginvalue.validator.required'
            },
            {
              name: 'pattern',
              validator: Validators.pattern('^([0-9][0-9]{0,2}|1000)$'),
              message: 'statusSettings.beginvalue.validator.notValid'
            }
          ]
        } as IKlesFieldConfig
      },
      {
        columnDef: 'endvalue', header: 'statusSettings.endValue.text',
        type: 'text', visible: true, sticky: true,
        resizable: true,
        headerCell: {
          type: 'input',
          name: 'endvalue',
          label: this.translateService.instant('statusSettings.endValue.text'),
          placeholder: this.translateService.instant('filter.text'),
          //tooltip: this.getTooltip(),
          component: KlesFormTextHeaderFilterComponent,
          pipeTransform: [{
            pipe: new UpperCasePipe
          }]
        } as IKlesFieldConfig,
        cell: {
          type: 'input',
          component: KlesFormInputComponent,
          //label: 'endvalue',
          inputType: 'number',
          name: 'endvalue',
          validations: [
            {
              name: 'required',
              validator: Validators.required,
              message: 'statusSettings.endValue.validator.required'
            },
            {
              name: 'pattern',
              validator: Validators.pattern('^([0-9][0-9]{0,2}|1000)$'),
              message: 'statusSettings.endValue.validator.notValid'
            }
          ]
        } as IKlesFieldConfig
      },

      {
        columnDef: 'color', header: 'statusSettings.color.text',
        type: 'text', visible: true, sticky: true,
        resizable: true,
        headerCell: {
          type: 'input',
          name: 'color',
          component: KlesFormLabelComponent,
          value: 'color',
          label: this.translateService.instant('statusSettings.color.text'),
        } as IKlesFieldConfig,
        cell: {
          type: 'color',
          component: KlesFormColorComponent,
          //label: 'color',
          name: 'statusSettings.color.text',
          validations: [
            {
              name: 'required',
              validator: Validators.required,
              message: 'statusSettings.color.validator.required'
            },
            {
              name: 'pattern',
              validator: Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'),
              message: 'statusSettings.color.validator.notValid'
            }
          ]
        } as IKlesFieldConfig
      },
      {
        columnDef: '#checker', sticky: true, header: '', type: '', visible: true,
        headerCell: {
          type: 'input',
          name: '#checker',
          component: KlesFormLabelComponent,
          value: 'Begin',
          pipeTransform: [{
            pipe: new UpperCasePipe
          }]
        } as IKlesFieldConfig,
        cell: {
          type: 'text',
          name: '#checker',
          component: KlesFormLabelComponent,
        } as IKlesFieldConfig,
      }

    ];

    this.tableConfig = {
      tableComponent: KlesTableComponent,
      columns: this.columns,
      tableService: new KlesTableService()
    }
  }
}
