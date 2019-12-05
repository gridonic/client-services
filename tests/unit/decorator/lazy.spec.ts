import Lazy from '@/decorator/lazy';

describe('@Lazy', () => {
  class LazyClass {
    public getterCallCount: number = 0;

    @Lazy()
    public get lazyString() {
      this.getterCallCount += 1;
      return 'Lazy Loaded String';
    }
  }

  let lazy: LazyClass;

  function accessLazyString() {
    return lazy.lazyString;
  }

  function expectGetterCallCountToBe(expectedCount: number) {
    expect(lazy.getterCallCount).toBe(expectedCount);
  }

  beforeEach(() => {
    lazy = new LazyClass();
  });

  test('lazy getter returning correct value', () => {
    expect(lazy.lazyString).toEqual('Lazy Loaded String');
  });

  test('lazy getter not called after instanciation', () => {
    expectGetterCallCountToBe(0);
  });

  test('lazy getter called once on single access', () => {
    accessLazyString();

    expectGetterCallCountToBe(1);
  });

  test('lazy getter called once on multiple access', () => {
    accessLazyString();
    accessLazyString();
    accessLazyString();

    expectGetterCallCountToBe(1);
  });
});
