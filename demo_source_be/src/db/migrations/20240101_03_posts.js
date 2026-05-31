exports.up = function (knex) {
  return knex.schema.createTable('posts', (t) => {
    t.increments('id').primary();
    t.string('title').notNullable();
    t.string('slug').notNullable().unique();
    t.text('content');
    t.string('thumbnail_url');
    t.enu('status', ['draft', 'published']).notNullable().defaultTo('draft');
    t.integer('author_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('posts');
};
