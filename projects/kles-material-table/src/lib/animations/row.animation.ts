import { animate, sequence, style, transition, trigger } from "@angular/animations";

export const rowsAnimation =
    trigger('rowsAnimation', [
        transition('void => *', [
            style({ height: '*', opacity: '0', 'box-shadow': 'none' }),
            sequence([
                animate(".35s ease", style({ height: '*', opacity: '.9', 'box-shadow': 'none' })),
                animate(".35s ease", style({ height: '*', opacity: 1, }))
            ])
        ])
    ]);