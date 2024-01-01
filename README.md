# scoper

JS lib for resolving scope values by merging a specific scope with a default scope.

For example, if you have the following configuration:

```ts
{
    default: {
        num_instances: 2,
        color: "white"
    },
    prd: {
        num_instances: 10
    }
}
```

If you query for configs for "prd" it will return

```ts
{
    num_instances: 10,
    color: "white"
}
```

## How to use

```sh
pnpm install scoper
```

```ts
import { Scoper } from 'scoperjs';

const scoper = Scoper.create<{ test: string }>({ test: 'abc' });
scoper.
const res = scoper.getValue('test');
// res == 'abc'

```

## Prepare dev env

```sh
nvm use 18
corepack enable
pnpm install
```