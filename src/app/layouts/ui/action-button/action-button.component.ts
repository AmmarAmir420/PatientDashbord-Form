import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ActionButtonVariant = 'navy' | 'primary' | 'light';

@Component({
  selector: 'app-action-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="cursor-pointer whitespace-nowrap rounded-md border-none px-3.5 py-2 text-[13px] font-medium text-white transition-[filter] hover:brightness-105"
      [class]="variantClasses()"
      (click)="pressed.emit()"
    >
      {{ label() }}
    </button>
  `,
})
export class ActionButtonComponent {
  readonly label = input.required<string>();
  readonly variant = input<ActionButtonVariant>('primary');
  readonly pressed = output<void>();

  variantClasses(): string {
    const map: Record<ActionButtonVariant, string> = {
      navy: 'bg-brand-navy',
      primary: 'bg-brand-primary',
      light: 'bg-brand-sky',
    };
    return map[this.variant()];
  }
}
