/*
 * Public API Surface of kles-material-table
 */

/**MODEL */
export * from './lib/models/cell.model';
export * from './lib/models/node.model';
export * from './lib/models/options.model';
export * from './lib/models/columnconfig.model';
export * from './lib/models/tableconfig.model';

/**DIRECTIVE */
export * from './lib/directives/table.directive';
export * from './lib/directives/resizecolumn.directive';
export * from './lib/directives/cellstyle.directive';

/**COMPONENT */
export * from './lib/component/table.component';
export * from './lib/component/header/textheaderfilter.component';

/**SERVICES */
export * from './lib/services/abstracttable.service';
export * from './lib/services/defaulttable.service';
export * from './lib/services/table.service';

/**FEATURES */
export * from './lib/services/features/filter/textfiltertable.service';
export * from './lib/services/features/selection/selectiontable.service';

/**PIPE */
export * from './lib/pipe/field.pipe';
export * from './lib/pipe/group.pipe';
export * from './lib/pipe/elevation.pipe';

/**MODULE */
export * from './lib/table.module';
