import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex items-center justify-between gap-4">
      <h2 class="m-0 text-xl font-semibold text-gray-900">{{ title() }}</h2>
      <ng-content select="[actions]" />
    </header>
  `,
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
}
