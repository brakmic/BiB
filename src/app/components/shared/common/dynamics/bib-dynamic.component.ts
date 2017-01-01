import { 
         Component, Input, Output,
         ViewContainerRef, ViewChild,
         ReflectiveInjector, ComponentFactoryResolver,
         OnInit, ChangeDetectionStrategy,
         ChangeDetectorRef, EventEmitter 
        } from '@angular/core';
import { IComponentData, IAppState } from 'app/interfaces';
import { LogService } from 'app/services';
import { ManageMediumComponent, BorrowMediaComponent,
         ManageReaderComponent, ManageUserComponent } from '../modals';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { STATS_CHANGED } from 'app/reducers';
import * as _ from 'lodash';
const domready = require('domready');

@Component({
    selector: 'bib-dynamic',
    template: `
        <div #container></div>
    `,
    entryComponents: [ 
                       ManageMediumComponent, 
                       ManageReaderComponent,
                       BorrowMediaComponent,
                       ManageUserComponent
                     ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BibDynamicComponent implements OnInit {
    @ViewChild('container', { read: ViewContainerRef }) public container: ViewContainerRef;
    @Output() public dynamicEvent = new EventEmitter(true); 
    // component: Class for the component you want to create
    // inputs: An object with key/value pairs mapped to input name/input value
    @Input() set dynamicComponent(data: IComponentData) 
    {
        if (_.isNil(data)) {   
            return;
        }
        // Inputs need to be in the following format to be resolved properly
        let inputProviders = _.keys(data.inputs).map((name) => {
                                        return {
                                            provide: name, 
                                            useValue: data.inputs[name]
                                        };
                                    });
        let resolvedInputs = ReflectiveInjector.resolve(inputProviders);
        
        // We create an injector out of the data we want to pass down and this components injector
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, 
                                                this.container.parentInjector);
        
        // We create a factory out of the component we want to create
        let factory = this.resolver.resolveComponentFactory(data.component);
        
        // We create the component using the factory and the injector
        let component = factory.create(injector);
        
        // We insert the component into the dom container
        this.container.insert(component.hostView);
        const subscription = (<any>component.instance)._event.subscribe(v => {
            this.dynamicEvent.emit(v);
        });
        component.onDestroy(() => {
            subscription.unsubscribe();
        });
        
        // We can destroy the old component is we like by calling destroy
        if (!_.isNil(this.currentComponent)) {
            this.currentComponent.destroy();
        }
        this.currentComponent = component;
    }
    
    private currentComponent = null;

    constructor(private resolver: ComponentFactoryResolver,
                private logService: LogService,
                private cd: ChangeDetectorRef,
                private store: Store<IAppState>) { }

    public ngOnInit() { 

    }
    public ngAfterViewInit(){
    }
    public ngOnChanges() {
    }
    public ngOnDestroy() {
        $('bib-root').siblings().remove();
    }
}
