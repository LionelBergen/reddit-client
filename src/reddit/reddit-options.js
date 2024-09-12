export class RedditOptions {
  constructor(useSimpleReturnValues) {
    this.useSimpleReturnValues = useSimpleReturnValues;
  }
}

export const DefaultOptions = new RedditOptions(true);
