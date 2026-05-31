exports.up = function (knex) {
  return knex.schema.createTable('categories', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('slug').notNullable().unique();
    t.text('description');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('categories');
};
