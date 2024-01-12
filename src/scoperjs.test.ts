/* eslint-disable fp/no-class */

import { Scoper } from './scoperjs';

class TestInfoClass {
  public var1: string;

  constructor(var1: string) {
    this.var1 = var1;
  }

  // // defining getter method
  // get var1(): string {
  //   return `${this.var1}c`;
  // }

  // // defining setter method
  // set var1(value1: string) {
  //   this.var1 = `${value1}b`;
  // }
}

type TestInfo = {
  test1?: string;
  test2?: {
    test22?: number;
    test23?: string;
  };
};

describe('scoper', () => {
  it('simply returns default values for inexisting scope', () => {
    const scoper = Scoper.create<TestInfo>({ test1: 'aaa' });
    expect(scoper.getValue('inexistingScope')).toStrictEqual({
      test1: 'aaa',
    });
  });

  it('returns all values for scope', () => {
    const scoper = Scoper.create<TestInfo>({ test1: '123' });
    scoper.setScopeValue('scope1', { test1: 'abc' });
    expect(scoper.getValue('scope1')).toStrictEqual({
      test1: 'abc',
    });
  });

  it('returns merged values for scope', () => {
    // set default values
    const scoper = Scoper.create<TestInfo>({
      test1: '123',
      test2: {
        test22: 34,
        test23: '45',
      },
    });

    // set context value
    scoper.setScopeValue('scope1', {
      test2: {
        test22: 3434,
      },
    });

    // should return merged properties
    expect(scoper.getValue('scope1')).toStrictEqual({
      test1: '123',
      test2: {
        test22: 3434,
        test23: '45',
      },
    });
  });

  it('returns merged values for scope 2', () => {
    // set default values
    const scoper = Scoper.create<TestInfo>({
      test2: {
        test22: 34,
      },
    });

    // set context value
    scoper.setScopeValue('scope1', {
      test2: {
        test22: 3434,
      },
    });
    scoper.setScopeValue('scope2', {
      test2: {
        test22: 3434,
        test23: 'aaaa',
      },
    });
  });

  it('internal deep clone shouldnt mess with class instances (this was a bug when using JSON.parse(stringify()) to clone objects)', () => {
    type TestInfo1 = {
      test1?: string;
      testInfo: TestInfoClass;
    };

    // set default values
    const scoper = Scoper.create<TestInfo1>({
      test1: 'test1',
      testInfo: new TestInfoClass('v0'),
    });

    // set context value
    const testInfoScope1 = new TestInfoClass('v1');
    scoper.setScopeValue('scope1', {
      testInfo: testInfoScope1,
    });
    const testInfoScope2 = new TestInfoClass('v1');
    scoper.setScopeValue('scope2', {
      test1: 'test2',
      testInfo: testInfoScope2,
    });

    // should return merged properties
    expect(scoper.getValue('scope1')).toStrictEqual({
      test1: 'test1',
      testInfo: testInfoScope1,
    });
    expect(scoper.getValue('scope2')).toStrictEqual({
      test1: 'test2',
      testInfo: testInfoScope2,
    });
  });

  it('check if internal states are not being mutated (this was a bug because of how "merge" worked before before cloning internal objects)', () => {
    // set default values
    const scoper = Scoper.create<TestInfo>({
      test1: 'bbb',
      test2: {},
    });

    // set context value
    scoper.setScopeValue('scope1', {
      test1: 'ccc',
    });
    scoper.setScopeValue('scope2', {
      test2: {
        test22: 3434,
        test23: 'aaaa',
      },
    });

    // should return merged properties
    expect(scoper.getValue('scope1')).toStrictEqual({
      test1: 'ccc',
      test2: {},
    });
    expect(scoper.getValue('scope2')).toStrictEqual({
      test1: 'bbb',
      test2: {
        test22: 3434,
        test23: 'aaaa',
      },
    });
    expect(scoper.getValue('something')).toStrictEqual({
      test1: 'bbb',
      test2: {},
    });
    expect(scoper.getValue('scope1')).toStrictEqual({
      test1: 'ccc',
      test2: {},
    });

    scoper.setScopeValue('scope1', {
      test1: 'eeee',
    });
    expect(scoper.getValue('scope1')).toStrictEqual({
      test1: 'eeee',
      test2: {},
    });
    expect(scoper.getValue('scope2')).toStrictEqual({
      test1: 'bbb',
      test2: {
        test22: 3434,
        test23: 'aaaa',
      },
    });
  });
});
