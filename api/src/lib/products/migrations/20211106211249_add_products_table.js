exports.up = async function (knex) {
  const sql = `CREATE TABLE products (
      id UUID PRIMARY KEY NOT NULL,
      uid TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL,
      thumbnail_href TEXT NOT NULL,
      type TEXT NOT NULL,
      metadata JSONB NOT NULL,
      vectors TSVECTOR,
      time_created_ms BIGINT NOT NULL,
      constraint ck_type check (
        type IN ('book', 'magazine', 'movie')
      ),
      constraint unq_products_uid unique (uid)
  );

  CREATE INDEX idx_products_search ON products USING gin(vectors);

  COMMENT ON COLUMN products.id IS 'The record id';
  COMMENT ON COLUMN products.uid IS 'A human readable unique identifier';
  COMMENT ON COLUMN products.title IS 'The name of the product';
  COMMENT ON COLUMN products.description IS 'A description of the product';
  COMMENT ON COLUMN products.price IS 'The price of the product';
  COMMENT ON COLUMN products.thumbnail_href IS 'A link to the thumbnail of the product';
  COMMENT ON COLUMN products.type IS 'The category the product belongs to';
  COMMENT ON COLUMN products.metadata IS 'Type specific information';
  COMMENT ON COLUMN products.vectors IS 'Full Text vectors';
  COMMENT ON COLUMN products.time_created_ms IS 'The time this record was created, in milliseconds';`

  // read more about the tsvectors: https://compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/

  await knex.transaction(async (trx) => {
    return await trx.raw(sql)
  })
}

exports.down = async function (knex) {
  await knex.transaction(async (trx) => {
    await trx.raw('DROP INDEX idx_products_search;')
    return await trx.raw('DROP TABLE products;')
  })
}
