import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule],
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label class="text-[13px] font-semibold text-gray-700" [attr.for]="inputId()">
          {{ label() }}
        </label>
      }

      <mat-form-field
        appearance="outline"
        class="app-material-field w-full"
        subscriptSizing="dynamic"
      >
        <ng-content />
      </mat-form-field>

      @if (errorMessage()) {
        <span class="text-xs text-red-600" role="alert">{{ errorMessage() }}</span>
      }
    </div>
  `,
})
export class FormFieldComponent {
  readonly label = input<string>();
  readonly inputId = input<string>();
  readonly errorMessage = input<string>();
}
