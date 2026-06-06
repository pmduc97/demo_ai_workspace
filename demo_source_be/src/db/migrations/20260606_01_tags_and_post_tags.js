exports.up = async function (knex) {
  await knex.schema.createTable('tags', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('slug').notNullable();
    t.text('description');
    
    // Common columns
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.integer('updated_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
    t.timestamp('deleted_at');
    t.integer('deleted_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
  });

  await knex.raw('CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_active_unique ON tags (slug) WHERE deleted_at IS NULL');

  await knex.schema.createTable('post_tags', (t) => {
    t.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE');
    t.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.primary(['post_id', 'tag_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('post_tags');
  await knex.raw('DROP INDEX IF EXISTS tags_slug_active_unique');
  await knex.schema.dropTableIfExists('tags');
};
