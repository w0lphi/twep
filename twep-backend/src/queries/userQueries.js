const registerUser = `
    WITH inserted_user AS (
        INSERT INTO users (email, password, wallet)
        VALUES ($1, $2, $3)
        RETURNING id, email, password, role, wallet
    )
    INSERT INTO tickets (id, user_id, bike_id, from_date, until_date, immediate_renting)
    VALUES (uuid_generate_v4(), $1, $2, DEFAULT, DEFAULT, $3)
    RETURNING *;
`;

const loginUser = `
    SELECT user_id
    FROM users
    WHERE email = $1 AND password = $2;
`;

const getUserTickets = `
SELECT
    t.id AS ticket_id,
    t.user_id AS user_id,
    t.from_date,
    t.until_date,
    t.immediate_renting,
    t.qr_code_base64,
    t.status,
    t.price,
    jsonb_build_object(
        'id', ib.id,
        'status', ib.status,
        'categoryId', bc.id,
        'category', bc.name,
        'modelId', bm.id,
        'model', bm.name,
        'description', bm.description,
        'wheelSize', bm.wheel_size,
        'extraFeatures', bm.extra_features,
        'parkingPlaceId', pp.id,
        'station', jsonb_build_object(
            'id', s.id,
            'name', s.name,
            'location', s.location,
            'operational', s.operational
        )
    ) AS bike
FROM
    tickets t
JOIN
    individual_bikes ib ON t.bike_id = ib.id
JOIN
    bike_models bm ON ib.bike_model_id = bm.id
JOIN
    bike_categories bc ON bm.category_id = bc.id
JOIN
    parking_places pp ON ib.parking_place_id = pp.id
JOIN
    stations s ON pp.station_id = s.id
WHERE
    t.user_id = $1;
`;

const deductMoneyFromWallet = 'UPDATE users SET wallet = wallet - $1 WHERE id = $2 RETURNING *'

const getUserAccount = `
    SELECT
        u.id,
        u.email,
        u.role,
        u.wallet,
        t.id AS ticket_id,
        t.bike_id,
        to_char(t.from_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS from_date,
        to_char(t.until_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS until_date,
        t.immediate_renting AS immediate_renting,
        t.status,
        t.price
    FROM
        users u
    LEFT JOIN
        tickets t ON u.id = t.user_id
    WHERE
        u.id = $1; 
`;


const addMoneyToWallet = `
    UPDATE users
    SET wallet = wallet + $1
    WHERE id = $2
    RETURNING *;
`;

const purchaseTicket = `
    INSERT INTO tickets (id, user_id, bike_id, from_date, until_date, immediate_renting, qr_code_base64)
    VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)
    RETURNING
        id,
        bike_id,
        from_date,
        until_date,
        immediate_renting,
        qr_code_base64,
        status,
        price;
`;

const checkIfBikeIsBooked = `
        SELECT 
            *
        FROM
            tickets
        WHERE
            bike_id = $1 
        AND 
            ((from_date BETWEEN SYMMETRIC $2 AND $3) OR (until_date BETWEEN SYMMETRIC $2 AND $3))
        LIMIT 1
`

const getStations = `
    SELECT
    s.id AS id,
    s.name AS name,
    s.location AS location,
    s.operational AS operational,
    json_agg(jsonb_build_object(
        'id', pp.id,
        'bikeCategories', pp.bike_categories,
        'occupied', pp.occupied
    )) AS parking_places
    FROM
    stations s
    LEFT JOIN
    parking_places pp ON s.id = pp.station_id
    GROUP BY
    s.id, s.name, s.location, s.operational;
`;

const getStationById = `
    SELECT
        s.id AS id,
        s.name AS name,
        s.location AS location,
        s.operational AS operational,
        json_agg(jsonb_build_object(
            'id', pp.id,
            'bikeCategories', pp.bike_categories,
            'occupied', pp.occupied
        )) AS parking_places
    FROM
        stations s
    LEFT JOIN
        parking_places pp ON s.id = pp.station_id
    WHERE
        s.id = $1
    GROUP BY
        s.id, s.name, s.location, s.operational;
`;

const getBikesAtStation = `
    SELECT
    ib.id AS id,
    ib.status AS status,
    bc.name AS category,
    bm.name AS model,
    bm.description AS description,
    bm.wheel_size AS wheel_size,
    bm.extra_features AS extra_features,
    pp.id AS parking_place_id
    FROM
    individual_bikes ib
    JOIN
    bike_models bm ON ib.bike_model_id = bm.id
    JOIN
    bike_categories bc ON bm.category_id = bc.id
    JOIN
    parking_places pp ON ib.parking_place_id = pp.id
    JOIN
    stations s ON pp.station_id = s.id
    WHERE
    pp.station_id = $1;
`;

const getAllBikes = `
    SELECT
    ib.id AS id,
    ib.status AS status,
    bc.id AS category_id,
    bc.name AS category,
    bm.id AS model_id,
    bm.name AS model,
    bm.description AS description,
    bm.wheel_size AS wheel_size,
    bm.extra_features AS extra_features,
    pp.id AS parking_place_id,
    jsonb_build_object(
        'id', s.id,
        'name', s.name,
        'location', s.location,
        'operational', s.operational
    ) AS station
    FROM
    individual_bikes ib
    JOIN
    bike_models bm ON ib.bike_model_id = bm.id
    JOIN
    bike_categories bc ON bm.category_id = bc.id
    JOIN
    parking_places pp ON ib.parking_place_id = pp.id
    JOIN
    stations s ON pp.station_id = s.id
    GROUP BY
    ib.id, ib.status, bc.name, bc.id, bm.id, bm.name, bm.description, bm.wheel_size, bm.extra_features, pp.id, s.id
`;

const getAllBikeModels = 'SELECT * FROM bike_models';
const getAllBikeCategories = 'SELECT * FROM bike_categories';
const getTicketById = 'SELECT * FROM tickets WHERE id = $1';
const updateTicketStatus = 'UPDATE tickets SET status = $1 WHERE id = $2';




module.exports = {
    registerUser,
    loginUser,
    getUserTickets,
    getUserAccount,
    addMoneyToWallet,
    purchaseTicket,
    checkIfBikeIsBooked,
    deductMoneyFromWallet,
    getStations,
    getStationById,
    getBikesAtStation,
    getAllBikes,
    getAllBikeModels,
    getAllBikeCategories,
    getTicketById,
    updateTicketStatus,
};
