exports.up = async function (knex) {
  const addColumnIfMissing = async (table, column, addColumn) => {
    const exists = await knex.schema.hasColumn(table, column);
    if (!exists) {
      await knex.schema.alterTable(table, (t) => addColumn(t));
    }
  };

  for (const table of ['users', 'categories', 'posts']) {
    await addColumnIfMissing(table, 'created_at', (t) => t.timestamp('created_at').defaultTo(knex.fn.now()));
  }
};

exports.down = async function (knex) {
  const dropColumnIfExists = async (table, column) => {
    const exists = await knex.schema.hasColumn(table, column);
    if (exists) {
      await knex.schema.alterTable(table, (t) => t.dropColumn(column));
    }
  };

  for (const table of ['users', 'categories', 'posts']) {
    await dropColumnIfExists(table, 'created_at');
  }
};
