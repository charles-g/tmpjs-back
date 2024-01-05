export function LogMethod(target: any, key: string, descriptor: PropertyDescriptor): void {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]): any {
    console.log(`Method ${key} called with arguments: ${JSON.stringify(args)}`);
    const result = originalMethod.apply(this, args);
    console.log(`Method ${key} execution completed.`);
    return result;
  };
}

export function LogFunction(target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<Function>): void {
  const originalFunction = target[key];

  target[key] = function (...args: any[]): any {
    console.log(`Function ${key.toString()} called with arguments: ${JSON.stringify(args)}`);
    const result = originalFunction.apply(this, args);
    console.log(`Function ${key.toString()} execution completed.`);
    return result;
  };
}
