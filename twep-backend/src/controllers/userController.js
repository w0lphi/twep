const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../src/db');
const { v4: uuidv4 } = require('uuid');
const userQueries = require('../queries/userQueries');
const { convertKeysToCamelCase, snakeCaseToCamelCase } = require('../utility/utility');
const UserModel = require('../models/userModel');

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user in the database
        const newUser = await pool.query('INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING *', [uuidv4(), email, hashedPassword]);

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.rows[0].id, email: user.rows[0].email }, 'your-jwt-secret', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserAccount = async (userId) => {
    try {
        const accountDetails = await pool.query(userQueries.getUserAccount, [userId]);

        if (accountDetails.rows.length === 0) {
            throw { status: 404, message: 'User account not found' };
        }

        const { id, email, role, wallet, ticket_id, bike_type, station, purchase_date, immediate_renting, reserved_station } = accountDetails.rows[0];

        const response = {
            id,
            email,
            role,
            wallet,
            tickets: [],
        };

        if (ticket_id) {
            response.tickets.push({
                id: ticket_id,
                bikeType: bike_type,
                station,
                purchaseDate: purchase_date,
                immediateRenting: immediate_renting,
                reservedStation: reserved_station,
            });
        }

        return response;
    } catch (error) {
        throw error;
    }
};




const addMoneyToWallet = async (userId, amount) => {
    try {

        const updatedUser = await UserModel.addMoneyToWallet(userId, amount);

        const response = {
            id: updatedUser.id,
            email: updatedUser.email,
            wallet: updatedUser.wallet,
        };

        return convertKeysToCamelCase(response);
    } catch (error) {
        throw error;
    }
};

const ticketCost = 10;
const purchaseTicket = async (userId, { bikeType, station, purchaseDate, immediateRenting, reservedStation }) => {
    try {
        // Check user's wallet balance
        const userAccount = await UserModel.getUserAccount(userId);

        if (userAccount.wallet < 10) {
            throw { status: 400, message: 'Insufficient funds in the wallet for ticket purchase' };
        }

        // Proceed with ticket purchase if wallet balance is sufficient
        const purchasedTicket = await UserModel.purchaseTicket(userId, {
            bikeType,
            station,
            purchaseDate,
            immediateRenting,
            reservedStation,
        });

        // Deduct ticket cost from the user's wallet
        await UserModel.deductMoneyFromWallet(userId, ticketCost);

        const camelCasePurchasedTicket = convertKeysToCamelCase(purchasedTicket);

        return camelCasePurchasedTicket;
    } catch (error) {
        throw error;
    }
};



module.exports = {
    registerUser,
    loginUser,
    getUserAccount,
    addMoneyToWallet,
    purchaseTicket
};
