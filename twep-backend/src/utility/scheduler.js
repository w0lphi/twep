const { minutesToMilliseconds } = require("date-fns");
const StationModel = require("../models/stationModel");
const UserModel = require("../models/userModel");

async function updateCancellableTickets(){
    try{
        console.log("Running updateCancellableTickets...")
        const updatedTickets = await StationModel.updateCancellableTickets();
        console.log('Ran updateCancellableTickets, updated following tickets', updatedTickets);
    }catch(error){
        console.error('Error in updateCancellableTickets', error)
    }
}

async function updateUsersWallet(){
    try{
        console.log("Running updateUsersWallet...")
        const expiredUserTickets = await StationModel.getExpiredUserTickets();
        console.log("updateUsersWallet: Found expired tickets", expiredUserTickets);
        if(Array.isArray(expiredUserTickets)){
            for(let expiredTicket of expiredUserTickets){
                const userId = expiredTicket.user_id;
                const ticketId = expiredTicket.ticket_id;
                //The unused ticket fee is 10% of the original ticket price
                const unsusedBikeFee = Math.round((Number(expiredTicket.price) * 0.1) * 100) / 100;
                console.log(`updateUsersWallet: Deducting unused bike fee of ${unsusedBikeFee} from wallet of user ${userId} `);
                await UserModel.deductMoneyFromWallet(userId, unsusedBikeFee);
                await UserModel.updateTicketStatus(ticketId, "returned");
            }
        }
        console.log('Ran updateUsersWallet');
    }catch(error){
        console.error('Error in updateUsersWallet', error)
    }
}

const startScheduler = (intervalMinutes) => {
    const intervalMs = minutesToMilliseconds(intervalMinutes);
    console.log("Started scheduler")
    setInterval(() => {
        console.log("Triggering scheduler jobs...")
        //Update eligiable for cancellation state of tickets
        updateCancellableTickets();
        updateUsersWallet();
        console.log(`Triggered scheduler jobs, waiting ${intervalMinutes} minute`)
    }, intervalMs)
}

module.exports = {
    startScheduler
}

