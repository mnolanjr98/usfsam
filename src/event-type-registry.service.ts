import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

export class Event<T> {
    eventTypeName: string;
    data: T;
    execute?: (data: any) => any;
    constructor(eventTypeName: string, data: T, execute?: (data: any) => any) {
        this.eventTypeName = eventTypeName;
        this.data = data;
        if (execute != null) {
            this.execute = execute;
        }
    }
}

export class EventType<T> {

    private actionFunction?: (data: any) => any;
    constructor(readonly eventName: string, actionFunction?: (data: any) => any) {
        if (actionFunction) {
            this.actionFunction = actionFunction;
        }
    };

    generateEvent<S>(data: S): Event<S> {
        console.log('generating event');
        const event = new Event(this.eventName, data, this.actionFunction);

        console.log('event generation complete');
        return event;
    }
}

@Injectable()
export class EventTypeRegistryService {

  private requireEventTypeRegistration = false;
  private applicationActionEventTypes = [];
  private modelUpdateEventTypes = [];

  constructor() {}

  registerApplicationActionEventType<T>(eventName: string, eventActionFuction?: (data: any) => any) {

    if (this.applicationActionEventTypes[eventName] == null) {

      this.applicationActionEventTypes[eventName] = new EventType(eventName, eventActionFuction);
      console.log('Registered Application Action Event ' + eventName);

    } else {
      console.log('Application Action Event ${eventName} is already registered');
    }
  }

  registerModelUpdateEventType<T>(eventName: string, modelChangeHandler: (data: T) => void): Subscription {

    let result = null;
    let handlerWrapper = this.modelUpdateEventTypes[eventName];
    if (handlerWrapper == null) {
      const newEventType = new EventType(eventName);
      handlerWrapper = {
        eventType: newEventType,
        handlers: new Subject()
      };
      result = handlerWrapper.handlers.subscribe(modelChangeHandler);
      this.modelUpdateEventTypes[eventName] = handlerWrapper;

    } else {
      result = handlerWrapper.handlers.subscribe(modelChangeHandler);
    }
    return result;
  }

  generateApplicationActionEvent<DataType>(eventTypeName: string, data: DataType): Event<DataType> {

    console.log('Attempting to generate event for type name ' + eventTypeName);
    const eventType: EventType<any> = this.applicationActionEventTypes[eventTypeName];
    if (this.requireEventTypeRegistration && eventType == null) {

      throw new Error(`Event Type Name ${eventTypeName} is not registered as an Application Action Event`);

    } else if (eventType == null) {

      return new Event<DataType>(eventTypeName, data);
    }

    return eventType.generateEvent(data);
  }

  fetchModelChangeEventHandlers(eventTypeName: string): Subject<any> {

    // TODO need ot handle null
    const handlersWrapper = this.modelUpdateEventTypes[eventTypeName];
    return (handlersWrapper) ? handlersWrapper.handlers : null;
  }
}
