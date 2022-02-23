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
const components = [KlesTableComponent, KlesLazyTableComponent, KlesFormTextHeaderFilterComponent, KlesFormDynamicHeaderFilterComponent];
const directives = [KlesTableDirective, KlesResizeColumnDirective, KlesCellStyleDirective,KlesComponentHeaderDirective];
const services = [AbstractKlesTableService, KlesTableService];
const pipes = [FieldPipe, GroupPipe, ElevationPipe];

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
    entryComponents: [
        components,
    ],
    providers: [
        services
    ]
})

export class KlesMaterialTableModule { }
