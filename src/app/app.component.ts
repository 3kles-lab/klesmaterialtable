import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  IKlesFieldConfig, IKlesValidator, KlesDynamicFormComponent, KlesFormButtonCheckerComponent, KlesFormButtonComponent, KlesFormCheckboxComponent, KlesFormColorComponent,
  KlesFormDateComponent,
  KlesFormInputComponent, KlesFormLabelComponent, KlesFormTextComponent,
  autocompleteObjectValidator
} from '@3kles/kles-material-dynamicforms';
import {
  KlesColumnConfig, KlesTableDirective, KlesTableComponent, KlesTableConfig, KlesTableService,
  KlesFormTextHeaderFilterComponent
} from 'kles-material-table';
import * as _ from 'lodash';
import { Observable, of, timer } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { FakeApiService } from './services/fakemi.service';
import { IMIResponse } from '@infor-up/m3-odin';
import { TableService } from './services/table.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MMS005MI_LstWarehouses, CRS912MI_LstSeason, PMS120MI_LstOrderType, MNS150MI_LstUserData } from './services/recordList';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IKlesDynamicFormDataDialog, KlesDynamicFormDialogComponent } from '@3kles/kles-material-dialog';
import { AutocompleteComponent } from './components/autocomplete.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild(KlesDynamicFormComponent, { static: false }) form: KlesDynamicFormComponent;
  fields: IKlesFieldConfig[] = [
    {
      name: 'load',
      icon: 'update',
      color: 'accent',
      ngClass: 'mat-mini-fab',
      disabled: false,
      component: KlesFormButtonComponent
    },
    {
      name: 'delete',
      icon: 'delete',
      color: 'accent',
      ngClass: 'mat-mini-fab',
      disabled: true,
      component: KlesFormButtonComponent
    },
    {
      name: 'add',
      icon: 'add',
      color: 'accent',
      ngClass: 'mat-mini-fab',
      disabled: false,
      component: KlesFormButtonComponent
    },
    {
      name: 'update',
      icon: 'edit',
      color: 'accent',
      ngClass: 'mat-mini-fab',
      disabled: true,
      component: KlesFormButtonComponent
    },
    {
      name: 'export',
      iconSvg: 'excel',
      color: 'accent',
      ngClass: 'mat-mini-fab',
      disabled: false,
      component: KlesFormButtonComponent
    }
  ];

  formValidators: IKlesValidator<ValidatorFn>[] = [];

  @ViewChild(KlesTableDirective, { static: false }) tableContainer: KlesTableDirective;
  table: KlesTableComponent;
  columns: KlesColumnConfig[];
  tableConfig: KlesTableConfig;

  listFormField: IKlesFieldConfig[] = [];

  title = 'KlesMaterialTable';

  lines: any[] = [];

  listWarehouse: any = [];
  listSeason = [];
  listOrderType = [];
  listStandardRouting = [];
  listWorkCenter = [];
  listResponsible = [];

  isLoading = false;

  constructor(
    private ref: ChangeDetectorRef,
    protected dialog: MatDialog,
    protected translate: TranslateService,
    protected miService: FakeApiService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'excel',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/excel.svg')
    );
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit');
    this.setTable();
  }

  async ngOnInit() {
    this.listWarehouse = await (this.miService.execute(MMS005MI_LstWarehouses).pipe(map(m => m.items))).toPromise();
    console.log('ListWarehouse=', this.listWarehouse);
    this.listSeason = await (this.miService.execute(CRS912MI_LstSeason).pipe(map(m => m.items))).toPromise();
    console.log('ListSeason=', this.listSeason);
    this.listOrderType = await (this.miService.execute(PMS120MI_LstOrderType).pipe(map(m => m.items))).toPromise();
    console.log('ListOrderType=', this.listOrderType);
    this.listResponsible = await (this.miService.execute(MNS150MI_LstUserData).pipe(map(m => m.items))).toPromise();
    console.log('ListResponsible=', this.listResponsible);

    this.columns = [
      {
        //Selection column
        columnDef: '#select', sticky: true, visible: true,
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
        } as IKlesFieldConfig,
      },
      {
        //Column to view result API
        columnDef: 'Api', sticky: true, visible: false,
        headerCell: {
          name: 'Api',
          type: 'input',
          label: 'result.text',
          component: KlesFormTextComponent,
          value: 'result.text',//this.translate.instant('result.text'),
          placeholder: 'result.text'
        } as IKlesFieldConfig,
        cell: {
          type: 'text',
          name: 'Api',
          component: KlesFormTextComponent,
        } as IKlesFieldConfig,
      },
      {
        //Check column to view error
        columnDef: '#checker', sticky: true, visible: true,
        headerCell: {
          inputType: 'text',
          name: '#checker',
          component: KlesFormTextComponent,
          value: this.translate.instant('checker.text'),
        } as IKlesFieldConfig,
        cell: {
          type: 'text',
          name: '#checker',
          label: 'Voir error',
          color: 'accent',
          ngClass: 'mat-raised-button',
          component: KlesFormButtonCheckerComponent,
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'Division',
        sticky: false,
        visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          type: 'text',
          name: 'Division',
          label: this.translate.instant('division.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          type: 'text',
          name: 'Division',
          component: KlesFormTextComponent,
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'Facility', sticky: false, visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          type: 'text',
          name: 'Facility',
          label: this.translate.instant('facility.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          type: 'text',
          name: 'Facility',
          component: KlesFormTextComponent,
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'Warehouse', sticky: false, visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          type: 'text',
          name: 'Warehouse',
          label: this.translate.instant('warehouse.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          name: 'Warehouse',
          inputType: 'text',
          component: KlesFormInputComponent,
          autocomplete: true,
          options: this.listWarehouse,//.map(m => m.WHLO)
          autocompleteComponent: AutocompleteComponent,
          displayWith: ((value: any) => {
            return this.displayWithKeyLabel(value);
          }),
          property: 'WHLO',
          validations: [
            {
              name: 'list',
              message: this.translate.instant('autocomplete.notInList'),
              validator: this.autocompleteObjectValidator()
            }
          ]
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'Style', sticky: false, visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          type: 'text',
          name: 'Style',
          label: this.translate.instant('style.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          type: 'text',
          name: 'Style',
          component: KlesFormInputComponent,
          asyncValidations: [{
            name: 'checkStyle',
            message: '',
            validator: this.checkStyle()
          }]
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'Color', sticky: false, visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          type: 'text',
          name: 'Color',
          label: this.translate.instant('color.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          type: 'text',
          name: 'Color',
          component: KlesFormInputComponent,
          asyncValidations: [{
            name: 'checkColor',
            message: '',
            validator: this.checkColor()
          }]
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'Size', sticky: false, visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          type: 'text',
          name: 'Size',
          label: this.translate.instant('size.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          type: 'text',
          name: 'Size',
          component: KlesFormInputComponent,
          asyncValidations: [{
            name: 'checkSize',
            message: '',
            validator: this.checkSize()
          }]
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'ItemNumber', sticky: false, visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          type: 'text',
          name: 'ItemNumber',
          label: this.translate.instant('itemNumber.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          type: 'text',
          name: 'ItemNumber',
          component: KlesFormInputComponent,
          asyncValidations: [{
            name: 'checkItem',
            message: '',
            validator: this.checkItemNumber()
          }]
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'Quantity', sticky: false, visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          type: 'text',
          name: 'Quantity',
          label: this.translate.instant('quantity.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          inputType: 'number',
          name: 'Quantity',
          component: KlesFormInputComponent,
          validations: [{
            name: 'required',
            validator: Validators.required,
            message: 'Required'
          },
          {
            name: 'min',
            validator: Validators.min(0.000001),
            message: 'Min'
          },
          {
            name: 'max',
            validator: Validators.max(999999999999),
            message: 'Max'
          },
          {
            name: 'decimal',
            validator: Validators.pattern('[0-9]+(\.[0-9]{0,6}?)?'),
            message: 'Decimal'
          }]
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'OrderType', sticky: false, visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          type: 'text',
          name: 'OrderType',
          label: this.translate.instant('orderType.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          type: 'text',
          name: 'OrderType',
          component: KlesFormInputComponent,
          autocomplete: true,
          options: this.listOrderType,
          autocompleteComponent: AutocompleteComponent,
          displayWith: ((value: any) => {
            return this.displayWithKeyLabel(value);
          }),
          property: 'ORTY',
          validations: [
            {
              name: 'list',
              message: this.translate.instant('autocomplete.notInList'),
              validator: this.autocompleteObjectValidator(true)
            }
          ]
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'ProjectNumber',
        sticky: false,
        visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          inputType: 'text',
          name: 'ProjectNumber',
          label: this.translate.instant('projectNumber.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          inputType: 'text',
          name: 'ProjectNumber',
          component: KlesFormInputComponent,
          autocomplete: true,
          options: this.listSeason,
          autocompleteComponent: AutocompleteComponent,
          displayWith: ((value: any) => {
            return this.displayWithKeyLabel(value);
          }),
          property: 'SEA1',
          validations: [
            {
              name: 'list',
              message: this.translate.instant('autocomplete.notInList'),
              validator: this.autocompleteObjectValidator(true)
            }
          ]
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'PlannedDate',
        sticky: false,
        visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          inputType: 'text',
          name: 'PlannedDate',
          label: this.translate.instant('plannedDate.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          inputType: 'text',
          name: 'PlannedDate',
          component: KlesFormDateComponent,
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'StandardRouting',
        sticky: false,
        visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          inputType: 'text',
          name: 'StandardRouting',
          label: this.translate.instant('standardRouting.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          inputType: 'text',
          name: 'StandardRouting',
          component: KlesFormInputComponent,
          autocomplete: true,
          options: this.listStandardRouting,
          autocompleteComponent: AutocompleteComponent,
          displayWith: ((value: any) => {
            return this.displayWithKeyLabel(value);
          }),
          property: 'AOID',
          validations: [
            {
              name: 'list',
              message: this.translate.instant('autocomplete.notInList'),
              validator: this.autocompleteObjectValidator(true)
            }
          ]
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'WorkCenter',
        sticky: false,
        visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          inputType: 'text',
          name: 'WorkCenter',
          label: this.translate.instant('workCenter.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          inputType: 'text',
          name: 'WorkCenter',
          component: KlesFormInputComponent,
          autocomplete: true,
          options: this.listWorkCenter,
          autocompleteComponent: AutocompleteComponent,
          displayWith: ((value: any) => {
            return this.displayWithKeyLabel(value);
          }),
          property: 'PLGR',
          validations: [
            {
              name: 'list',
              message: this.translate.instant('autocomplete.notInList'),
              validator: this.autocompleteObjectValidator(true)
            }
          ]
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'Responsible',
        sticky: false,
        visible: true,
        filterable: true,
        sortable: true,
        headerCell: {
          inputType: 'text',
          name: 'Responsible',
          label: this.translate.instant('responsible.text'),
          placeholder: this.translate.instant('filter.text'),
          component: KlesFormTextHeaderFilterComponent,
        } as IKlesFieldConfig,
        cell: {
          inputType: 'text',
          name: 'Responsible',
          component: KlesFormInputComponent,
          autocomplete: true,
          options: this.listResponsible,
          autocompleteComponent: AutocompleteComponent,
          displayWith: ((value: any) => {
            return this.displayWithKeyLabel(value);
          }),
          property: 'USID',
          validations: [
            {
              name: 'list',
              message: this.translate.instant('autocomplete.notInList'),
              validator: this.autocompleteObjectValidator(true)
            }
          ]
        } as IKlesFieldConfig,
      }
    ];

    this.tableConfig = {
      tableComponent: KlesTableComponent,
      columns: this.columns,
      // hidePaginator: true,
      tableService: new TableService(),
      //lineAsyncValidations: [this.checkLine()]
    };
    this.setTable();
    this.listFormField = this.columns.map(m => m.cell)
      .filter(f => f.component !== KlesFormTextComponent)
      .filter(f => !f.name.startsWith('#'))
      .map(m => {
        var temp = Object.assign({}, m);
        const placeholder = this.columns.map(m => m.headerCell).find(f => f.name === m.name).label;
        temp.placeholder = placeholder;
        return temp;
      })

    console.log('ListFormField=', this.listFormField);

    this.form.form.statusChanges.subscribe(s => {
      // console.log('Status form=', s);
    })

    this.form.form.valueChanges.subscribe(s => {
      // console.log('Button=', s);

      const val = Object.keys(s).find(f => s[f]);
      console.log(val);

      switch (val) {
        case 'add':
          this.openDynamicFormDialog();
          break;
        case 'load':
          this.loadData();
          break;
        case 'delete':
          this.table.tableService.deleteRecord(this.table.selection.selected);
          break;
        case 'update':
          this.openDynamicFormDialog(this.table.selection.selected[0].value);
          break;
      }
      if (val) {
        this.form.form.reset();
      }
    });

  }

  setTable() {
    if (!this.table && this.tableContainer) {
      if (this.tableContainer.componentRef) {
        this.table = this.tableContainer.componentRef.instance;
        this.table.selection.changed.subscribe(s => {
          this.table.columns.filter(f => f.columnDef === '#select').map(m => m.headerCell.indeterminate = !this.table.selection.isEmpty());
          if (this.table.selection.isEmpty()) {
            this.table.formHeader.controls['#select']?.patchValue(false, { onlySelf: true, emitEvent: false });
          }
          (this.table.selection.selected.length > 0) ? this.form.form.controls['delete'].enable() : this.form.form.controls['delete'].disable();
          (this.table.selection.selected.length === 1) ? this.form.form.controls['update'].enable() : this.form.form.controls['update'].disable();
        });
        (this.table.tableService as TableService).onLoaded.subscribe(s => {
          console.log('Subscribe loading!!!');
          this.isLoading = !s;
        });
        console.warn('Table=', this.table);
      }
    }
  }

  /**Validators */
  checkStyle(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (control.value === null || control.value === '' || !control.parent) {
        return of(null);
      }
      else {
        // console.log('ControlParent=', control.parent);
        // console.log('Control=', control);
        return timer(500).pipe(
          switchMap(() => {
            const request = {
              program: 'MMS016MI',
              transaction: 'Get',
              record: { STYN: control.value }
            };
            // console.log('Request=', request);
            return this.miService.execute(request).pipe(
              map((data: IMIResponse) => {
                if (!data || data?.errorCode) {
                  return of({ checkStyle: true });
                }
                return null;
              }), catchError((e) => {
                console.log('Catch Error=', e);
                return of({ checkStyle: true });
              })
            )
          })
        );
      }
    };
  }

  checkColor(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (control.value === null || control.value === '' || !control.parent) {
        return of(null);
      }
      else {
        // console.log('ControlParent=', control.parent);
        // console.log('Control=', control);
        return timer(500).pipe(
          switchMap(() => {
            const request = {
              program: 'PDS050MI',
              transaction: 'Get',
              record: { OPTN: control.value }
            };
            // console.log('Request=', request);
            return this.miService.execute(request).pipe(
              map((data: IMIResponse) => {
                if (!data || data?.errorCode || data.item.OGRP === 'X') {
                  return of({ checkColor: true });
                }
                return null;
              }), catchError((e) => {
                console.log('Catch Error=', e);
                return of({ checkColor: true });
              })
            )
          })
        );
      }
    };
  }

  checkSize(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (control.value === null || control.value === '' || !control.parent) {
        return of(null);
      }
      else {
        // console.log('ControlParent=', control.parent);
        // console.log('Control=', control);
        return timer(500).pipe(
          switchMap(() => {
            const request = {
              program: 'PDS050MI',
              transaction: 'Get',
              record: { OPTN: control.value }
            };
            // console.log('Request=', request);
            return this.miService.execute(request).pipe(
              map((data: IMIResponse) => {
                if (!data || data?.errorCode || data.item.OGRP === 'Y') {
                  return of({ checkSize: true });
                }
                return null;
              }), catchError((e) => {
                console.log('Catch Error=', e);
                return of({ checkSize: true });
              })
            )
          })
        );
      }
    };
  }

  checkItemNumber(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (control.value === null || control.value === '' || !control.parent) {
        return of(null);
      }
      else {
        // console.log('ControlParent=', control.parent);
        // console.log('Control=', control);
        return timer(500).pipe(
          switchMap(() => {
            const request = {
              program: 'MMS200MI',
              transaction: 'GetItmBasic',
              record: { ITNO: control.value }
            };
            // console.log('Request=', request);
            return this.miService.execute(request).pipe(
              map((data: IMIResponse) => {
                if (!data || data?.errorCode) {
                  return of({ checkItem: true });
                }
                return null;
              }), catchError((e) => {
                console.log('Catch Error=', e);
                return of({ checkItem: true });
              })
            )
          })
        );
      }
    };
  }

  checkExistingAlternateRouting(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (control.value === null || control.value === '' || !control.parent) {
        return of(null);
      }
      else {
        // console.log('ControlParent=', control.parent);
        // console.log('Control=', control);
        const routingNameControl = control.parent.controls['routingName'];
        routingNameControl?.reset();
        return timer(500).pipe(
          switchMap(() => {
            const request = {
              program: 'CMS100MI',
              transaction: 'LstAltOpe',
              record: { PDAOID: control.value }
            };
            // console.log('Request=', request);
            return this.miService.execute(request).pipe(
              map((data: IMIResponse) => {
                if (!data || data.errorCode || data?.items.length === 0) {
                  routingNameControl?.reset();
                  return of({ checkAlternateRouting: true });
                }
                routingNameControl?.setValue(data.item.PDTX15);
                return null;

              }), catchError((e) => {
                console.log('Catch Error=', e);
                routingNameControl?.reset();
                return of({ checkAlternateRouting: true });
              })
            )
          })
        );
      }
    };
  }

  /**Manage Record */
  openDynamicFormDialog(item?: any): MatDialogRef<KlesDynamicFormDialogComponent, any> {
    this.setTable();
    const dialogRef = this.dialog.open(KlesDynamicFormDialogComponent, {
      width: '500px',
      data: {
        fields: this.listFormField,
        item: item,
        //direction: 'row',
        buttonCancel: 'Annuler',
        buttonOK: 'Confirmer',

      } as IKlesDynamicFormDataDialog

    });
    dialogRef.componentInstance.onLoadedForm.subscribe(s => {
      dialogRef.componentInstance.getForm().valueChanges.subscribe(s => {
        console.log('Change Form=', s);
        //dialogRef.componentInstance.getForm().controls['#select'].patchValue(true, { onlySelf: true, emitEvent: false });
      })
    });
    dialogRef.afterClosed().subscribe(s => {
      console.log(s);
      let item = s?.item;
      if (item) {
        if (item._id) {
          const updateForm = this.table.getFormArray().controls
            .find((f: FormGroup) => f.controls['_id'].value === '' + item._id);
          if (updateForm) {
            updateForm.patchValue(item);
          }
        } else {
          this.table.tableService.addRecord(item);
        }
        this.table.selection.clear();
        this.table.ref.detectChanges();
      }
    })
    return dialogRef;
  }

  /**Data */
  private loadData() {
    this.isLoading = true;
    this.setTable();
    this.table.ref.detectChanges();
    // this.lines = [...this.transformData(data)];
    const listData = [...this.transformData(data)];
    listData.forEach(e => {
      //this.table.tableService.addRecord(e);
      this.table.tableService.addRecord({});
      const lastRecord = this.table.getFormArray().controls[this.table.getFormArray().controls.length - 1];
      lastRecord.patchValue(e);
    });
    this.isLoading = false;
  }

  transformData(data: any[]): any[] {
    const columnAutocomplete = this.columns.filter(f => f.cell.autocomplete && f.cell.options && f.cell.property);
    data.forEach(e => {
      columnAutocomplete.forEach(c => {
        const findValue = c.cell.options.find(f => f[c.cell.property] === e[c.columnDef]);
        if (findValue) {
          e[c.columnDef] = findValue;
        }
      })
    });
    return data;
  }

  autocompleteObjectValidator(optional?): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        if (control.value === '' && optional) return null;
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

  displayWithKeyLabel(value) {
    const temp = _.cloneDeep(value);
    if (!temp.key && typeof temp !== 'string') {
      if (Object.keys(temp).length > 0) {
        value.key = temp[Object.keys(temp)[0]];
      }
      if (Object.keys(temp).length > 1) {
        value.label = temp[Object.keys(temp)[1]];
      }
    }
    let label
    if (value) {
      label = value;
      if (value.key) {
        label = value.key
        if (value.label) {
          label += ' - ' + value.label;
        }
      }
    }
    return label;
  }
}

const data = [
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A01',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '102',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 5,
    OrderType: 'A03',
    ProjectNumber: 'WINTER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI4',
    WorkCenter: 'PLG2'
  },
  {
    Warehouse: 'AA',
    Style: 'AMB02',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB02-Y02-008',
    Quantity: 14,
    OrderType: 'A04',
    ProjectNumber: 'ff',
    PlannedDate: new Date(),
    StandardRouting: '',
    WorkCenter: 'PLGF'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X00',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A01',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY09',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A01',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  }
  ,
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  },
  {
    Warehouse: '101',
    Style: 'AMB01',
    Color: 'YY02',
    Size: 'X008',
    ItemNumber: 'AMB01-Y02-008',
    Quantity: 10,
    OrderType: 'A05',
    ProjectNumber: 'SUMMER',
    PlannedDate: new Date(),
    StandardRouting: 'AOI1',
    WorkCenter: 'PLG1'
  }
];

