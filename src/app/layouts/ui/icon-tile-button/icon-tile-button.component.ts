import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-tile-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <button
      type="button"
      class="flex w-full min-w-0 cursor-pointer flex-col items-center gap-2 border-none bg-transparent p-1 sm:min-w-[72px] sm:gap-2.5 lg:flex-1"
      [attr.aria-label]="ariaLabel()"
      (click)="pressed.emit()"
    >
      <span
        class="relative inline-flex items-center justify-center rounded-2xl bg-slate-50 transition-colors hover:bg-slate-200"
        [class]="iconWrapClasses()"
      >
        <mat-icon [class]="iconClasses()">{{ icon() }}</mat-icon>
        @if (badge()) {
          <span
            class="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-brand-primary text-[11px] font-semibold leading-none text-white sm:-right-2 sm:-top-2 sm:size-[22px]"
            aria-hidden="true"
          >
            {{ badge() }}
          </span>
        }
      </span>
      @if (label()) {
        <span class="max-w-full px-0.5 text-center text-[11px] leading-snug text-gray-700 sm:max-w-[100px] sm:text-xs">{{ label() }}</span>
      }
    </button>
  `,
})
export class IconTileButtonComponent {
  readonly icon = input.required<string>();
  readonly label = input('');
  readonly badge = input<number | undefined>();
  readonly large = input(false);
  readonly pressed = output<void>();

  iconWrapClasses(): string {
    return this.large()
      ? 'size-16 rounded-[14px] border border-dashed border-gray-300 sm:size-[72px]'
      : 'size-12 sm:size-14';
  }

  iconClasses(): string {
    return this.large() ? 'text-[32px] text-gray-400' : 'text-[30px] text-brand-primary';
  }

  ariaLabel(): string {
    const label = this.label() || this.icon();
    const count = this.badge();

    if (!count) {
      return label;
    }

    return `${label}, ${count} unread messages`;
  }
}
