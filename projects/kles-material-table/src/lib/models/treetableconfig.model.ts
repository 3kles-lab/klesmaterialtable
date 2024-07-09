import { KlesTreeColumnConfig } from './columnconfig.model';
import { KlesTableConfig } from './tableconfig.model';

export interface KlesTreeTableConfig extends KlesTableConfig {
  deleteOffset?: boolean;
  columns: KlesTreeColumnConfig[];
}
