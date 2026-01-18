import { Directive, inject, effect, ElementRef, Renderer2 } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Directive({
  selector: '[appRtl]',
  standalone: true
})
export class RtlDirective {
  private i18nService = inject(I18nService);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const direction = this.i18nService.direction();
      this.renderer.setAttribute(this.el.nativeElement, 'dir', direction);
    });
  }
}
