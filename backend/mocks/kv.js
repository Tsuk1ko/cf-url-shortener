export default class KV extends Map {
  constructor() {
    super();
  }
  async get() {
    return super.get(arguments);
  }
  async put() {
    return super.set(arguments);
  }
}
