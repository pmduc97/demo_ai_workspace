exports.up = async function (knex) {
  const addColumnIfMissing = async (table, column, addColumn) => {
    const exists = await knex.schema.hasColumn(table, column);
    if (!exists) {
      await knex.schema.alterTable(table, (t) => addColumn(t));
    }
  };

  await addColumnIfMissing('users', 'phone', (t) => t.string('phone', 20));
  await addColumnIfMissing('users', 'address', (t) => t.string('address', 255));
  await addColumnIfMissing('users', 'avatar_url', (t) => t.string('avatar_url', 255));
  await addColumnIfMissing('users', 'status', (t) => t.enu('status', ['active', 'locked']).notNullable().defaultTo('active'));
  await addColumnIfMissing('users', 'bio', (t) => t.text('bio'));
  await addColumnIfMissing('users', 'birthdate', (t) => t.date('birthdate'));
  await addColumnIfMissing('users', 'gender', (t) => t.enu('gender', ['male', 'female', 'other', 'unknown']).notNullable().defaultTo('unknown'));
  await addColumnIfMissing('users', 'locked_reason', (t) => t.text('locked_reason'));
  await addColumnIfMissing('users', 'last_login_at', (t) => t.timestamp('last_login_at'));

  await knex.raw('CREATE INDEX IF NOT EXISTS users_role_status_created_at_idx ON users (role, status, created_at)');
  await knex.raw('CREATE INDEX IF NOT EXISTS users_status_deleted_at_idx ON users (status, deleted_at)');
};

exports.down = async function (knex) {
  await knex.raw('DROP INDEX IF EXISTS users_status_deleted_at_idx');
  await knex.raw('DROP INDEX IF EXISTS users_role_status_created_at_idx');

  const dropColumnIfExists = async (table, column) => {
    const exists = await knex.schema.hasColumn(table, column);
    if (exists) {
      await knex.schema.alterTable(table, (t) => t.dropColumn(column));
    }
  };

  for (const column of ['last_login_at', 'locked_reason', 'gender', 'birthdate', 'bio', 'status', 'avatar_url', 'address', 'phone']) {
    await dropColumnIfExists('users', column);
  }
};
