const registerUser = `
    WITH inserted_user AS (
        INSERT INTO users (email, password, wallet)
        VALUES ($1, $2, $3)
        RETURNING id, email, password, role, wallet
    )
    INSERT INTO tickets (user_id, bike_type, station, purchase_date, immediate_renting, reserved_station)
    VALUES ( (SELECT id FROM inserted_user), $4, $5, $6, $7, $8)
    RETURNING *;
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

const deductMoneyFromWallet = 'UPDATE users SET wallet = wallet - $1 WHERE id = $2 RETURNING *'

const getUserAccount = `
    SELECT
    u.id,
    u.email,
    u.role,
    u.wallet,
    t.id AS ticket_id,
    t.bike_type AS bike_type,
    t.station,
    to_char(t.purchase_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS purchase_date,
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

const purchaseTicket = `
    INSERT INTO tickets (id, user_id, bike_type, station, purchase_date, immediate_renting, reserved_station)
    VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)
    RETURNING
        id,
        bike_type,
        station,
        to_char(purchase_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS purchase_date,
        immediate_renting,
        reserved_station;
`;


module.exports = {
    registerUser,
    loginUser,
    getUserTickets,
    getUserAccount,
    addMoneyToWallet,
    purchaseTicket,
    deductMoneyFromWallet,
};
