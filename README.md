# @3kles/kles-material-table
@3kles/kles-material-table is a angular library to create table.
## Changelog

Check out the [changelog](./CHANGELOG.md) to check all the latest changes.

# How to install
```
npm install --save @3kles/kles-material-table
```

# How to use
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

# Example

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

Check the [`documentation`](./docs) to use component and directive.

## Tests

```
npm install
npm test
```
## License

[`MIT`](./LICENSE.md)
