const pool = require('../db');
const userQueries = require('../queries/userQueries');
const fns = require('date-fns')

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
            return rows.map(ticket => {
                return {
                    ...ticket,
                    from_date: fns.formatISO(ticket.from_date),
                    until_date: fns.formatISO(ticket.until_date),
                };
            });
        } catch (error) {
            throw error;
        }
    }

    static async getAllStations() {
        try {
            const { rows } = await pool.query(userQueries.getStations);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getStationById(stationId) {
        try {
            const { rows } = await pool.query(userQueries.getStationById, [stationId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getBikesAtStation(stationId) {
        try {
            const bikes = await pool.query(userQueries.getBikesAtStation, [stationId]);
            return bikes.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getAllBikes() {
        try {
            const bikes = await pool.query(userQueries.getAllBikes);
            return bikes.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getAllBikeModels() {
        try {
            const { rows } = await pool.query(userQueries.getAllBikeModels);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getAllBikeCategories() {
        try {
            const { rows } = await pool.query(userQueries.getAllBikeCategories);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async purchaseTicket(userId, { bikeId, immediateRenting, fromDate, untilDate, qrCodeBase64 }) {
        try {
            const { rows } = await pool.query(userQueries.purchaseTicket, [
                userId,
                bikeId,
                fromDate,
                untilDate,
                immediateRenting,
                qrCodeBase64,
            ]);
            const purchasedTicket = rows[0];
            return {
                ...purchasedTicket,
                from_date: fns.formatISO(purchasedTicket.from_date),
                until_date: fns.formatISO(purchasedTicket.until_date)
            };
        } catch (error) {
            throw error;
        }
    }

    static async checkIfBikeIsBooked(bikeId, fromDate, untilDate) {
        try {
            const { rows } = await pool.query(userQueries.checkIfBikeIsBooked, [
                bikeId,
                fromDate,
                untilDate,
            ]);
            return rows.length > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getUserAccount(userId) {
        try {
            const queryString = userQueries.getUserAccount;
            const { rows } = await pool.query(queryString, [userId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async deductMoneyFromWallet(userId, amount) {
        try {
            const queryString = userQueries.deductMoneyFromWallet;
            const result = await pool.query(queryString, [amount, userId]);

            // Check if the query was successful
            if (result.rowCount === 0) {
                throw { status: 500, message: 'Failed to deduct money from the wallet' };
            }
        } catch (error) {
            throw error;
        }
    }


    static async addMoneyToWallet(userId, amount) {
        try {

            if (typeof amount !== 'number' || amount <= 0) {
                throw { status: 400, message: 'Invalid amount' };
            }

            const { rows } = await pool.query(userQueries.addMoneyToWallet, [amount, userId]);

            return rows[0];
        } catch (error) {
            throw error;
        }
    }


    static async getTicketById(ticketId) {
        try {
            const query = userQueries.getTicketById;
            const { rows } = await pool.query(query, [ticketId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateTicketStatus(ticketId, status) {
        try {
            const query = userQueries.updateTicketStatus;
            await pool.query(query, [status, ticketId]);
        } catch (error) {
            throw error;
        }
    }

    static async insertPriceIntoTicket(ticketId, price) {
        try {
            const query = userQueries.insertPriceIntoTicket;
            const result = await pool.query(query, [ticketId, price]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserModel;
