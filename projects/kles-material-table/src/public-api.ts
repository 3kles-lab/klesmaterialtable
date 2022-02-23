/*
 * Public API Surface of kles-material-table
 */

/**MODEL */
export * from './lib/models/cell.model';
export * from './lib/models/node.model';
export * from './lib/models/options.model';
export * from './lib/models/columnconfig.model';
export * from './lib/models/tableconfig.model';
export * from './lib/models/header-field.config.model';
export * from './lib/interfaces/pagination.interface';

/**DIRECTIVE */
export * from './lib/directives/table.directive';
export * from './lib/directives/resizecolumn.directive';
export * from './lib/directives/cellstyle.directive';
export * from './lib/directives/dynamic-component.directive';

/**COMPONENT */
export * from './lib/component/table/table.component';
export * from './lib/component/lazytable/lazytable.component';
export * from './lib/component/header/textheaderfilter.component';
export * from './lib/component/header/dynamic-headerfilter.component';

/**SERVICES */
export * from './lib/services/abstracttable.service';
export * from './lib/services/defaulttable.service';
export * from './lib/services/table.service';
export * from './lib/services/lazy/abstractlazytable.service';
export * from './lib/services/lazy/lazytable.service';

/**FEATURES */
export * from './lib/services/features/filter/textfiltertable.service';
export * from './lib/services/features/filter/headerfilter-table.service';
export * from './lib/services/features/selection/selectiontable.service';

/**PIPE */
export * from './lib/pipe/field.pipe';
export * from './lib/pipe/group.pipe';
export * from './lib/pipe/elevation.pipe';

/**MODULE */
export * from './lib/table.module';
