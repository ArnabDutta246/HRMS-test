import { AfterViewInit, Directive, ElementRef, Input, OnChanges, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { AllCollectionsService } from '../shared/all-collections.service';

const DISABLED = 'disabled';
const APP_DISABLED = 'app-disabled';
const TAB_INDEX = 'tabindex';
const TAG_ANCHOR = 'a';

@Directive({
  selector: '[disableDirective]'
})
export class DisableDirective implements OnChanges, AfterViewInit {
  appDisable:any;
  constructor(
        private templateRef: TemplateRef<any>,
        private allCol: AllCollectionsService,
        private viewContainer: ViewContainerRef,
        private eleRef: ElementRef,
        private renderer: Renderer2
    ) { 
    }
   findFeatures(){
    this.allCol.getPlanData();
    return  this.allCol.planData;
   }
  //@Input() appDisable = true;
  @Input() 
  set disableDirective(hasAccess:any) {
    console.log("hasAccess",hasAccess);
        if (hasAccess) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
         this.viewContainer.clear();
        // const factory = this.resolver.resolveComponentFactory(DummyComponent);
        // this.viewContainer.createComponent(factory);

        }
        //this.disableElement(this.eleRef.nativeElement);
    }
  
  ngOnChanges() {
    //this.disableElement(this.eleRef.nativeElement);
  }

  ngAfterViewInit() {
    //this.disableElement(this.eleRef.nativeElement);
  }

  private disableElement(element: any) {
    alert("Calling");
    if (this.appDisable) {
      if (!element.hasAttribute(DISABLED)) {
        this.renderer.setAttribute(element, APP_DISABLED, '');
        this.renderer.setAttribute(element, DISABLED, 'true');

        // disabling anchor tab keyboard event
        if (element.tagName.toLowerCase() === TAG_ANCHOR) {
          this.renderer.setAttribute(element, TAB_INDEX, '-1');
        }
      }
    } else {
      if (element.hasAttribute(APP_DISABLED)) {
        if (element.getAttribute('disabled') !== '') {
          element.removeAttribute(DISABLED);
        }
        element.removeAttribute(APP_DISABLED);
        if (element.tagName.toLowerCase() === TAG_ANCHOR) {
          element.removeAttribute(TAB_INDEX);
        }
      }
    }
    if (element.children) {
      for (let ele of element.children) {
        this.disableElement(ele);
      }
    }
  }
}