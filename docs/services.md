# Components
- [`AbstractKlesTableService`](#abstractklestableservice): Abstract class for table service
- [`DefaultKlesTableService`](#defaultklestableservice): Default class for table service
- [`KlesTableService`](#klestableservice): Table service is based on DefaultKlesTableService with selection and filter feature
- [`KlesTextFilterTableService`](#klestextfiltertableservice): Feature to manage filter on table
- [`KlesSelectionTableService`](#klesselectiontableservice): Feature to manage selection on table
  
#### AbstractKlesTableService

Abstract class for table service

##### File

```typescript
import { AbstractKlesTableService } from 'kles-material-table';
```

##### Usage

```typescript

export class DefaultKlesTableService extends AbstractKlesTableService {
    //Header
    onHeaderChange(e: any) { }
    onHeaderCellChange(e: any) { }
    onStatusHeaderChange(e: any) { }

    //Line
    onCellChange(e: any) { }
    onStatusCellChange(e: any) { }
    onLineChange(e: any) { }
    onStatusLineChange(e: any) { }

    //Footer
    onFooterChange(e: any) { }

    //Data
    onDataLoaded() { }

    //Cell Style
    getCellStyle(row: any, column: KlesColumnConfig): SafeStyle { return "" };

    //Sorting
    getSortingDataAccessor = (item: AbstractControl, property) => {
        let value: any = item.value[property];
        if (typeof value === 'string') {
            value = value.toLowerCase();
        }
        else if (typeof value === 'object') {
            if (value.key) {
                value = value.key;
            }
        }
        return value;
    };

}

```

#### DefaultKlesTableService

Default class for table service

##### File

```typescript
import { DefaultKlesTableService } from 'kles-material-table';
```

##### Usage

```typescript

export class MyTableService extends DefaultKlesTableService {
    onDataLoaded() { 
      console.log('my data are loaded');
    }
}

```

#### KlesTableService

Table service is based on [`DefaultKlesTableService`](./services#DefaultKlesTableService) with selection and filter feature

##### File

```typescript
import { KlesTableService } from 'kles-material-table';
```

##### Usage

```typescript

export class MyTableService extends KlesTableService {
    onDataLoaded() { 
      console.log('my data are loaded');
    }
}
```

#### KlesTextFilterTableService

Feature to manage filter on table. Each column with property filterable on will call by this feature.

##### File

```typescript
import { KlesTextFilterTableService } from 'kles-material-table';
```

##### Usage

```typescript

export class MyTableService extends classes(DefaultKlesTableService, KlesTextFilterTableService) {
    onDataLoaded() { 
      console.log('my data are loaded');
    }
}
```

#### KlesSelectionTableService

Feature to manage selection on table.

##### File

```typescript
import { KlesSelectionTableService } from 'kles-material-table';
```

##### Usage

```typescript

export class MyTableService extends classes(DefaultKlesTableService, KlesSelectionTableService) {
     
  constructor() {
    super({ super: KlesSelectionTableService, arguments: ['#select'] });// The argument is the column key for selection
  }
    
  onDataLoaded() { 
    console.log('my data are loaded');
  }
}
```