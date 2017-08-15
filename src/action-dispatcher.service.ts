import { Injectable } from '@angular/core';
import { Event, EventTypeRegistryService } from './event-type-registry.service';
import { ModelPresenterService } from "./model-presenter.service";

@Injectable()
export class ActionDispatcherService {


  constructor(readonly modelPresenter: ModelPresenterService, readonly eventTypeRegistry: EventTypeRegistryService) {

  }

  registerEventType(eventTypeName: string, eventFunction?: (this: Event<any>, data: any) => any) {
    this.eventTypeRegistry.registerApplicationActionEventType(eventTypeName, eventFunction);
  }

  generateEvent<DataType>(eventTypeName: string, data: DataType): Event<DataType> {
    return this.eventTypeRegistry.generateApplicationActionEvent(eventTypeName, data);
  }

  dispatch<DataType>(action: Event<DataType>) {

    // Pass the action to the Model Presenter
    let actionResult = true;
    if (action.execute) {
      let actionExecutionResult: any = action.execute(action.data);

      if (actionExecutionResult instanceof Promise) {
        // We got a promise from the action handler, so we need to wait for completion.
        actionExecutionResult.then((executionResultData) => {
          this.modelPresenter.present(action.eventTypeName, executionResultData);
        });
      }
      else {
        // We had an action handler that didn't return a promise, so we're good to go
        this.modelPresenter.present(action.eventTypeName, actionExecutionResult);
      }
    }
    else {
      // We didn't have an action handler - move along
      this.modelPresenter.present(action.eventTypeName, action.data);
    }
  }

}
