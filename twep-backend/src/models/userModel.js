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
            return rows.map(ticket => {
                return {
                    ...ticket,
                    from_date: ticket.from_date.toISOString(),
                    until_date: ticket.until_date.toISOString()
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
                from_date: purchasedTicket.from_date.toISOString(),
                until_date: purchasedTicket.until_date.toISOString()
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

            if (rows.length === 0) {
                throw { status: 404, message: 'User account not found' };
            }

            const userAccount = {
                id: rows[0].id,
                email: rows[0].email,
                role: rows[0].role,
                wallet: rows[0].wallet,
                tickets: rows.map(ticket => ({
                    id: ticket.id,
                    bikeId: ticket.bike_id,
                    fromDate: ticket.from_date,
                    untilDate: ticket.until_date,
                    immediateRenting: ticket.immediate_renting,
                    status: status,
                    price: price,
                })),
            };

            return userAccount;
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
}

module.exports = UserModel;
