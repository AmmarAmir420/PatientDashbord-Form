import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      class="inline-flex h-[42px] cursor-pointer items-center justify-center rounded-lg border-none bg-brand-primary px-6 text-sm font-medium text-white transition-[filter] hover:brightness-105"
      (click)="pressed.emit()"
    >
      <ng-content />
    </button>
  `,
})
export class PrimaryButtonComponent {
  readonly type = input<'button' | 'submit'>('button');
  readonly pressed = output<void>();
}

@Component({
  selector: 'app-secondary-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="inline-flex h-[42px] cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-6 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
      (click)="pressed.emit()"
    >
      <ng-content />
    </button>
  `,
})
export class SecondaryButtonComponent {
  readonly pressed = output<void>();
}

@Component({
  selector: 'app-icon-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="inline-flex cursor-pointer items-center justify-center border-none bg-transparent text-gray-600 transition-colors hover:bg-gray-100"
      [class]="sizeClasses()"
      [attr.aria-label]="ariaLabel()"
      (click)="pressed.emit()"
    >
      <ng-content />
    </button>
  `,
})
export class IconButtonComponent {
  readonly ariaLabel = input.required<string>();
  readonly size = input<'md' | 'sm'>('md');
  readonly pressed = output<void>();

  sizeClasses(): string {
    return this.size() === 'sm'
      ? 'size-8 rounded-md text-gray-400'
      : 'size-10 rounded-full';
  }
}
