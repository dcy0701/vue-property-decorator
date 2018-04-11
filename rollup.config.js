export default {
  input: 'lib/mta-vue-decorators.js',
  name: 'VuePropertyDecorator',
  output: {
    file: 'lib/mta-vue-decorators.umd.js',
    format: 'umd'
  },
  external: [
    'vue', 'vue-class-component', 'reflect-metadata'
  ],
  exports: 'named',
  name: 'vue-property-decorator',
  globals: {
    'vue': 'Vue',
    'vue-class-component': 'VueClassComponent'
  }
}
