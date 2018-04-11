# @hfe/mta-vue-decorators

This library fully depends on [vue-class-component](https://github.com/vuejs/vue-class-component).

## License

MIT License

## Install

```bash
yarn add @hfe/mta-vue-decorators
```

## Usage

There are 6 decorators:

* `@Emit`
* `@Prop`
* `@On`
* `@Once`
* `@Watch`
* `@Component` (**exported from** `vue-class-component`)

```typescript
import { Component, Emit, Prop, Vue, Watch } from '@hfe/mta-vue-decorators'

@Component
export class MyComponent extends Vue {
  @Emit()
  addToCount(n: number){ this.count += n }

  @Emit('reset')
  resetCount(){ this.count = 0 }

  @On('receive')
  receiveCb (data){ console.log('i m child, received it', data) }

  @Prop()
  propA: number

  @Prop({ default: 'default value' })
  propB: string

  @Prop([String, Boolean])
  propC: string | boolean

  @Watch('child')
  onChildChanged(val: string, oldVal: string) { }

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged(val: Person, oldVal: Person) { }
}

```

is equivalent to

```js
const s = Symbol('baz')

export const MyComponent = Vue.extend({
  name: 'MyComponent',
  props: {
    propA: Number,
    propB: {
      type: String,
      default: 'default value'
    },
    propC: [String, Boolean],
  },
  provide () {
    return {
      foo: this.foo,
      bar: this.baz
    }
  },
  methods: {
    addToCount(n){
      this.count += n
      this.$emit("add-to-count", n)
    },
    resetCount(){
      this.count = 0
      this.$emit("reset")
    },
    onChildChanged(val, oldVal) { },
    onPersonChanged(val, oldVal) { }
  },
  created () {
      this.$on('receive', function receiveCb (data) {
          console.log('i m child, received it', data)
      })
  },
  watch: {
    'child': {
      handler: 'onChildChanged',
      immediate: false,
      deep: false
    },
    'person': {
      handler: 'onPersonChanged',
      immediate: true,
      deep: true
    }
  }
})
```

## emitDecoratorMetadata (if you use typescript)

As you can see at `propA` and `propB`, the type can be inferred automatically when it's a simple type. For more complex types like enums you do need to specify it specifically.
Also this library needs to have `emitDecoratorMetadata` set to `true` for this to work.

## See also

[vuex-class](https://github.com/ktsn/vuex-class/)

## TODO
- [ ] `@Lifecycle`
- [ ] others
