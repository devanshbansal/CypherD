import express from 'express';
import { addBooking, getInProgressBooking, getUserBookings, deleteBooking } from '../controllers/BookingController.js';

const router = express.Router();

router.post('/addBooking', addBooking);
router.get('/userBookings', getUserBookings);
router.get('/inProgress', getInProgressBooking);
router.delete('/userBookings', deleteBooking)


export default router;