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



module.exports = {
    registerUser,
    loginUser,
    getUserTickets,
    getUserAccount,
    addMoneyToWallet,
    purchaseTicket,
    deductMoneyFromWallet,
    getStations,
    getStationById,
    getBikesAtStation,
    getAllBikes,
    getAllBikeModels,
    getAllBikeCategories
};
