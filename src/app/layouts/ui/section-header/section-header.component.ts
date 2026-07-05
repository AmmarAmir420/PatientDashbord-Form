import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <h2 class="m-0 min-w-0 text-lg font-semibold text-gray-900 sm:text-xl">{{ title() }}</h2>
      <ng-content select="[actions]" />
    </header>
  `,
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
}
