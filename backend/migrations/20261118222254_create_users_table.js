/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema
        .createTable('users', table => {
            table.increments('id').primary();
            table.string("f_name").notNullable();
            table.string("l_name").notNullable();
            table.string("username").notNullable().unique();
            table.string("password").notNullable();
            table.timestamps(true, true)
        })
        .createTable('items', table => {
            table.increments('id');
            table.integer("user_id").unsigned().references('id').inTable('users').notNullable().onDelete('CASCADE');
            table.string("name").notNullable().unique();
            table.string("description").notNullable();
            table.integer("qty").notNullable().defaultTo(0)
            table.timestamps(true, true)
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema
        .dropTableIfExists('items')
        .dropTableIfExists('users')
};
