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
}

module.exports = UserModel;
