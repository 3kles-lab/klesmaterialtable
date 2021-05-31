# Components
- [`KlesTableComponent`](#klestableComponent): Table component that use klesDynamicField directive
- [`KlesFormTextHeaderFilterComponent`](#klesformtextheaderfiltercomponent): Component to get text filter on table
  
#### KlesTableComponent

Table component that use klesDynamicField directive and made to be used with [`KlesTableDirective`](./directives#KlesTableDirective)

##### File

```typescript
import { KlesTableComponent } from 'kles-material-table';
```

##### Usage

```typescript
const columns = [
      {
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
          indeterminate: false,
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'beginvalue',
        visible: true, sticky: true,
        filterable:true,
        resizable: true,
        headerCell: {
          type: 'input',
          name: 'beginvalue',
          component: KlesFormLabelComponent,
          value: 'Begin',
          pipeTransform: [{
            pipe: new UpperCasePipe
          }]
        } as IKlesFieldConfig
      },
      ...
        
];

const lines = [ { beginvalue: 1 },{ beginvalue: 10} ];

 const tableConfig = {
      tableComponent: KlesTableComponent,
      columns: this.columns,
      tableService: new KlesTableService()
}

```

```html
<ng-container #table klesTable [tableConfig]="tableConfig" [lines]="lines">
        </ng-container>
```

#### KlesFormTextHeaderFilterComponent

Component to get text filter on table

##### File

```typescript
import { KlesFormTextHeaderFilterComponent } from 'kles-material-table';
```

##### Usage

```typescript
const columns = [
      {
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
          indeterminate: false,
        } as IKlesFieldConfig,
      },
      {
        columnDef: 'beginvalue',
        visible: true, sticky: true,
        filterable:true,
        resizable: true,
        headerCell: {
          type: 'input',
          name: 'beginvalue',
          component: KlesFormTextHeaderFilterComponent,
          value: 'Begin',
          pipeTransform: [{
            pipe: new UpperCasePipe
          }]
        } as IKlesFieldConfig
      },
      ...
        
];

const lines = [ { beginvalue: 1 },{ beginvalue: 10} ];

 const tableConfig = {
      tableComponent: KlesTableComponent,
      columns: this.columns,
      tableService: new KlesTableService()
}

```

```html
<ng-container #table klesTable [tableConfig]="tableConfig" [lines]="lines">
        </ng-container>
```
