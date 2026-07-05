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
      class="flex min-w-[72px] flex-1 cursor-pointer flex-col items-center gap-2.5 border-none bg-transparent p-1"
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
        <span class="max-w-[100px] text-center text-xs leading-snug text-gray-700">{{ label() }}</span>
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
      ? 'size-[72px] rounded-[14px] border border-dashed border-gray-300'
      : 'size-14';
  }

  iconClasses(): string {
    return this.large() ? 'text-[32px] text-gray-400' : 'text-[30px] text-brand-primary';
  }
}
