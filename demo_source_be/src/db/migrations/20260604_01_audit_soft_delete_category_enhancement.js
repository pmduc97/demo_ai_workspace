exports.up = async function (knex) {
  const addColumnIfMissing = async (table, column, addColumn) => {
    const exists = await knex.schema.hasColumn(table, column);
    if (!exists) {
      await knex.schema.alterTable(table, (t) => addColumn(t));
    }
  };

  for (const table of ['users', 'categories', 'posts']) {
    await addColumnIfMissing(table, 'updated_at', (t) => t.timestamp('updated_at').defaultTo(knex.fn.now()));
    await addColumnIfMissing(table, 'created_by', (t) => t.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL'));
    await addColumnIfMissing(table, 'updated_by', (t) => t.integer('updated_by').unsigned().references('id').inTable('users').onDelete('SET NULL'));
    await addColumnIfMissing(table, 'deleted_at', (t) => t.timestamp('deleted_at'));
    await addColumnIfMissing(table, 'deleted_by', (t) => t.integer('deleted_by').unsigned().references('id').inTable('users').onDelete('SET NULL'));
  }

  await addColumnIfMissing('categories', 'status', (t) => t.enu('status', ['active', 'hidden']).notNullable().defaultTo('active'));
  await addColumnIfMissing('categories', 'thumbnail_url', (t) => t.string('thumbnail_url'));
  await addColumnIfMissing('categories', 'seo_title', (t) => t.string('seo_title', 70));
  await addColumnIfMissing('categories', 'seo_description', (t) => t.string('seo_description', 160));
  await addColumnIfMissing('posts', 'view_count', (t) => t.integer('view_count').notNullable().defaultTo(0));

  await knex.schema.alterTable('categories', (t) => {
    t.dropUnique(['slug']);
  }).catch(() => undefined);
  await knex.raw('CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_active_unique ON categories (slug) WHERE deleted_at IS NULL');
};

exports.down = async function (knex) {
  await knex.raw('DROP INDEX IF EXISTS categories_slug_active_unique');

  await knex.schema.alterTable('categories', (t) => {
    t.unique(['slug']);
  }).catch(() => undefined);

  const dropColumnIfExists = async (table, column) => {
    const exists = await knex.schema.hasColumn(table, column);
    if (exists) {
      await knex.schema.alterTable(table, (t) => t.dropColumn(column));
    }
  };

  for (const column of ['status', 'thumbnail_url', 'seo_title', 'seo_description']) {
    await dropColumnIfExists('categories', column);
  }
  await dropColumnIfExists('posts', 'view_count');

  for (const table of ['users', 'categories', 'posts']) {
    for (const column of ['created_by', 'updated_by', 'deleted_by', 'deleted_at']) {
      await dropColumnIfExists(table, column);
    }
  }
};
