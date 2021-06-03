import { ChangeDetectorRef, ElementRef, EmbeddedViewRef, Input, OnChanges, Renderer2, SimpleChanges, Type } from '@angular/core';
import { Directive } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';

@Directive({
    selector: "[klesCellStyle]"
})
export class KlesCellStyleDirective implements OnChanges {

    @Input() row;
    @Input() column;

    private domElement: any;
    private context: any;


    constructor(private elementRef: ElementRef, cdRef: ChangeDetectorRef) {
        this.domElement = this.elementRef.nativeElement;
        this.context = ((cdRef as EmbeddedViewRef<Type<any>>).context);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const style: SafeStyle = this.context.getCellStyle(this.row, this.column);
        if (style) {
            this.domElement.style = style;
        }

    }
}
