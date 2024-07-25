import { Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IKlesHeaderFieldConfig } from '../models/header-field.config.model';
import { componentMapper, klesFieldControlFactory } from '@3kles/kles-material-dynamicforms';

export function HeaderMapper(config: {
    type: string,
    factory?: (field: IKlesHeaderFieldConfig) => AbstractControl<any, any>
}) {
    return (target: Type<any>) => {
        componentMapper.push({
            component: target,
            type: config.type,
            factory: config.factory || klesFieldControlFactory
        });
    };
}
