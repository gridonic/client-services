// @ts-ignore
import each from 'promise-each';

const promise = {
  each: async <T> (array: T[], fn: (i: T) => Promise<any>) => Promise.resolve(array).then(each(fn)),
};

export default promise;
