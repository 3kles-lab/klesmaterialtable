import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Pipe({
    name: 'age-pipe',
    standalone: true
})
export class AgePipe implements PipeTransform {
    constructor(private translateService: TranslateService) { }

    transform(value: string): string {
        return `${value} ${this.translateService.instant('year')}`;
    }
}
