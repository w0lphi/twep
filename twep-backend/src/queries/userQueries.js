const registerUser = `
    INSERT INTO users (email, password, wallet)
    VALUES ($1, $2, $3)
    RETURNING user_id, email, wallet;
`;

const loginUser = `
    SELECT user_id
    FROM users
    WHERE email = $1 AND password = $2;
`;

const getUserTickets = `
    SELECT id, bike_type, station, purchase_date, immediate_renting, reserved_station
    FROM tickets
    WHERE user_id = $1;
`;

const purchaseTicket = `
    INSERT INTO tickets (user_id, bike_type, station, purchase_date, immediate_renting, reserved_station)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
`;

module.exports = {
    registerUser,
    loginUser,
    getUserTickets,
    purchaseTicket,
};
