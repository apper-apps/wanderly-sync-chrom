import bookingsData from '@/services/mockData/bookings.json'

class BookingService {
  constructor() {
    this.bookings = bookingsData
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.bookings]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const booking = this.bookings.find(b => b.Id === id)
    if (!booking) {
      throw new Error('Booking not found')
    }
    return { ...booking }
  }

  async create(bookingData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newBooking = {
      ...bookingData,
      Id: Math.max(...this.bookings.map(b => b.Id)) + 1
    }
    this.bookings.push(newBooking)
    return { ...newBooking }
  }

  async update(id, bookingData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.bookings.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error('Booking not found')
    }
    this.bookings[index] = { ...this.bookings[index], ...bookingData }
    return { ...this.bookings[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = this.bookings.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error('Booking not found')
    }
    this.bookings.splice(index, 1)
    return true
  }
}

export const bookingService = new BookingService()