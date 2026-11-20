/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('items').del();
  await knex('users').del();

  await knex.raw('ALTER SEQUENCE items_id_seq RESTART WITH 1');
  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');

  await knex('users').insert([
    { f_name: 'Brian', l_name: 'O\'Conner', username: 'skyline', password: 'test' },
    { f_name: 'Roman', l_name: 'Pearce', username: 'eclipse', password: 'test' },
    { f_name: 'Monica', l_name: 'Fuentes', username: 'undercover', password: 'test' },
    { f_name: 'Tej', l_name: 'Parker', username: 'cyber', password: 'test' },
    { f_name: 'Carter', l_name: 'Verone', username: 'cigar', password: 'test' },
    { f_name: 'Sean', l_name: 'Boswell', username: 'evo', password: 'test' },
    { f_name: 'Han', l_name: 'Lue', username: 'rx7', password: 'test' },
    { f_name: 'Neela', l_name: 'Ezar', username: 'rx8', password: 'test' },
    { f_name: 'Takashi', l_name: 'Kamata', username: '350z', password: 'test' },
    { f_name: 'Earl', l_name: 'Hu', username: 'silvia', password: 'test' }
  ]);

  await knex('items').insert([
    { user_id: 1, name: 'Nissan Skyline GT-R R34', description: 'Silver and blue metallic coupe with twin-turbo engine', qty: '1' },
    { user_id: 2, name: 'Mitsubishi Eclipse Spyder', description: 'Purple convertible sports car with custom body kit', qty: '1' },
    { user_id: 3, name: 'GPS Tracking Device', description: 'Compact undercover transmitter for vehicle monitoring', qty: '3' },
    { user_id: 4, name: 'Nitrous Oxide System', description: 'Dual-bottle NOS setup with purge valve kit', qty: '5' },
    { user_id: 5, name: 'Custom Yacht Charter', description: 'Luxury private vessel docked in Miami harbor', qty: '1' },
    { user_id: 6, name: '1967 Ford Mustang Fastback', description: 'Classic American muscle shell swapped with an RB26 engine', qty: '1' },
    { user_id: 7, name: 'Mazda RX-7 VeilSide', description: 'Orange and black widebody rotary drift car', qty: '1' },
    { user_id: 8, name: 'Sparco Racing Helmet', description: 'Lightweight full-face helmet for mountain drift runs', qty: '2' },
    { user_id: 9, name: 'Nissan 350Z Fairlady', description: 'Black and grey twin-turbo drift coupe', qty: '1' },
    { user_id: 10, name: 'Hulk Green Touran', description: 'Custom green Volkswagen van with fist-themed paint job', qty: '1' }
  ]);
};
