import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex size-9 items-center justify-center rounded-full bg-blue-100 text-[13px] font-medium text-blue-800"
      [attr.aria-label]="ariaLabel()"
    >
      {{ initials() }}
    </span>
  `,
})
export class AvatarComponent {
  readonly initials = input.required<string>();
  readonly ariaLabel = input('User avatar');
}
