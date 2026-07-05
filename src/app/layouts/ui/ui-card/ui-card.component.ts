import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [class]="cardClasses()">
      <ng-content />
    </section>
  `,
})
export class UiCardComponent {
  readonly padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
  readonly overflowHidden = input(false);

  cardClasses(): string {
    const paddingMap = {
      none: '',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-5',
      lg: 'p-4 sm:p-6',
    } as const;

    return [
      'rounded-2xl bg-white shadow-sm',
      paddingMap[this.padding()],
      this.overflowHidden() ? 'overflow-hidden' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
