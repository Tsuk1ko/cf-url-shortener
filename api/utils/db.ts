export class ShortenDB {
  constructor(
    private db: D1Database,
    private lib?: typeof import('./sha1Id'),
  ) {}

  async getUrlById(id: string) {
    return (await this.db.prepare('SELECT url FROM shorten WHERE id = ?').bind(id).first<{ url: string }>())?.url;
  }

  async addUrl(url: string) {
    {
      const id = await this.getIdByUrl(url);
      if (id) return id;
    }

    {
      const id = await this.findAvaliableId(url);
      if (id) {
        await this.addUrlById(id, url);
        return id;
      }
    }
  }

  private async isIdExist(id: string) {
    return !!(await this.getUrlById(id));
  }

  private async findAvaliableId(url: string) {
    if (!this.lib) throw new Error('No lib');
    const { getSha1Ids, getRandId } = this.lib;

    // hash id
    for (const id of await getSha1Ids(url)) {
      if (!(await this.isIdExist(id))) return id;
    }

    // random id
    for (let i = 0; i < 10; i++) {
      const id = getRandId();
      if (!(await this.isIdExist(id))) return id;
    }
  }

  private async getIdByUrl(url: string) {
    return (await this.db.prepare('SELECT id FROM shorten WHERE url = ?').bind(url).first<{ id: string }>())?.id;
  }

  private async addUrlById(id: string, url: string) {
    const { error } = await this.db
      .prepare('INSERT INTO shorten (id, url, createTime) VALUES (?, ?, ?)')
      .bind(id, url, Date.now())
      .run();
    if (error) {
      console.error('[DB_INSERT]', error);
      throw error;
    }
  }
}
