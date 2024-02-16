const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../src/db');
const { v4: uuidv4 } = require('uuid');
const userQueries = require('../queries/userQueries');
const { convertKeysToCamelCase, snakeCaseToCamelCase, convertSnakeToCamel } = require('../utility/utility');
const UserModel = require('../models/userModel');
const path = require('path');

const qr = require('qrcode');
const fs = require('fs');
const StationModel = require('../models/stationModel');

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
        const loggedInUser = user.rows[0];
        const token = jwt.sign({
            userId: loggedInUser.id,
            email: loggedInUser.email,
            role: loggedInUser.role
        }, 'twep-jwt-secret', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserAccount = async (userId) => {
    try {
        const userAccount = await UserModel.getUserAccount(userId);
        return userAccount;
    } catch (error) {
        throw error;
    }
};

const getAllTicketsForUser = async (req, res) => {
    try {
        const { userId } = req.params;


        const tickets = await UserModel.getUserTickets(userId);

        const camelCaseTickets = tickets.map(ticket => convertSnakeToCamel(ticket));


        res.status(200).json(camelCaseTickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getStations = async (req, res) => {
    try {

        const stations = await UserModel.getAllStations();
        const camelCaseStations = stations.map(station => convertKeysToCamelCase(station));
        const responseObject = {
            stations: camelCaseStations
        };

        res.json(responseObject);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        throw error;
    }

}

const getStationById = async (req, res) => {
    const { id } = req.params;

    try {
        const station = await UserModel.getStationById(id);

        if (!station) {
            // Return 404 if the station with the specified ID is not found
            return res.status(404).json({ error: 'Station not found' });
        }

        const camelCaseStation = convertKeysToCamelCase(station);

        res.json(camelCaseStation);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const getBikesAtStation = async (req, res) => {
    try {
        const { stationId } = req.params;

        const bikes = convertKeysToCamelCase(await UserModel.getBikesAtStation(stationId));
        const response = { bikes }
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllBikes = async (req, res) => {
    try {

        const bikes = convertKeysToCamelCase(
            await UserModel.getAllBikes()
        );
        const response = { bikes };
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getAllBikeModels = async (req, res) => {
    try {
        const bikeModels = await UserModel.getAllBikeModels();

        const camelCaseBikeModels = bikeModels.map(model => convertKeysToCamelCase(model));

        res.json(camelCaseBikeModels);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const getAllBikeCategories = async (req, res) => {
    try {
        const bikeCategories = await UserModel.getAllBikeCategories();

        const camelCaseBikeCategories = bikeCategories.map(category => convertKeysToCamelCase(category));

        res.json(camelCaseBikeCategories);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

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


const purchaseTicket = async (req, res) => {
    try {
        const {
            bikeId,
            fromDate,
            untilDate,
            immediateRenting,
        } = req.body;
        const userId = req.params.userId;
        const tokenUserId = req.user.userId;

        // Check if the user ID from the token matches the user ID from the request parameters
        if (userId !== tokenUserId) {
            return res.status(403).json({ error: "Forbidden - You can only purchase tickets for yourself" });
        }

        try {
            const fromDateMs = new Date(fromDate).getTime();
            const untilDateMs = new Date(untilDate).getTime();
            if (untilDateMs <= fromDateMs) {
                return res.status(400).json({ error: "Ticket end date must after start date" });
            }

            if (fromDateMs < Date.now()) {
                return res.status(400).json({ error: "Ticket start date must be in the future" });
            }

            if (untilDateMs < Date.now()) {
                return res.status(400).json({ error: "Ticket end date must be in the future" });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: "Malformed date input" });
        }

        const isAlreadyBooked = await UserModel.checkIfBikeIsBooked(bikeId, fromDate, untilDate);
        if (isAlreadyBooked) {
            return res.status(400).json({ error: "Bike is already booked in the given time interval" });
        }


        // Generate QR code for the purchased ticket
        const qrCodeBase64 = await generateQRCode({ bikeId, fromDate, untilDate });

        // Proceed with ticket purchase if wallet balance is sufficient, passing the generated QR code
        const purchasedTicket = await UserModel.purchaseTicket(userId, {
            bikeId,
            fromDate,
            untilDate,
            immediateRenting,
            qrCodeBase64,
        });


        const purchasedTicketCamel = convertKeysToCamelCase(purchasedTicket);

        return res.status(201).json({
            ticket: purchasedTicketCamel,
            qrCodePath: purchasedTicketCamel.qrCodePath // Return the QR code path in the response
        });;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const calculatePrice = async (req, res) => {
    try {
        const {
            bikeId,
            fromDate,
            untilDate,
        } = req.body;
        const { userId, ticketId } = req.params;


        // Retrieve bike information to get the category ID
        const bike = await StationModel.findById(bikeId);
        if (!bike) {
            return res.status(404).json({ error: "Bike not found" });
        }

        // Retrieve bike category information to get the price per hour
        const bikeCategory = await StationModel.getBikeCategoryById(bike.category_id);
        if (!bikeCategory) {
            return res.status(404).json({ error: "Bike category not found" });
        }

        // Calculate the total cost based on the price per hour and duration
        const pricePerHour = bikeCategory.hour_price;
        const durationInHours = Math.ceil((new Date(untilDate) - new Date(fromDate)) / (1000 * 60 * 60));
        const totalCost = pricePerHour * durationInHours;

        // Check user's wallet balance
        const { wallet } = await getUserAccount(userId)
        if (wallet < totalCost) {
            return res.status(400).json({ error: 'Insufficient funds in the wallet for ticket purchase' });
        }

        // Insert ticket into the ticket table
        await UserModel.insertPriceIntoTicket(ticketId, totalCost);

        // Deduct ticket cost from the user's wallet
        await UserModel.deductMoneyFromWallet(userId, totalCost);


        return res.status(201).json({
            price: totalCost
        });;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const simulateTakingBike = async (req, res) => {
    const { userId, ticketId } = req.params;

    try {

        const ticket = await UserModel.getTicketById(ticketId);

        if (!ticket || ticket.user_id !== userId) {
            return res.status(404).json({ message: 'Ticket not found or does not belong to the user.' });
        }

        if (ticket.status !== 'unused') {
            return res.status(400).json({ message: 'Ticket status is not valid for riding.' });
        }

        const bike = await StationModel.findById(ticket.bike_id);



        await StationModel.markParkingPlaceAsVacant(bike.parking_place_id);

        await StationModel.markBikeAsRented(bike.id);

        // TODO mark parking_place in table individual_bikes to smth specific

        await UserModel.updateTicketStatus(ticketId, 'rented');


        return res.status(200).json({ message: 'Taking bike simulated successfully.' });
    } catch (error) {
        console.error('Error simulating ride:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const simulateReturningBike = async (req, res) => {
    const { userId, ticketId } = req.params;
    const { stationId, bikeId } = req.body;

    try {
        // Check if the ticket exists and belongs to the user
        const ticket = await UserModel.getTicketById(ticketId);


        if (!ticket || ticket.user_id !== userId) {
            return res.status(404).json({ message: 'Ticket not found or does not belong to the user.' });
        }

        // Check if the ticket status is 'rented'
        if (ticket.status !== 'rented') {
            return res.status(400).json({ message: 'Ticket status is not valid for returning.' });
        }

        // Retrieve the bike using its ID
        const bike = await StationModel.findById(ticket.bike_id);
        if (!bike) {
            return res.status(404).json({ message: 'Bike not found.' });
        }

        // Check if the station exists
        const station = await StationModel.getStationById(stationId);
        if (!station) {
            return res.status(404).json({ message: 'Station not found.' });
        }

        // Check if the station has a parking place available for the bike category
        const bikeCategoryString = await StationModel.getBikeCategoryString(bike.category_id);
        const parkingPlaceAvailable = await StationModel.findAvailableParkingPlace(stationId, { name: bikeCategoryString });
        if (!parkingPlaceAvailable) {
            return res.status(400).json({ message: 'No available parking place for this bike category at the station.' });
        }

        // Mark bike as available
        await StationModel.markBikeAsAvailable(ticket.bike_id);

        // Mark parking place as occupied
        await StationModel.markParkingPlaceAsOccupied(stationId, ticket.bike_id);

        // Update individual bike with the new parking place ID
        await StationModel.updateParkingPlace(bikeId, stationId);

        // Update ticket status as returned
        await UserModel.updateTicketStatus(ticketId, 'returned');

        return res.status(200).json({ message: 'Bike returned successfully.' });
    } catch (error) {
        console.error('Error simulating bike return:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};






// Function to generate QR code for ticket data
async function generateQRCode(ticketData) {
    try {
        const qrData = JSON.stringify(ticketData);
        const qrCodeDir = path.join(__dirname, 'qr_codes'); // Path to save QR code image
        const qrCodePath = path.join(qrCodeDir, 'ticket_qr.png'); // Full path to save QR code image

        // Create the directory if it doesn't exist
        if (!fs.existsSync(qrCodeDir)) {
            fs.mkdirSync(qrCodeDir);
        }

        // Generate QR code and save it to file
        await qr.toFile(qrCodePath, qrData);

        // Read the generated PNG image file
        const pngData = fs.readFileSync(qrCodePath);

        // Convert the PNG image data to base64
        const base64Data = Buffer.from(pngData).toString('base64');

        // Remove the PNG image file (optional)
        fs.unlinkSync(qrCodePath);

        return base64Data;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}



module.exports = {
    registerUser,
    loginUser,
    getUserAccount,
    addMoneyToWallet,
    purchaseTicket,
    getStations,
    getStationById,
    getBikesAtStation,
    getAllTicketsForUser,
    getAllBikes,
    getAllBikeCategories,
    getAllBikeModels,
    simulateTakingBike,
    simulateReturningBike,
    calculatePrice,
};
