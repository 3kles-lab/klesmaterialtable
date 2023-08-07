import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KlesTableComponent } from './component/table/table.component';
import { KlesLazyTableComponent } from './component/lazytable/lazytable.component';
import { MaterialModule } from './modules/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KlesFormTextHeaderFilterComponent } from './component/header/textheaderfilter.component';
import { KlesMaterialDynamicformsModule } from '@3kles/kles-material-dynamicforms';
import { KlesTableDirective } from './directives/table.directive';
import { AbstractKlesTableService } from './services/abstracttable.service';
import { KlesTableService } from './services/table.service';
import { KlesResizeColumnDirective } from './directives/resizecolumn.directive';
import { FieldPipe } from './pipe/field.pipe';
import { GroupPipe } from './pipe/group.pipe';
import { ElevationPipe } from './pipe/elevation.pipe';
import { KlesCellStyleDirective } from './directives/cellstyle.directive';
import { KlesFormDynamicHeaderFilterComponent } from './component/header/dynamic-headerfilter.component';
import { KlesComponentHeaderDirective } from './directives/dynamic-component.directive';
import { KlesFormTextHeaderComponent } from './component/header/textheader.component';
import { KlesLeafComponent } from './component/treetable/cell/leaf.component';
import { KlesNodeComponent } from './component/treetable/cell/node.component';
import { KlesTreetableComponent } from './component/treetable/treetable.component';
import { KlesDynamicCellDirective } from './directives/dynamic-cell.directive';
import { KlesTreetableDirective } from './directives/treetable.directive';
import { DefaultKlesTreetableService } from './services/treetable/defaulttreetable.service';
import { ConverterService } from './services/treetable/converter.service';
import { TreeService } from './services/treetable/tree.service';
import { KlesLazyTreetableComponent } from './component/lazytreetable/lazytreetable.component';
import { AbstractKlesLazyTableService } from './services/lazy/abstractlazytable.service';
import { AbstractKlesTreeTableService } from './services/treetable/abstracttreetable.service';
import { AbstractKlesLazyTreetableService } from './services/lazy/abstractlazytreetable.service';
import { RowPipe } from './pipe/row.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RowTreePipe } from './pipe/rowtree.pipe';

const components = [
    KlesTableComponent,
    KlesLazyTableComponent,
    KlesFormTextHeaderComponent,
    KlesFormTextHeaderFilterComponent,
    KlesFormDynamicHeaderFilterComponent,
    KlesLeafComponent,
    KlesNodeComponent,
    KlesTreetableComponent,
    KlesLazyTreetableComponent,
];
const directives = [
    KlesTableDirective,
    KlesResizeColumnDirective,
    KlesCellStyleDirective,
    KlesComponentHeaderDirective,
    KlesDynamicCellDirective,
    KlesTreetableDirective,
];
const services = [
    AbstractKlesTableService,
    AbstractKlesLazyTableService,
    KlesTableService,
    // KlesLazyTableService,
    AbstractKlesTreeTableService,
    AbstractKlesLazyTreetableService,
    // KlesTreetableService,
    DefaultKlesTreetableService, 
    // KlesLazyTreetableService,
    ConverterService, 
    TreeService
];
const pipes = [FieldPipe, GroupPipe, ElevationPipe, RowPipe, RowTreePipe];

@NgModule({
    declarations: [
        components,
        directives,
        pipes
    ],
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        KlesMaterialDynamicformsModule
    ],
    exports: [
        components,
        directives,
        pipes
    ],
    providers: [
        services
    ]
})

export class KlesMaterialTableModule { }
