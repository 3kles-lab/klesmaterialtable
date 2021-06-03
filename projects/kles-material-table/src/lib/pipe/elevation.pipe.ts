import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'elevationPipe',
    pure: true
})
export class ElevationPipe implements PipeTransform {

    constructor() {
    }

    transform(elevation: number): any {
        return `mat-elevation-z${elevation}`;
    }
}
