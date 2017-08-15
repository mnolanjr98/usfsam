import { Injectable } from '@angular/core';
import {Subject, Subscription} from 'rxjs';

@Injectable()
export class EventTypeRegistryService {

  private requireEventTypeRegistration = false;
  private applicationActionEventTypes = [];
  private modelUpdateEventTypes = [];

  constructor() {}

  registerApplicationActionEventType<T>(eventName: string, eventActionFuction?: (data: any) => any) {

    let result = null;
    if (this.applicationActionEventTypes[eventName] == null) {
      let newEventType = new EventType(eventName, eventActionFuction);
      this.applicationActionEventTypes[eventName] = newEventType;
      console.log("Registered Application Action Event " + eventName);
    }
    else {
      console.log("Application Action Event ${eventName} is already registered");
    }
  }

  registerModelUpdateEventType<T>(eventName: string, modelChangeHandler: (data: T) => void): Subscription {

    let result = null;
    let handlerWrapper = this.modelUpdateEventTypes[eventName];
    if (handlerWrapper == null) {
      let newEventType = new EventType(eventName);
      handlerWrapper = {
        eventType: newEventType,
        handlers: new Subject()
      };
      result = handlerWrapper.handlers.subscribe(modelChangeHandler);
      this.modelUpdateEventTypes[eventName] = handlerWrapper;

    }
    else {
      result = handlerWrapper.handlers.subscribe(modelChangeHandler);
    }
    return result;
  }

  generateApplicationActionEvent<DataType>(eventTypeName: string, data: DataType): Event<DataType> {

    console.log("Attempting to generate event for type name " + eventTypeName);
    let eventType: EventType<any> = this.applicationActionEventTypes[eventTypeName];
    if (this.requireEventTypeRegistration && eventType == null) {
      throw "Event Type Name ${eventTypeName} is not registered as an Application Action Event";
    }
    else if (eventType == null) {
      return new Event<DataType>(eventTypeName, data);
    }

    return eventType.generateEvent(data);
  }

  fetchModelChangeEventHandlers(eventTypeName: string) : Subject<any> {

    // TODO need ot handle null
    let handlersWrapper = this.modelUpdateEventTypes[eventTypeName];
    return (handlersWrapper) ? handlersWrapper.handlers : null;
  }
}

export class EventType<T> {

  private actionFunction?: (data: any) => any;
  constructor(readonly eventName: string, actionFunction?: (data: any) => any) {
    if (actionFunction) {
      this.actionFunction = actionFunction;
    }
  };

  generateEvent<T>(data: T): Event<T> {
    console.log("generating event");
    let event = new Event(this.eventName, data, this.actionFunction);

    console.log("event generation complete");
    return event;
  }
}

export class Event<T> {
  eventTypeName: string;
  data:T;
  execute?: (data: any) => any;
  constructor(eventTypeName: string, data:T, execute?: (data: any) => any) {
    this.eventTypeName = eventTypeName;
    this.data = data;
    if (execute != null) {
      this.execute = execute;
    }
  }
}
