import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-tile-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatBadgeModule, MatIconModule],
  template: `
    <button
      type="button"
      class="flex w-full min-w-0 cursor-pointer flex-col items-center gap-2 border-none bg-transparent p-1 sm:min-w-[72px] sm:gap-2.5 lg:flex-1"
      [attr.aria-label]="label() || icon()"
      (click)="pressed.emit()"
    >
      <span
        class="relative inline-flex items-center justify-center rounded-2xl bg-slate-50 transition-colors hover:bg-slate-200"
        [class]="iconWrapClasses()"
        [matBadge]="badge()"
        [matBadgeHidden]="!badge()"
        matBadgeColor="primary"
        matBadgeSize="small"
      >
        <mat-icon [class]="iconClasses()">{{ icon() }}</mat-icon>
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
}
