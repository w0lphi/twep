const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const pool = require("../db.js"); // Import the database connection pool

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected routes
router.use(verifyToken); // Apply the middleware to all routes below this line

router.get("/stations", userController.getStations);
router.get("/stations/:id", userController.getStationById);
router.get("/stations/:id/ratings", userController.getRatingsByStationId)
router.get("/stations/:stationId/bikes", userController.getBikesAtStation);
router.get("/bikes", userController.getAllBikes);
router.get("/bike-categories", userController.getAllBikeCategories);
router.get("/bike-models", userController.getAllBikeModels);
router.get('/:userId/account/tickets', userController.getAllTicketsForUser);
router.post('/:userId/ratings', userController.createRating);

router.post('/:userId/tickets/:ticketId/ride', userController.simulateTakingBike);
router.post('/:userId/tickets/:ticketId/return', userController.simulateReturningBike);
router.post('/tickets/price', userController.calculatePriceAndRespond);

router.post("/:userId/account/add-money", async (req, res) => {
  try {

    const userId = req.params.userId;
    const tokenUserId = req.user.userId;

    // Check if the user ID from the token matches the user ID from the request parameters
    if (userId !== tokenUserId) {
      return res.status(403).json({ error: "Forbidden - No Access" });
    }

    const { amount } = req.body;

    const updatedUser = await userController.addMoneyToWallet(userId, amount);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/profile", async (req, res) => {
  try {
    // Access user details from req.user (set in verifyToken middleware)
    const userId = req.user.userId;

    // Retrieve user details from the database using userId
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:userId/account", async (req, res) => {
  try {
    const tokenUserId = req.user.userId;
    // Access user details from req.params
    const userId = req.params.userId;

    // Check if the user ID from the token matches the user ID from the request parameters
    if (userId !== tokenUserId) {
      return res.status(403).json({ error: "Forbidden - No Access" });
    }


    // Retrieve user account details using the method from the controller
    const accountDetails = await userController.getUserAccount(userId);

    if (!accountDetails) {
      return res.status(404).json({ error: "User account not found" });
    }

    res.status(200).json(accountDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:userId/account/tickets", verifyToken, userController.purchaseTicket);

module.exports = router;
