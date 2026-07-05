import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppHeaderComponent } from '../app-header/app-header.component';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppHeaderComponent],
  template: `
    <div class="min-h-screen bg-page">
      <app-header />
      <main class="mx-auto w-full max-w-[1440px] px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-5 md:px-6">
        <ng-content />
      </main>
    </div>
  `,
})
export class MainLayoutComponent {}
