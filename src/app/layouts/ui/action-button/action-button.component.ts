import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ActionButtonVariant = 'navy' | 'primary' | 'light';

@Component({
  selector: 'app-action-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="cursor-pointer rounded-md border-none px-3.5 py-2 text-[13px] font-medium text-white transition-[filter] hover:brightness-105"
      [class]="buttonClasses()"
      (click)="pressed.emit()"
    >
      {{ label() }}
    </button>
  `,
})
export class ActionButtonComponent {
  readonly label = input.required<string>();
  readonly variant = input<ActionButtonVariant>('primary');
  readonly fullWidth = input(false);
  readonly pressed = output<void>();

  buttonClasses(): string {
    const map: Record<ActionButtonVariant, string> = {
      navy: 'bg-brand-navy',
      primary: 'bg-brand-primary',
      light: 'bg-brand-sky',
    };

    const width = this.fullWidth()
      ? 'w-full min-w-0 whitespace-normal text-center xl:w-auto xl:whitespace-nowrap'
      : 'min-w-0 max-w-full whitespace-normal xl:whitespace-nowrap';

    return `${map[this.variant()]} ${width}`;
  }
}
