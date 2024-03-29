import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';

/* eslint-disable no-param-reassign */

// Like Partial, but makes nested properties optional too
// https://grrr.tech/posts/2021/typescript-partial/
type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object | null
    ? Subset<K[attr]> | null
    : K[attr] extends object | null | undefined
    ? Subset<K[attr]> | null | undefined
    : K[attr];
};

export const Scoper = {
  /**
   * Creates a new Context instance
   * Set scope values with "setScopeValue" and retrieve values for a specific scope with "getValue"
   * The returned values will be a merge of values in the scope and the default values set during creation
   * @param {T} defaultValues Value attributes returned for values not set in specific scope values
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  create: <T>(defaultValues: T) => {
    const defaultScope = defaultValues;
    const scopes: Record<string, Subset<T>> = {};
    return {
      /**
       * Gets the resulting value for a specific scope by merging the default values with specific values set to the scope.
       * For example, for defaultValues {test1:'abc', test2:'wyz'} and scope values {test2:'123'} for scope 'dev', the result will be {test1:'123', test2:'wyz'}
       * @param {string} scope Identifier of the scope. If scope doesn't exist, the default values will be returned.
       * @returns {T}
       */
      getValue: (scope: string): T => {
        const scopeValues = scopes[scope];
        if (scopeValues) {
          // merge rewrites input values, so create a copy before invoking
          const dvalues = cloneDeep<T>(defaultScope);
          const svalues = cloneDeep<Subset<T>>(scopeValues);
          // we know the result has the required fields of T as minimum, because the default scope
          // is merged as the basis, and the default scope is set checking if it's T
          return merge(dvalues, svalues);
        }
        return defaultScope;
      },
      /**
       * Sets values for a certain scope
       * @param {string} scope Identifier of the scope. Use 'default' to update the default values
       * @param {string} values Values for the scope
       * @returns {T}
       */
      setScopeValue: (scope: string, values: Subset<T>): void => {
        scopes[scope] = values;
      },
    };
  },
};
