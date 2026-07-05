import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-label-value-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="flex flex-col gap-2 border-b border-gray-100 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span class="shrink-0 text-[13px] font-semibold text-gray-700">{{ label() }}</span>
      <span
        class="inline-flex w-full min-w-0 items-center justify-end gap-2 break-words rounded-lg bg-gray-100 px-3.5 py-2.5 text-sm text-gray-900 sm:w-auto sm:min-w-0 md:min-w-[200px]"
      >
        <ng-content />
        @if (editable()) {
          <button type="button" class="border-none bg-transparent p-0 text-gray-400" [attr.aria-label]="editAriaLabel()">
            <mat-icon class="!size-[18px] !text-[18px]">edit</mat-icon>
          </button>
        }
      </span>
    </div>
  `,
})
export class LabelValueRowComponent {
  readonly label = input.required<string>();
  readonly editable = input(false);
  readonly editAriaLabel = input('Edit value');
}
