# @3kles/kles-material-table
@3kles/kles-material-table is a angular library to create table.

## Changelog

Check out the [changelog](./CHANGELOG.md) to check all the latest changes.

## Models

### Directives

- <b>KlesTableDirective</b> -> Directive to build table
- <b>KlesTreetableDirective</b> -> Directive to build tree table

### Interfaces

#### IKlesCellFieldConfig

Interface to define the cell of a column, extends IKlesFieldConfig from @3kles/kles-material-dynamicforms

- <b>executeAfterChange?</b>: (property?: string, row?: any, group?: UntypedFormGroup | UntypedFormArray) => Observable<any> -> Execute something after the value of a cell is update

#### IKlesHeaderFieldConfig

Interface to define the header of a column, extends IKlesFieldConfig from @3kles/kles-material-dynamicforms

- <b>filterComponent?</b>: Type<any> -> Define a new filter component
- <b>filterClearable?</b>: boolean -> Set if the button to clear the filter is visible
- <b>filterable?</b>: boolean -> Set if the column is filterable
- <b>filterPredicate?</b>: (value: any, filter: any) => boolean -> Define a new filter predicate for the column
- <b>sortable?</b>: boolean -> Set if the column is sortable

#### KlesColumnConfig

Interface to manage column for table and lazy table

- <b>columnDef</b>: string -> Set the column def of the column
- <b>sticky?</b>: boolean -> Define if the column is sticky at the start
- <b>stickyEnd?</b>: boolean -> Define if the column is sticky at the end
- <b>visible</b>: boolean -> Define if the column is visible
- <b>disabled?</b>: boolean -> Define if the column is disabled
- <b>name?</b>: string -> Set the name of the column
- <b>ngClass?</b>: any -> Define a css class for the table
- <b>filterable?</b>: boolean -> Define if the column is filterable
- <b>sortable?</b>: boolean -> Define if the column is sortable
- <b>resizable?</b>: boolean -> Define if we can resize the column
- <b>headerCell</b>: IKlesHeaderFieldConfig -> Define the header of the column
- <b>cell</b>: IKlesCellFieldConfig -> Define the cell of the column
- <b>footerCell?</b>: IKlesCellFieldConfig -> Define the footer of the column if there is one
- <b>canUnfold?</b>: boolean -> Define if we can unfold this column on each cell
- <b>align?</b>: AlignCell -> Align the content of cells for this column

#### KlesTreeColumnConfig

Interface to manage column for tree table, extends KlesColumnConfig

- <b>canExpand?</b>: boolean -> Define if the column can be expand to see his children
- <b>paginator?</b>: boolean -> Define a paginator for the children
- <b>paginatorOption?</b>: {
        pageSize?: number;
        showFirstLastButtons?: boolean;
        hidePageSize?: boolean;
        pageSizeOptions?: number[]
    } -> Define the paginator options

#### KlesTableConfig

Interface to manage table

- <b>id?</b>: string -> Id of the table
- <b>tableComponent</b>: Type\<any> -> Component to create the table
- <b>columns</b>: KlesColumnConfig[] -> Config of the columns
- <b>tableService</b>: AbstractKlesTableService -> Service of the table
- <b>customMatPaginatorIntl?</b>: Type\<MatPaginatorIntl> -> Custom paginator to replace the default one
- <b>selectionMode?</b>: boolean -> Set lines multiple selection
- <b>options?</b>: Options\<any> -> Set options to the table
- <b>sortConfig?</b>: Sort -> Define the sort config for sortable columns
- <b>hidePaginator?</b>: boolean -> Set if the paginator is visible
- <b>pageSize?</b>: number -> Define the number of lines
- <b>pageSizeOptions?</b>: number[] -> Define the options for the number of lines to display
- <b>lineValidations?</b>: ValidatorFn[] -> Define validators for the table lines
- <b>lineAsyncValidations?</b>: AsyncValidatorFn[] -> Define async validators for the table lines
- <b>showFooter?</b>: boolean -> Define if the footer is visible
- <b>ngClassRow?</b>: (row: UntypedFormGroup) => any -> Set css class to use for the lines
- <b>multiTemplate?</b>: boolean -> Define if the table have multi template
- <b>templateUnfold?</b>: {
        disabled?: (row: UntypedFormGroup) => boolean;
        cells: (IKlesCellFieldConfig & { colspan?: number | Span, rowspan?: number })[];
        multiUnfold?: boolean;
    } -> Define table unfold templates
- <b>templates?</b>: {
        cells: (IKlesCellFieldConfig & { colspan?: number | Span, rowspan?: number })[],
        when?: ((index: number, rowData: any) => boolean)
    }[] -> Define table templates
- <b>dragDropRows?</b>: boolean -> Set if we can drag and drop the lines
- <b>dragDropRowsOptions?</b>: {
        autoScrollStep?: number;
        connectedTo?: string[];
        dragDisabled?: (row: UntypedFormGroup) => boolean;
        dragPreview?: {
            matchSize?: boolean;
            component: Type<any>;
        };
        dragPlaceholder?: {
            component: Type<any>;
        }
    } -> Set options for the drag and drop

### Components

- <b>KlesUnfoldCellComponent</b> -> Component to create a cell that can be unfold
- <b>KlesFormTextHeaderComponent</b> -> Component to create a simple text header
- <b>KlesFormTextHeaderFilterComponent</b> -> Component to create a text header with a filter
- <b>KlesTableComponent</b> -> Component to create a table
- <b>KlesTreetableComponent\<T></b> -> Component to create a tree table
- <b>KlesLazyTableComponent</b> -> Component to create a lazy table
- <b>KlesLazyTreetableComponent\<T></b> -> Component to create a lazy tree table

## Install

### npm

```
npm install --save @3kles/kles-material-table
```

## How to use
In the module
```javascript
import { KlesMaterialTableModule } from '@3kles/kles-material-table';
...
@NgModule({
  imports: [
    KlesMaterialTableModule,
    ...
  ]
  ...
})
```

## Example

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
<ng-container #table klesTable [tableConfig]="tableConfig" [lines]="lines"></ng-container>
```

Check the [`documentation`](https://doc.3kles-consulting.com/#/material/materialtable) to use component and directive.

## Tests

```
npm install
npm test
```

## License

[`MIT`](./LICENSE.md)
