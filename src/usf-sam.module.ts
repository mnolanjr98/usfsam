import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventTypeRegistryService} from './event-type-registry.service';
import {ActionDispatcherService} from './action-dispatcher.service';
import {ModelPresenterService} from './model-presenter.service';
import {StateRepresentationRendererService} from './state-representation-renderer.service';

export {EventTypeRegistryService, Event} from './event-type-registry.service';
export {ActionDispatcherService} from './action-dispatcher.service';
export {ModelPresenterService, ActionSubscriber, BaseModel} from './model-presenter.service';
export {StateRepresentationRendererService} from './state-representation-renderer.service';

@NgModule({
    imports: [CommonModule],
    declarations: [],
    providers: [
        EventTypeRegistryService,
        ActionDispatcherService,
        ModelPresenterService,
        StateRepresentationRendererService
    ],
    exports: []
})
export class USFoodsSAMModule {}
