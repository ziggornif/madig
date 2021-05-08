class Db {
  static getInstance() {
    if (!Db.instance) {
      Db.instance = new Db();
    }
    return Db.instance;
  }

  find() {
    console.log('[Db] find - called');
  }

  findOne() {
    console.log('[Db] findOne - called');
  }
}

module.exports = Db;
