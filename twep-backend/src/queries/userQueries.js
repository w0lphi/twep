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

const getUserAccount = `
    SELECT
    u.id,
    u.email,
    u.wallet,
    t.id AS ticket_id,
    t.bike_type AS bike_type,
    t.station,
    t.purchase_date AS purchase_date,
    t.immediate_renting AS immediate_renting,
    t.reserved_station AS reserved_Station
    FROM
    users u
    LEFT JOIN
    tickets t ON u.id = t.user_id
    WHERE u.id = $1; 
`;

const addMoneyToWallet = `
    UPDATE users
    SET wallet = wallet + $1
    WHERE id = $2
    RETURNING *;
`;


module.exports = {
    registerUser,
    loginUser,
    getUserTickets,
    purchaseTicket,
    getUserAccount,
    addMoneyToWallet
};
