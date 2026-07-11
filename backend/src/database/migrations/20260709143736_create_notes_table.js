/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('notes', table=>{
        table.bigIncrements('id').primary();
        table.bigInteger('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
        table.string('title').notNullable();
        table.text('content').notNullable();
        table.timestamp('date_reference').notNullable();
        table.timestamp('deleted_at').nullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('notes');
};
