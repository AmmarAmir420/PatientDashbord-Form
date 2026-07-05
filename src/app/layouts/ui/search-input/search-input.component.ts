import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule],
  template: `
    <mat-form-field
      appearance="outline"
      class="app-material-field app-search-field w-full"
      subscriptSizing="dynamic"
    >
      @if (showPrefixIcon()) {
        <mat-icon matPrefix class="text-gray-400">{{ prefixIcon() }}</mat-icon>
      }
      <input
        matInput
        [attr.id]="inputId() ?? null"
        [placeholder]="placeholder()"
        [value]="value()"
        [attr.aria-label]="ariaLabel() || placeholder()"
        (input)="valueChange.emit($any($event.target).value)"
      />
      @if (showSuffixIcon()) {
        <mat-icon matSuffix class="text-gray-400">{{ suffixIcon() }}</mat-icon>
      }
    </mat-form-field>
  `,
  host: {
    class: 'block w-full',
  },
})
export class SearchInputComponent {
  readonly inputId = input<string | undefined>(undefined);
  readonly placeholder = input('Search...');
  readonly ariaLabel = input<string>();
  readonly value = input('');
  readonly prefixIcon = input('search');
  readonly suffixIcon = input('search');
  readonly showPrefixIcon = input(false);
  readonly showSuffixIcon = input(true);
  readonly valueChange = output<string>();
}
