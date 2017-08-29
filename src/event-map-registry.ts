export class EventMapRegistry {

    private static ACTION_MODEL_METHOD_REGISTRY = [];

    static addActionHandler(targetType: any, eventName: string, handlerName: string) {

        let targetTypeEventRegistry = EventMapRegistry.ACTION_MODEL_METHOD_REGISTRY[targetType];
        if (!targetTypeEventRegistry) {
            targetTypeEventRegistry = [];
            EventMapRegistry.ACTION_MODEL_METHOD_REGISTRY[targetType] = targetTypeEventRegistry;
        }

        targetTypeEventRegistry[eventName] = handlerName;
    }

    static getActionHandlerMap(): any[] {
        return EventMapRegistry.ACTION_MODEL_METHOD_REGISTRY;
    }

    static getRegistryForTargetType(targetType: any): any[] {
        return EventMapRegistry.ACTION_MODEL_METHOD_REGISTRY[targetType];
    }
}
