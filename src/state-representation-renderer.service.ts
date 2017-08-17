import { Injectable } from '@angular/core';
import {EventTypeRegistryService} from './event-type-registry.service';

/* tslint:disable-next-line:import-blakclist */
import {Subscription} from 'rxjs';

@Injectable()
export class StateRepresentationRendererService {

  constructor(readonly eventTypeRegistry: EventTypeRegistryService) { }

  register(modelChangeEvent: string, handler: (data) => void): Subscription {
    return this.eventTypeRegistry.registerModelUpdateEventType(modelChangeEvent, handler);
  }

  render(modelChangeEvent: string, data: any): void {

    console.log('render state rep for modelChangeEvent of ' + modelChangeEvent);
    const handlers = this.eventTypeRegistry.fetchModelChangeEventHandlers(modelChangeEvent);
    if (handlers) {
      handlers.next(data);
    } else {
      console.log('No registered hanlders for modelChangeEvent - ' + modelChangeEvent);
    }
  }

}
