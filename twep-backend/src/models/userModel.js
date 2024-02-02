const pool = require('../db');
const userQueries = require('../queries/userQueries');

class UserModel {
    static async registerUser({ email, password, wallet = 0, tickets = [] }) {
        try {
            const { rows } = await pool.query(userQueries.registerUser, [email, password, wallet, tickets]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async loginUser({ email, password }) {
        try {
            const { rows } = await pool.query(userQueries.loginUser, [email, password]);
            return rows[0] ? rows[0].token : null;
        } catch (error) {
            throw error;
        }
    }

    static async getUserTickets(userId) {
        try {
            const { rows } = await pool.query(userQueries.getUserTickets, [userId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async purchaseTicket(userId, { bikeType, station, purchaseDate, immediateRenting, reservedStation }) {
        try {
            const { rows } = await pool.query(userQueries.purchaseTicket, [
                userId,
                bikeType,
                station,
                purchaseDate,
                immediateRenting,
                reservedStation,
            ]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getUserAccount(userId) {
        try {
            const queryString = userQueries.getUserAccount;
            console.log('Executing SQL Query:', queryString);  // Log the query string

            const { rows } = await pool.query(queryString, [userId]);

            if (rows.length === 0) {
                throw { status: 404, message: 'User account not found' };
            }

            return rows[0];
        } catch (error) {
            throw error;
        }
    }


    static async addMoneyToWallet(userId, amount) {
        try {

            if (typeof amount !== 'number' || amount <= 0) {
                throw { status: 400, message: 'Invalid amount' };
            }

            // Update the user's wallet in the database
            const { rows } = await pool.query(userQueries.addMoneyToWallet, [amount, userId]);

            return rows[0];
        } catch (error) {
            throw error;
        }
    }


}

module.exports = UserModel;
