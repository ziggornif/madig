class TodoRepository {
  constructor(db) {
    this.db = db;

    console.log('[TodoRepository] constructor - instance mounted with :', {
      db,
    });
  }

  findAll() {
    console.log('[TodoRepository] findAll called');
    return this.db.find();
  }
}

module.exports = TodoRepository;
