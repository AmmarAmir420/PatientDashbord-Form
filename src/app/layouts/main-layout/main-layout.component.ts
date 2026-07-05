import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppHeaderComponent } from '../app-header/app-header.component';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppHeaderComponent],
  template: `
    <div class="min-h-screen bg-page">
      <app-header />
      <main class="mx-auto max-w-[1440px] px-4 py-5 md:px-6">
        <ng-content />
      </main>
    </div>
  `,
})
export class MainLayoutComponent {}
