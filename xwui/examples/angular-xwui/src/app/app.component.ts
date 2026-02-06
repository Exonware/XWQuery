import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h1>XWUI + Angular</h1>
    <p>XWUIButton (Custom Element) below.</p>
    <p><a href="/uber/uber.html">Uber-like mobile demo →</a></p>
    <div class="buttons">
      <xwui-button text="Primary" variant="primary" size="medium"></xwui-button>
      <xwui-button text="Success" variant="success" size="medium"></xwui-button>
      <xwui-button text="Secondary" variant="secondary" size="medium"></xwui-button>
    </div>
  `,
  styles: [`
    .buttons { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem; }
    xwui-button { display: inline-block; }
  `],
})
export class AppComponent {
  title = 'angular-xwui';
}
