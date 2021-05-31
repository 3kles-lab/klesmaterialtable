# Interfaces
- [`KlesColumnConfig`](#klescolumnconfig): Interface to manage column
- [`KlesTableConfig`](#klestableconfig): Interface to manage table
- [`Node`](#node): Interface to manage line
- [`KlesTableBaseService`] (#klestablebaseservice): Interface to implement Table Service

#### KlesColumnConfig

Interface to manage column

- columnDef: string : Column key
- sticky?: boolean : Is sticky column
- visible: boolean : Is display column
- disabled?: boolean : Is disable column
- name?: string : 
- ngClass?: any : Apply class on column
- filterable?: boolean : Is filterable column
- sortable?: boolean : Is sortable column
- resizable?: boolean : Is resizable column
- headerCell: IKlesFieldConfig : Object to represent the column header
- cell: IKlesFieldConfig : Object to represent the column cell
- footerCell?: IKlesFieldConfig : Object to represent the column footer

##### File

```typescript
import { KlesColumnConfig } from 'kles-material-table';
```

##### Usage

```javascript
const column={
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
    property: 'WHLO',
    validations: [
      {
        name: 'list',
        message: this.translate.instant('autocomplete.notInList'),
        validator: autocompleteObjectValidator()
      }
    ]
  } as IKlesFieldConfig,
}
```

#### KlesTableConfig

Interface to manage column

- tableComponent: Type<any> : Table component (default is KlesTableComponent)
- columns: KlesColumnConfig[] : Array of column list
- tableService: AbstractKlesTableService : Service to manage table
- selectionMode?: boolean: Is Selection mode
- options?: Options<any> : Options to manage table
- sortConfig?: Sort : Function to manage sort
- hidePaginator?: boolean : Is paginator is hidden
- pageSize?: number : Page size in paginator
- pageSizeOptions?: number[]: List size of paginator
- lineValidations?: ValidatorFn[]: List of validator to check line
- lineAsyncValidations?: AsyncValidatorFn[] : List of asynchronous validator to check line

##### File

```typescript
import { KlesTableConfig } from 'kles-material-table';
```

##### Usage

```javascript
const tableConfig = {
  tableComponent: KlesTableComponent,
  columns: this.columns,
  tableService: new TableService()
};
```

#### Node

Interface to manage line

- value: any : Value
- _id: string:  uuid key
- options?: { [key: string]: string }: Options for line
- children?: Node[]: Children linked to the line

##### File

```typescript
import { Node } from 'kles-material-table';
```

#### Options

Interface to manage option table

- verticalSeparator?: boolean : Is vertical separator
- capitalisedHeader?: boolean : Is capitalize header
- highlightRowOnHover?: boolean:  Is highlist when on hover
- customColumnOrder?: Array<keyof T> & string[] : Manage column order
- elevation?: number : Material shadow elevation

##### File

```typescript
import { Options } from 'kles-material-table';
```

##### Usage

```javascript
const tableConfig = {
  tableComponent: KlesTableComponent,
  columns: this.columns,
  tableService: new TableService()
};
```

#### Node

Interface to manage line

- value: any : Value 
- _id: string:  uuid key
- options?: { [key: string]: string }: Options for line
- children?: Node[]: Children linked to the line

##### File

```typescript
import { Node } from 'kles-material-table';
```

#### KlesTableBaseService

Interface to implement Table Service

- table:KlesTableComponent

##### File

```typescript
import { KlesTableBaseService } from 'kles-material-table';
```

##### Usage

```javascript
export class KlesTextFilterTableService implements KlesTableBaseService {
    table: KlesTableComponent;
}
```