/*
 * Public API Surface of kles-material-table
 */

/**MODEL */
export * from './lib/models/options.model';
export * from './lib/models/columnconfig.model';
export * from './lib/models/tableconfig.model';

/**DIRECTIVE */
export * from './lib/directives/table.directive';
export * from './lib/directives/resizecolumn.directive';

/**COMPONENT */
export * from './lib/component/table.component';
export * from './lib/component/header/textheaderfilter.component';

/**SERVICES */
export * from './lib/services/abstracttable.service';
export * from './lib/services/table.service';

/**MODULE */
export * from './lib/table.module';