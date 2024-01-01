import { Scoper } from './index';

describe('scoper lib', () => {
  it('lib exported', () => {
    const scoper = Scoper.create<{ test: string }>({ test: 'abc' });
    scoper.setScopeValue('prd', { test: 'xyz' });

    const res1 = scoper.getValue('prd');
    expect(res1.test).toEqual('xyz');

    const res2 = scoper.getValue('inexistent-scope');
    expect(res2.test).toEqual('abc');
  });
});
