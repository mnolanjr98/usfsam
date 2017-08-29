import { Injectable } from '@angular/core';
import {StateRepresentationRendererService} from './state-representation-renderer.service';
import {Event} from './event-type-registry.service';
import {EventMapRegistry} from './event-map-registry';

/**
 * Does the model own the event or the application.  They are going to register their handlers here -
 * should they be the ultimate owner of registering all available events?  What if more then one model
 * is interested in the event?  Should these always be coordinated and that component becomes the owner?
 */
@Injectable()
export class ModelPresenterService /*implements ModelActionRegistry*/ {

  modelActionMap = new Map();

  constructor(readonly renderer: StateRepresentationRendererService) {

    // We should have a set of models which need to be instantiated, and
    // then they need to turn around and registered in their events of interest
    // (probably via interface)
  }

  present(modelAction: string, data: any) {

    const handlers = this.modelActionMap[modelAction];
    for (let handlerIndex = 0; handlerIndex < handlers.length; ++handlerIndex) {
      // We may acwant to do the change event handling here using this method.
      handlers[handlerIndex](data);
    }
  }

  registerEventsForModel(model: BaseModel): void {
    const targetTypeEventRegisty = EventMapRegistry.getRegistryForTargetType(Object.getPrototypeOf(model));
    if (targetTypeEventRegisty) {
      for (const eventName in targetTypeEventRegisty) {
        if (targetTypeEventRegisty.hasOwnProperty(eventName)) {
            const handler = targetTypeEventRegisty[eventName];
            this.register(eventName, (data) => {
                return model[handler](data);
            });
        }
      }
    }
  }

  // May not be needed publicly (and can remove interface)
  private register<T, R>(modelAction: string, handler: (data: T) => Event<R> | Promise<Event<R>>): void {

    if (!this.modelActionMap[modelAction]) {
      this.modelActionMap[modelAction] = [];
    }

    // The wrapper function can't reference the ModelPresenter via this, so we need
    // to create a closure to the renderer to allow it access.
    const rendererRef = this.renderer;

    // IMPORTANT - By using a wrapper function here around the handler, we are able to add
    // in the routing logic without requiring the model to do it redundantly;
    const wrapperFunction = (/*...wrapperData: any[]*/data: any): Event<any> | Promise<any> => {
      console.log('wrapperFunction called for model callback');
      // let event = handler.apply(this, wrapperData);
      const event = handler(data);

      if (event != null && event instanceof Event) {

        if (event != null) {
          rendererRef.render(event.eventTypeName, event.data);
        }

      } else if (event != null && event instanceof Promise) {

        event.then((localEevent: Event<any>) => {
          rendererRef.render(localEevent.eventTypeName, localEevent.data);
        });
      }

      return event;
    };

    this.modelActionMap[modelAction].push(wrapperFunction);
  }

}

// For now, a marker interface
// tslint:disable-next-line:no-empty-interface
export interface BaseModel {

}

// Decorator function
export function ActionSubscriber(eventName: string) {
  console.log('In action subscriber for event ' + eventName);
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    /*let originalFunction = target[propertyKey];
    descriptor.value = function(...data: any[]): any {
      console.log("starting calll to original function - " + propertyKey);
      let result = originalFunction.apply(this, data);
      console.log("completing calll to original function - " + propertyKey);
      return result;
    };*/

    console.log('adding actionSubscriberMap');
    EventMapRegistry.addActionHandler(target, eventName, propertyKey);
  };
}
